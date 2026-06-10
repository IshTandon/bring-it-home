import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const LIB = path.join(SRC, 'lib');

// ── Result tracking ──────────────────────────────────────

let passes = 0;
let failures = 0;
let warnings = 0;

function pass(msg: string) { passes++; console.log(`✅ ${msg}`); }
function fail(msg: string) { failures++; console.log(`❌ ${msg}`); }
function warn(msg: string) { warnings++; console.log(`⚠️ ${msg}`); }
function header(title: string) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'═'.repeat(60)}`);
}

// ── Types ────────────────────────────────────────────────

interface SquadPlayer {
  id: string;
  name: string;
  number: number;
  club: string;
  age: number;
  apiId?: number;
}

interface SquadData {
  gk: SquadPlayer[];
  def: SquadPlayer[];
  mid: SquadPlayer[];
  fwd: SquadPlayer[];
}

// ── TS → JS helpers ─────────────────────────────────────

function stripSquadTs(code: string): string {
  return code
    .replace(/^import\s+.*$/gm, '')
    .replace(/\bexport\s+/g, '')
    .replace(/\bconst\s+/g, 'var ')
    .replace(/:\s*SquadList\b/g, '')
    .replace(/\/\/.*$/gm, '');
}

function stripHistoryTs(code: string): string {
  return code
    .replace(/^import\s+.*$/gm, '')
    .replace(/^interface\s+\w+\s*\{.*\}$/gm, '')
    .replace(/\bexport\s+/g, '')
    .replace(/\bconst\s+/g, 'var ')
    .replace(/:\s*TournamentHistoryEntry\[\]/g, '')
    .replace(/\/\/.*$/gm, '');
}

function stripOverrideTs(code: string): string {
  return code
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/^import\s+.*$/gm, '')
    .replace(/\bexport\s+/g, '')
    .replace(/\bconst\s+/g, 'var ')
    .replace(/:\s*Record<[^>]+>/g, '');
}

function stripTeamTs(code: string): string {
  return code
    .replace(/^import\s+.*$/gm, '')
    .replace(/\bexport\s+/g, '')
    .replace(/\bconst\s+/g, 'var ')
    .replace(/:\s*Omit<[^>]+>(?:\[\])?/g, '')
    .replace(/function ratingFromRank\(rank:\s*number\):\s*number/g,
             'function ratingFromRank(rank)')
    .replace(/\/\/.*$/gm, '');
}

function evalInSandbox(code: string, globals: Record<string, unknown> = {}): Record<string, unknown> {
  const sandbox: Record<string, unknown> = { Math, ...globals };
  vm.runInNewContext(code, sandbox);
  return sandbox;
}

// ══════════════════════════════════════════════════════════
//  1. SQUAD FILES
// ══════════════════════════════════════════════════════════

function validateSquads(): Map<string, SquadData> {
  header('1. SQUAD FILES (src/lib/squads/)');

  const squadsDir = path.join(LIB, 'squads');
  const rawFiles = fs.readdirSync(squadsDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts');
  const seen = new Set<string>();
  const files = rawFiles.filter(f => {
    const upper = f.toUpperCase();
    if (seen.has(upper)) return false;
    seen.add(upper);
    return true;
  }).sort();

  if (files.length === 48) {
    pass(`Exactly 48 squad files found`);
  } else {
    fail(`Expected 48 squad files, found ${files.length}`);
  }

  const allSquads = new Map<string, SquadData>();
  const globalPlayerIds = new Map<string, string>();

  const RETIRED_IDS = [
    'griezmann', 'di-maria', 'gundogan', 'kroos', 'busquets',
    'hazard', 'lloris', 'benzema', 'neuer',
  ];

  for (const file of files) {
    const teamId = path.basename(file, '.ts');
    const filepath = path.join(squadsDir, file);

    try {
      const raw = fs.readFileSync(filepath, 'utf-8');
      const code = stripSquadTs(raw);
      const sandbox = evalInSandbox(code);
      const squad = sandbox[`SQUAD_${teamId}`] as SquadData | undefined;

      if (!squad) {
        fail(`${teamId}: Could not load squad (expected SQUAD_${teamId})`);
        continue;
      }
      allSquads.set(teamId, squad);

      const all: SquadPlayer[] = [
        ...squad.gk, ...squad.def, ...squad.mid, ...squad.fwd,
      ];

      // Player count
      if (all.length >= 23 && all.length <= 26) {
        pass(`${teamId}: ${all.length} players`);
      } else {
        fail(`${teamId}: ${all.length} players (expected 23–26)`);
      }

      // Duplicate IDs
      const ids = all.map(p => p.id);
      const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (dupeIds.length === 0) {
        pass(`${teamId}: No duplicate player IDs`);
      } else {
        fail(`${teamId}: Duplicate player IDs — ${Array.from(new Set(dupeIds)).join(', ')}`);
      }

      // Duplicate jersey numbers
      const nums = all.map(p => p.number);
      const dupeNums = nums.filter((n, i) => nums.indexOf(n) !== i);
      if (dupeNums.length === 0) {
        pass(`${teamId}: No duplicate jersey numbers`);
      } else {
        fail(`${teamId}: Duplicate jersey numbers — ${Array.from(new Set(dupeNums)).join(', ')}`);
      }

      // Required fields and age sanity
      let fieldsOk = true;
      for (const p of all) {
        const missing: string[] = [];
        if (!p.id) missing.push('id');
        if (!p.name) missing.push('name');
        if (p.number == null) missing.push('number');
        if (!p.club) missing.push('club');
        if (p.age == null) missing.push('age');
        if (missing.length) {
          fail(`${teamId}/${p.id || '?'}: Missing fields — ${missing.join(', ')}`);
          fieldsOk = false;
        }
        if (p.age != null && (p.age < 16 || p.age > 45)) {
          fail(`${teamId}/${p.id}: Age ${p.age} outside 16–45`);
          fieldsOk = false;
        }
      }
      if (fieldsOk) pass(`${teamId}: All required fields present, ages valid`);

      // Cross-squad player ID uniqueness (informational — lookups are team-scoped)
      for (const p of all) {
        if (globalPlayerIds.has(p.id)) {
          warn(`Player ID "${p.id}" appears in both ${globalPlayerIds.get(p.id)} and ${teamId}`);
        } else {
          globalPlayerIds.set(p.id, teamId);
        }
      }

      // Known retired players
      for (const p of all) {
        if (RETIRED_IDS.includes(p.id)) {
          warn(`${teamId}: Possibly retired player — ${p.name} (${p.id})`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      fail(`${teamId}: Parse error — ${msg}`);
    }
  }

  pass(`Cross-squad uniqueness checked — ${globalPlayerIds.size} players across ${allSquads.size} squads`);
  return allSquads;
}

// ══════════════════════════════════════════════════════════
//  2. HISTORY DATA
// ══════════════════════════════════════════════════════════

function validateHistory(): void {
  header('2. HISTORY DATA (src/lib/data-history.ts)');

  const raw = fs.readFileSync(path.join(LIB, 'data-history.ts'), 'utf-8');
  const code = stripHistoryTs(raw);
  const sandbox = evalInSandbox(code);
  const history = sandbox.TOURNAMENT_HISTORY as any[] | undefined;

  if (!history || !Array.isArray(history)) {
    fail('Could not load TOURNAMENT_HISTORY');
    return;
  }

  pass(`${history.length} tournament entries loaded (2002–2022)`);

  for (const entry of history) {
    const yr = entry.year;

    // winner
    if (entry.winner?.name && entry.winner?.flag && entry.winner?.id) {
      pass(`${yr}: winner field present`);
    } else {
      fail(`${yr}: Missing or incomplete winner field`);
    }

    // runnerUp
    if (entry.runnerUp?.name && entry.runnerUp?.flag && entry.runnerUp?.id) {
      pass(`${yr}: runnerUp field present`);
    } else {
      fail(`${yr}: Missing or incomplete runnerUp field`);
    }

    // host / hostFlag / finalScore
    if (entry.host && entry.hostFlag) {
      pass(`${yr}: host fields present`);
    } else {
      fail(`${yr}: Missing or incomplete host/hostFlag`);
    }

    if (entry.finalScore) {
      pass(`${yr}: finalScore field present`);
    } else {
      fail(`${yr}: Missing finalScore field`);
    }

    // topTeams
    if (Array.isArray(entry.topTeams) && entry.topTeams.length > 0) {
      pass(`${yr}: topTeams field present (${entry.topTeams.length} teams)`);
    } else {
      fail(`${yr}: Missing or empty topTeams field`);
    }

    // Goal counts
    if (Array.isArray(entry.topPlayers)) {
      for (const p of entry.topPlayers) {
        if (p.goals > 8) {
          warn(`${yr}: ${p.name} has ${p.goals} goals (> 8 — unusually high for modern era)`);
        }
      }

      // Ratings 1.0–10.0
      let ratingsOk = true;
      for (const p of entry.topPlayers) {
        if (p.rating < 1.0 || p.rating > 10.0) {
          fail(`${yr}: ${p.name} rating ${p.rating} outside 1.0–10.0`);
          ratingsOk = false;
        }
      }
      if (ratingsOk) pass(`${yr}: All player ratings within 1.0–10.0`);
    }
  }
}

// ══════════════════════════════════════════════════════════
//  3. STADIUMS
// ══════════════════════════════════════════════════════════

function extractArrayLiteral(content: string, varName: string): unknown[] | null {
  const re = new RegExp(
    `(?:export\\s+)?(?:const|var|let)\\s+${varName}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`
  );
  const m = content.match(re);
  if (!m) return null;
  const sandbox = evalInSandbox(`var __r = ${m[1]};`);
  return sandbox.__r as unknown[];
}

function validateStadiums(): void {
  header('3. STADIUMS (src/lib/data.ts)');

  const content = fs.readFileSync(path.join(LIB, 'data.ts'), 'utf-8');
  const stadiums = extractArrayLiteral(content, 'STADIUMS') as any[] | null;

  if (!stadiums) {
    fail('Could not extract STADIUMS array from data.ts');
    return;
  }

  // Count
  if (stadiums.length === 16) {
    pass(`Exactly 16 stadiums`);
  } else {
    fail(`Expected 16 stadiums, found ${stadiums.length}`);
  }

  // Country distribution
  const byCountry: Record<string, number> = {};
  for (const s of stadiums) {
    byCountry[s.hostCountry] = (byCountry[s.hostCountry] || 0) + 1;
  }
  const expected: Record<string, number> = { USA: 11, MEX: 3, CAN: 2 };
  for (const [country, count] of Object.entries(expected)) {
    if (byCountry[country] === count) {
      pass(`${country}: ${count} stadiums`);
    } else {
      fail(`${country}: expected ${count} stadiums, found ${byCountry[country] || 0}`);
    }
  }

  // Capacity 40000–90000
  let capOk = true;
  for (const s of stadiums) {
    if (s.capacity < 40000 || s.capacity > 90000) {
      fail(`${s.name}: capacity ${s.capacity} outside 40,000–90,000`);
      capOk = false;
    }
  }
  if (capOk) pass('All capacities within 40,000–90,000');

  // Lat/lng bounds (North America: lat 14–60, lng -130 to -60)
  let geoOk = true;
  for (const s of stadiums) {
    if (s.lat < 14 || s.lat > 60) {
      fail(`${s.name}: latitude ${s.lat} outside 14–60`);
      geoOk = false;
    }
    if (s.lng < -130 || s.lng > -60) {
      fail(`${s.name}: longitude ${s.lng} outside -130 to -60`);
      geoOk = false;
    }
  }
  if (geoOk) pass('All coordinates within North America bounds');
}

// ══════════════════════════════════════════════════════════
//  4. PLAYER STATS
// ══════════════════════════════════════════════════════════

const POS_ATTRS: Record<string, Record<string, number>> = {
  GK:  { PAC: 45, SHO: 15, PAS: 55, DRI: 18, DEF: 88, PHY: 80 },
  CB:  { PAC: 62, SHO: 35, PAS: 65, DRI: 55, DEF: 85, PHY: 82 },
  LB:  { PAC: 80, SHO: 42, PAS: 70, DRI: 65, DEF: 76, PHY: 72 },
  RB:  { PAC: 82, SHO: 42, PAS: 68, DRI: 62, DEF: 74, PHY: 70 },
  DEF: { PAC: 68, SHO: 38, PAS: 66, DRI: 58, DEF: 82, PHY: 78 },
  CDM: { PAC: 65, SHO: 55, PAS: 75, DRI: 68, DEF: 78, PHY: 80 },
  CM:  { PAC: 68, SHO: 65, PAS: 78, DRI: 72, DEF: 65, PHY: 72 },
  CAM: { PAC: 72, SHO: 72, PAS: 82, DRI: 80, DEF: 40, PHY: 62 },
  MID: { PAC: 70, SHO: 62, PAS: 76, DRI: 72, DEF: 60, PHY: 70 },
  LW:  { PAC: 88, SHO: 78, PAS: 72, DRI: 82, DEF: 28, PHY: 62 },
  RW:  { PAC: 86, SHO: 76, PAS: 74, DRI: 80, DEF: 30, PHY: 60 },
  ST:  { PAC: 80, SHO: 85, PAS: 62, DRI: 75, DEF: 25, PHY: 78 },
  CF:  { PAC: 78, SHO: 82, PAS: 72, DRI: 78, DEF: 30, PHY: 72 },
  FWD: { PAC: 84, SHO: 80, PAS: 68, DRI: 78, DEF: 28, PHY: 70 },
};

function getPos(section: string, idx: number): string {
  if (section === 'gk') return 'GK';
  if (section === 'def') return ['CB','CB','CB','CB','LB','RB','CB','RB'][idx % 8];
  if (section === 'mid') return ['CDM','CM','CM','CAM','CM','CDM','CM','CAM'][idx % 8];
  return ['ST','LW','RW','ST','CF','LW','RW'][idx % 7];
}

interface TeamInfo { id: string; rating: number; }

function loadTeamOrder(): TeamInfo[] {
  const teams: TeamInfo[] = [];

  for (const file of ['data-teams-af.ts', 'data-teams-gl.ts']) {
    const filepath = path.join(LIB, file);
    if (!fs.existsSync(filepath)) continue;

    const raw = fs.readFileSync(filepath, 'utf-8');
    const code = stripTeamTs(raw);
    const sandbox = evalInSandbox(code);
    const arr = (sandbox.TEAMS_AF || sandbox.TEAMS_GL) as any[] | undefined;
    if (arr) {
      for (const t of arr) {
        teams.push({ id: t.id, rating: t.rating });
      }
    }
  }
  return teams;
}

function validatePlayerStats(allSquads: Map<string, SquadData>): void {
  header('4. PLAYER STATS (players.ts + player-stats-override.ts)');

  // ── 4a. Override map ──────────────────────────────────

  const overrideRaw = fs.readFileSync(path.join(LIB, 'player-stats-override.ts'), 'utf-8');
  const overrideCode = stripOverrideTs(overrideRaw);
  const overrideSandbox = evalInSandbox(overrideCode);
  const overrides = overrideSandbox.PLAYER_STATS_OVERRIDE as Record<string, number[]> | undefined;

  if (!overrides) {
    fail('Could not load PLAYER_STATS_OVERRIDE');
    return;
  }

  const overrideEntries = Object.entries(overrides);
  pass(`${overrideEntries.length} player stat overrides loaded`);

  // Check override values 1–99
  let overrideRangeOk = true;
  for (const [key, tuple] of overrideEntries) {
    for (const v of tuple) {
      if (v < 1 || v > 99) {
        fail(`Override "${key}": attribute value ${v} outside 1–99`);
        overrideRangeOk = false;
      }
    }
  }
  if (overrideRangeOk) pass('All override attributes within 1–99');

  // Check override duplicates
  const tupleMap = new Map<string, string[]>();
  for (const [key, tuple] of overrideEntries) {
    const sig = tuple.join(',');
    if (!tupleMap.has(sig)) tupleMap.set(sig, []);
    tupleMap.get(sig)!.push(key);
  }
  let overrideDupesFound = false;
  for (const [sig, players] of Array.from(tupleMap.entries())) {
    if (players.length > 1) {
      fail(`Duplicate override attributes [${sig}] — ${players.join(', ')}`);
      overrideDupesFound = true;
    }
  }
  if (!overrideDupesFound) pass('No duplicate attribute tuples in overrides');

  // ── 4b. Build all players and check attrs ─────────────

  const teamOrder = loadTeamOrder();
  if (teamOrder.length === 0) {
    fail('Could not load team order from data-teams-af/gl.ts');
    return;
  }

  const ATTR_KEYS = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'] as const;
  const SECTIONS: (keyof SquadData)[] = ['gk', 'def', 'mid', 'fwd'];
  const ATTR_SHIFTS = [0, 3, 6, 9, 12, 15];
  const ATTR_SCALES = [12, 12, 10, 12, 8, 8];

  function clamp(min: number, max: number, v: number): number {
    return Math.min(max, Math.max(min, Math.round(v)));
  }

  function clampAttr(v: number): number {
    return clamp(1, 99, v);
  }

  const attrSignatures = new Map<string, string>();
  let totalPlayers = 0;
  let attrRangeOk = true;
  let dupsFound = false;

  for (const team of teamOrder) {
    const squad = allSquads.get(team.id);
    if (!squad) continue;

    for (const section of SECTIONS) {
      const players = squad[section];
      for (let i = 0; i < players.length; i++) {
        const sp = players[i];
        const pos = getPos(section, i);
        const base = POS_ATTRS[pos] || POS_ATTRS.MID;
        const scale = (team.rating - 58) / 37;

        const override = overrides[`${team.id}:${sp.id}`];
        let attrs: number[];

        if (override) {
          attrs = [...override];
        } else {
          const nameHash = sp.name.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
          const jitter = (Math.abs(nameHash) % 17) - 8;
          const ovr = clamp(58, 95, 58 + scale * 34 + jitter);
          const attrScale = (ovr - 58) / 37;
          const absHash = Math.abs(nameHash);
          attrs = ATTR_KEYS.map((key, ki) =>
            clampAttr(base[key] + attrScale * ATTR_SCALES[ki] + ((absHash >> ATTR_SHIFTS[ki]) % 7) - 3)
          );
        }

        const fullId = `${team.id.toLowerCase()}-${sp.id}`;

        for (const v of attrs) {
          if (v < 1 || v > 99) {
            fail(`${fullId}: computed attribute ${v} outside 1–99`);
            attrRangeOk = false;
          }
        }

        const sig = attrs.join(',');
        if (attrSignatures.has(sig)) {
          fail(`Duplicate attrs [${sig}] — ${attrSignatures.get(sig)} and ${fullId} (${sp.name})`);
          dupsFound = true;
        } else {
          attrSignatures.set(sig, `${fullId} (${sp.name})`);
        }

        totalPlayers++;
      }
    }
  }

  if (attrRangeOk) pass('All computed attributes within 1–99');
  if (!dupsFound) pass('No duplicate attribute arrays across all players');

  console.log(`\n   Total player count across all squads: ${totalPlayers}`);
}

// ══════════════════════════════════════════════════════════
//  5. GROUPS
// ══════════════════════════════════════════════════════════

function validateGroups(): void {
  header('5. GROUPS (src/lib/data.ts)');

  const content = fs.readFileSync(path.join(LIB, 'data.ts'), 'utf-8');
  const groups = extractArrayLiteral(content, 'GROUP_DEFS') as any[] | null;

  if (!groups) {
    fail('Could not extract GROUP_DEFS from data.ts');
    return;
  }

  // 12 groups
  if (groups.length === 12) {
    pass('Exactly 12 groups (A–L)');
  } else {
    fail(`Expected 12 groups, found ${groups.length}`);
  }

  // Correct group letters
  const expectedLetters = 'ABCDEFGHIJKL'.split('');
  const actualLetters = groups.map((g: any) => g.id).sort();
  if (JSON.stringify(actualLetters) === JSON.stringify(expectedLetters)) {
    pass('Groups are A through L');
  } else {
    fail(`Expected groups A–L, found: ${actualLetters.join(', ')}`);
  }

  // 4 teams per group
  let sizeOk = true;
  for (const g of groups) {
    if (!g.teamIds || g.teamIds.length !== 4) {
      fail(`Group ${g.id}: expected 4 teams, found ${g.teamIds?.length ?? 0}`);
      sizeOk = false;
    }
  }
  if (sizeOk) pass('All groups have exactly 4 teams');

  // 48 total, no duplicates
  const allTeamIds: string[] = groups.flatMap((g: any) => g.teamIds || []);
  if (allTeamIds.length === 48) {
    pass('48 total team slots across all groups');
  } else {
    fail(`Expected 48 total team slots, found ${allTeamIds.length}`);
  }

  const teamSet = new Set<string>();
  let dupes = false;
  for (const id of allTeamIds) {
    if (teamSet.has(id)) {
      fail(`Team "${id}" appears in more than one group`);
      dupes = true;
    }
    teamSet.add(id);
  }
  if (!dupes) pass('No team appears in multiple groups');
}

// ══════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║        BRING IT HOME — Data Validation Audit          ║');
console.log('╚════════════════════════════════════════════════════════╝');

const allSquads = validateSquads();
validateHistory();
validateStadiums();
validatePlayerStats(allSquads);
validateGroups();

// ── Summary ──────────────────────────────────────────────

const total = passes + failures + warnings;
console.log(`\n${'═'.repeat(60)}`);
console.log('  SUMMARY');
console.log(`${'═'.repeat(60)}`);
console.log(`  Total checks:  ${total}`);
console.log(`  ✅ Passed:     ${passes}`);
console.log(`  ❌ Failed:     ${failures}`);
console.log(`  ⚠️  Warnings:   ${warnings}`);
console.log(`${'═'.repeat(60)}`);

if (failures > 0) {
  console.log('\n  Result: FAIL — fix the errors above before shipping.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log('\n  Result: PASS with warnings — review the items above.\n');
  process.exit(0);
} else {
  console.log('\n  Result: ALL CLEAR — data looks solid.\n');
  process.exit(0);
}
