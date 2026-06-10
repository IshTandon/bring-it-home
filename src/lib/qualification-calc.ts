import type { Group, Match, Team, StandingRow } from '@/types';
import { computeGroupStandings, type MatchOutcome } from './standings';

export { computeGroupStandings, type MatchOutcome };

// ─── Shared types (used by IfThisHappens, ChaosMode, etc.) ──

export type Result = 'home' | 'draw' | 'away';

export interface MatchResult {
  matchId: string;
  result: Result | null;
  homeScore: number;
  awayScore: number;
}

// ─── Qualification status types ──────────────────────────────

export interface QualificationStatus {
  status: 'qualified' | 'alive' | 'eliminated';
  probability: number;
  thirdPlaceDependent: boolean;
  guaranteedIf: string[];
  possibleIf: string[];
  eliminatedIf: string[];
}

// ─── Helpers shared with IfThisHappens ───────────────────────

export function defaultResults(matches: Match[]): MatchResult[] {
  return matches.map(m => ({
    matchId: m.id,
    result: null,
    homeScore: 0,
    awayScore: 0,
  }));
}

export function computeStandings(group: Group, results: MatchResult[]): StandingRow[] {
  const outcomes: MatchOutcome[] = [];
  group.matches.forEach((match, idx) => {
    const r = results[idx];
    if (!r || r.result === null) return;
    outcomes.push({
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      homeGoals: r.homeScore,
      awayGoals: r.awayScore,
    });
  });

  const rows = computeGroupStandings(group.teams, outcomes);

  const decidedCount = results.filter(r => r.result !== null).length;
  const totalMatches = group.matches.length;

  rows.forEach((row, idx) => {
    if (decidedCount === 0) {
      row.qualProb = 50;
    } else if (decidedCount === totalMatches) {
      row.qualProb = idx < 2 ? 100 : 0;
    } else {
      const maxRemainingPts = (totalMatches - decidedCount) * 3;
      const leader = rows[0]?.points ?? 0;
      const gap = leader - row.points;
      const canCatch = maxRemainingPts >= gap;
      if (idx < 2) {
        row.qualProb = Math.min(98, 50 + row.points * 8 - idx * 5);
      } else {
        row.qualProb = canCatch ? Math.max(2, 50 - gap * 10) : 0;
      }
      row.qualProb = Math.max(0, Math.min(100, row.qualProb));
    }
  });

  return rows;
}

// ─── Internal types for enumeration ──────────────────────────

type WDL = 'W' | 'D' | 'L';
const WDL_ALL: WDL[] = ['W', 'D', 'L'];
const THIRD_PLACE_QUAL_RATE = 8 / 12;

interface SimpleMatch {
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeRating: number;
  awayRating: number;
}

// ─── Score conversion ────────────────────────────────────────

function wdlToGoals(o: WDL): [number, number] {
  return o === 'W' ? [1, 0] : o === 'D' ? [0, 0] : [0, 1];
}

function wdlToGoalsBoosted(o: WDL): [number, number] {
  return o === 'W' ? [3, 0] : o === 'D' ? [0, 0] : [0, 3];
}

// ─── Rating-based probability model ─────────────────────────

function getMatchProbs(homeRating: number, awayRating: number): Record<WDL, number> {
  const diff = homeRating - awayRating;
  const homeStrength = 1 / (1 + Math.pow(10, -diff / 15));
  const mismatch = Math.min(1, Math.abs(diff) / 30);
  const drawProb = Math.max(0.12, 0.27 - 0.15 * mismatch);
  const decisive = 1 - drawProb;
  return { W: decisive * homeStrength, D: drawProb, L: decisive * (1 - homeStrength) };
}

// ─── Permutation enumeration ─────────────────────────────────

function enumerateAll(n: number): WDL[][] {
  if (n === 0) return [[]];
  const result: WDL[][] = [];
  const sub = enumerateAll(n - 1);
  for (const o of WDL_ALL) {
    for (const rest of sub) {
      result.push([o, ...rest]);
    }
  }
  return result;
}

// ─── Standings for a single permutation ──────────────────────

function standingsForPerm(
  teams: Team[],
  base: MatchOutcome[],
  remaining: SimpleMatch[],
  perm: WDL[],
  toGoals: (o: WDL) => [number, number]
): StandingRow[] {
  const outcomes: MatchOutcome[] = [...base];
  for (let i = 0; i < remaining.length; i++) {
    const [h, a] = toGoals(perm[i]);
    outcomes.push({
      homeTeamId: remaining[i].homeTeamId,
      awayTeamId: remaining[i].awayTeamId,
      homeGoals: h,
      awayGoals: a,
    });
  }
  return computeGroupStandings(teams, outcomes);
}

function teamRank(standings: StandingRow[], teamId: string): number {
  const idx = standings.findIndex(s => s.team.id === teamId);
  return idx < 0 ? 4 : idx + 1;
}

// ─── Condition string helpers ────────────────────────────────

function describeOwn(teamId: string, m: SimpleMatch, outcome: WDL): string {
  const isHome = m.homeTeamId === teamId;
  const opponent = isHome ? m.awayTeamName : m.homeTeamName;
  const wins = (isHome && outcome === 'W') || (!isHome && outcome === 'L');
  if (wins) return `beat ${opponent}`;
  if (outcome === 'D') return `draw with ${opponent}`;
  return `lose to ${opponent}`;
}

function describeOther(m: SimpleMatch, outcome: WDL, negate = false): string {
  if (negate) {
    if (outcome === 'W') return `${m.homeTeamName} don't beat ${m.awayTeamName}`;
    if (outcome === 'L') return `${m.awayTeamName} don't beat ${m.homeTeamName}`;
    return `${m.homeTeamName} and ${m.awayTeamName} don't draw`;
  }
  if (outcome === 'W') return `${m.homeTeamName} beat ${m.awayTeamName}`;
  if (outcome === 'L') return `${m.awayTeamName} beat ${m.homeTeamName}`;
  return `${m.homeTeamName} draw with ${m.awayTeamName}`;
}

function describeGdFallback(m: SimpleMatch): string {
  return `depends on goal difference in ${m.homeTeamName} vs ${m.awayTeamName}`;
}

function summariseOtherDep(
  others: SimpleMatch[],
  qualCombos: WDL[][],
  _total: number
): string | null {
  if (others.length === 0 || qualCombos.length === 0) return null;

  if (others.length === 1) {
    const qualifying = new Set(qualCombos.map(c => c[0]));
    if (qualifying.size === 1) return describeOther(others[0], Array.from(qualifying)[0]);
    if (qualifying.size === 2) {
      const blocked = WDL_ALL.find(o => !qualifying.has(o))!;
      return describeOther(others[0], blocked, true);
    }
    return null;
  }

  for (let i = 0; i < others.length; i++) {
    const atI = new Set(qualCombos.map(c => c[i]));
    if (atI.size === 1) return describeOther(others[i], Array.from(atI)[0]);
    if (atI.size === 2) {
      const blocked = WDL_ALL.find(o => !atI.has(o))!;
      return describeOther(others[i], blocked, true);
    }
  }

  return null;
}

function truncate(s: string, max = 80): string {
  return s.length <= max ? s : s.slice(0, max - 3) + '...';
}

// ─── Condition generation ────────────────────────────────────

interface PermInfo {
  outcomes: WDL[];
  rank: number;
  weight: number;
  gdSensitive: boolean;
}

function buildConditions(
  teamId: string,
  remaining: SimpleMatch[],
  isOwn: boolean[],
  perms: PermInfo[]
): { guaranteedIf: string[]; possibleIf: string[]; eliminatedIf: string[] } {
  const guaranteedIf: string[] = [];
  const possibleIf: string[] = [];
  const eliminatedIf: string[] = [];

  const ownIdxs = remaining.map((_, i) => i).filter(i => isOwn[i]);
  const otherIdxs = remaining.map((_, i) => i).filter(i => !isOwn[i]);
  const otherMatches = otherIdxs.map(i => remaining[i]);

  const byOwnKey = new Map<string, PermInfo[]>();
  for (const pi of perms) {
    const key = ownIdxs.map(i => pi.outcomes[i]).join(',') || '_';
    if (!byOwnKey.has(key)) byOwnKey.set(key, []);
    byOwnKey.get(key)!.push(pi);
  }

  byOwnKey.forEach((group, key) => {
    const ownWDL = key === '_' ? [] : key.split(',') as WDL[];
    const ownDesc = ownWDL
      .map((o, i) => describeOwn(teamId, remaining[ownIdxs[i]], o))
      .join(', ');

    const g2 = group.filter(p => p.rank <= 2);
    const g3 = group.filter(p => p.rank === 3);
    const gd = group.some(p => p.gdSensitive);

    if (g2.length === group.length) {
      guaranteedIf.push(truncate(
        ownDesc ? (gd ? `${ownDesc} (any score)` : ownDesc) : 'already qualified'
      ));
    } else if (g2.length === 0 && g3.length === 0) {
      eliminatedIf.push(truncate(ownDesc || 'already eliminated'));
    } else if (g2.length === 0 && g3.length > 0) {
      possibleIf.push(truncate(
        ownDesc ? `${ownDesc} — 3rd place at best` : '3rd place — depends on other groups'
      ));
    } else {
      const qualOther = g2.map(p => otherIdxs.map(i => p.outcomes[i]));
      let condition: string;

      if (gd && otherMatches.length > 0) {
        const gdMatch = otherMatches.find((_, mi) => {
          const atMi = new Set(qualOther.map(c => c[mi]));
          return atMi.size < 3;
        }) ?? otherMatches[0];
        condition = ownDesc
          ? `${ownDesc}, ${describeGdFallback(gdMatch)}`
          : describeGdFallback(gdMatch);
      } else if (otherMatches.length > 0) {
        const dep = summariseOtherDep(otherMatches, qualOther, group.length);
        condition = dep
          ? (ownDesc ? `${ownDesc} AND ${dep}` : dep)
          : (ownDesc ? `${ownDesc} (depends on other results)` : 'depends on other results');
      } else if (gd) {
        condition = ownDesc
          ? `${ownDesc} (depends on goal difference)`
          : 'depends on goal difference';
      } else {
        condition = ownDesc || 'depends on other results';
      }

      possibleIf.push(truncate(condition));
    }
  });

  return { guaranteedIf, possibleIf, eliminatedIf };
}

// ─── Main export ─────────────────────────────────────────────

export function getQualificationStatus(
  teamId: string,
  group: Group,
  playedResults: MatchResult[],
  remainingMatches: Match[]
): QualificationStatus {
  const teams = group.teams;

  const matchMap = new Map(group.matches.map(m => [m.id, m]));
  const base: MatchOutcome[] = playedResults
    .filter(r => r.result !== null)
    .map(r => {
      const m = matchMap.get(r.matchId)!;
      return {
        homeTeamId: m.homeTeam.id,
        awayTeamId: m.awayTeam.id,
        homeGoals: r.homeScore,
        awayGoals: r.awayScore,
      };
    });

  const remaining: SimpleMatch[] = remainingMatches.map(m => ({
    homeTeamId: m.homeTeam.id,
    awayTeamId: m.awayTeam.id,
    homeTeamName: m.homeTeam.name,
    awayTeamName: m.awayTeam.name,
    homeRating: m.homeTeam.rating,
    awayRating: m.awayTeam.rating,
  }));

  // No remaining matches — deterministic
  if (remaining.length === 0) {
    const standings = computeGroupStandings(teams, base);
    const rank = teamRank(standings, teamId);
    return {
      status: rank <= 2 ? 'qualified' : rank === 3 ? 'alive' : 'eliminated',
      probability: rank <= 2 ? 100 : rank === 3 ? Math.round(THIRD_PLACE_QUAL_RATE * 100) : 0,
      thirdPlaceDependent: rank === 3,
      guaranteedIf: rank <= 2 ? ['already qualified'] : [],
      possibleIf: rank === 3 ? ['3rd place — depends on other groups'] : [],
      eliminatedIf: rank >= 4 ? ['already eliminated'] : [],
    };
  }

  // Partition own vs other remaining matches
  const isOwn = remaining.map(m => m.homeTeamId === teamId || m.awayTeamId === teamId);

  const matchProbs = remaining.map(m => getMatchProbs(m.homeRating, m.awayRating));
  const allPerms = enumerateAll(remaining.length);

  // Analyse every permutation
  const permInfos: PermInfo[] = [];

  for (const p of allPerms) {
    const stdNorm = standingsForPerm(teams, base, remaining, p, wdlToGoals);
    const stdBoost = standingsForPerm(teams, base, remaining, p, wdlToGoalsBoosted);
    const rank = teamRank(stdNorm, teamId);
    const rankB = teamRank(stdBoost, teamId);

    let weight = 1;
    for (let i = 0; i < remaining.length; i++) weight *= matchProbs[i][p[i]];

    permInfos.push({ outcomes: p, rank, weight, gdSensitive: rank !== rankB });
  }

  // Aggregate
  let top2Weight = 0;
  let thirdWeight = 0;
  let totalWeight = 0;
  let top2Count = 0;
  let thirdCount = 0;

  for (const pi of permInfos) {
    totalWeight += pi.weight;
    if (pi.rank <= 2) { top2Weight += pi.weight; top2Count++; }
    else if (pi.rank === 3) { thirdWeight += pi.weight; thirdCount++; }
  }

  const n = permInfos.length;
  const status: QualificationStatus['status'] =
    top2Count === n ? 'qualified'
    : top2Count === 0 && thirdCount === 0 ? 'eliminated'
    : 'alive';

  const probability = Math.round(
    ((top2Weight + thirdWeight * THIRD_PLACE_QUAL_RATE) / totalWeight) * 100
  );
  const thirdPlaceDependent = thirdCount > 0 && top2Count < n;

  const conditions = buildConditions(teamId, remaining, isOwn, permInfos);

  return {
    status,
    probability,
    thirdPlaceDependent,
    ...conditions,
  };
}
