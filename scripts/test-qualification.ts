/**
 * Test scenarios for getQualificationStatus.
 *
 * Run:  npx tsx scripts/test-qualification.ts
 */

import type { Team, Match, Group } from '../src/types';
import {
  getQualificationStatus,
  computeStandings,
  type MatchResult,
  type QualificationStatus,
} from '../src/lib/qualification-calc';

// ─── Minimal factories ──────────────────────────────────────

function makeTeam(id: string, name: string, flag: string, rating: number, rank: number): Team {
  return {
    id, name, flag, rating, rank,
    group: 'J', coach: '', mascot: '', style: '', titles: 0,
    finals: 0, semifinals: 0, bestResult: '', facts: [], players: [],
  };
}

function makeMatch(id: string, home: Team, away: Team): Match {
  return {
    id, homeTeam: home, awayTeam: away,
    homeScore: null, awayScore: null, status: 'NS',
    stadium: 'MetLife Stadium', city: 'East Rutherford, NJ',
    date: '2026-06-20', time: '20:00 ET',
    round: 'Group Stage', group: 'Group J', events: [],
  };
}

// ─── Group J setup ──────────────────────────────────────────

const ARG = makeTeam('ARG', 'Argentina', '🇦🇷', 93, 1);
const AUT = makeTeam('AUT', 'Austria', '🇦🇹', 75, 25);
const ALG = makeTeam('ALG', 'Algeria', '🇩🇿', 67, 40);
const JOR = makeTeam('JOR', 'Jordan', '🇯🇴', 62, 70);

// Round-robin: 0: ARG-AUT, 1: ALG-JOR, 2: ARG-ALG, 3: AUT-JOR, 4: ARG-JOR, 5: AUT-ALG
const allMatches = [
  makeMatch('gJ-0', ARG, AUT),
  makeMatch('gJ-1', ALG, JOR),
  makeMatch('gJ-2', ARG, ALG),
  makeMatch('gJ-3', AUT, JOR),
  makeMatch('gJ-4', ARG, JOR),
  makeMatch('gJ-5', AUT, ALG),
];

const groupJ: Group = {
  id: 'J', name: 'Group J',
  teams: [ARG, AUT, ALG, JOR],
  standings: [],
  matches: allMatches,
};

// ─── Pretty printer ─────────────────────────────────────────

function printStatus(label: string, teamName: string, s: QualificationStatus) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}`);
  console.log(`  ${label}`);
  console.log(`  Team: ${teamName}`);
  console.log(bar);
  console.log(`  Status:       ${s.status.toUpperCase()}`);
  console.log(`  Probability:  ${s.probability}%`);
  console.log(`  3rd-place:    ${s.thirdPlaceDependent}`);
  if (s.guaranteedIf.length) {
    console.log('  Guaranteed if:');
    s.guaranteedIf.forEach(c => console.log(`    ✓ ${c}`));
  }
  if (s.possibleIf.length) {
    console.log('  Possible if:');
    s.possibleIf.forEach(c => console.log(`    ~ ${c}`));
  }
  if (s.eliminatedIf.length) {
    console.log('  Eliminated if:');
    s.eliminatedIf.forEach(c => console.log(`    ✗ ${c}`));
  }
}

function printStandings(label: string, rows: ReturnType<typeof computeStandings>) {
  console.log(`  ${label}`);
  rows.forEach(r => {
    console.log(
      `    ${r.rank}. ${r.team.flag} ${r.team.name.padEnd(12)} ` +
      `P:${r.played} W:${r.won} D:${r.drawn} L:${r.lost} ` +
      `GD:${r.goalDiff >= 0 ? '+' : ''}${r.goalDiff} PTS:${r.points}`
    );
  });
}

// ═════════════════════════════════════════════════════════════
//  SCENARIO 1 — Clearly Qualified
//
//  Played (5 of 6):
//    ARG 2-0 AUT, ALG 0-1 JOR, ARG 3-0 ALG, AUT 2-0 JOR, ARG 1-0 JOR
//  Remaining: AUT vs ALG
//  ARG: 9 pts, +6 GD — already top regardless of final match
// ═════════════════════════════════════════════════════════════

const played1: MatchResult[] = [
  { matchId: 'gJ-0', result: 'home',  homeScore: 2, awayScore: 0 },
  { matchId: 'gJ-1', result: 'away',  homeScore: 0, awayScore: 1 },
  { matchId: 'gJ-2', result: 'home',  homeScore: 3, awayScore: 0 },
  { matchId: 'gJ-3', result: 'home',  homeScore: 2, awayScore: 0 },
  { matchId: 'gJ-4', result: 'home',  homeScore: 1, awayScore: 0 },
  { matchId: 'gJ-5', result: null,    homeScore: 0, awayScore: 0 },
];

const remaining1 = [allMatches[5]];
const standings1 = computeStandings(groupJ, played1);

console.log('\n' + '═'.repeat(60));
console.log('  STANDINGS AFTER 5 MATCHES');
console.log('═'.repeat(60));
printStandings('', standings1);

const result1 = getQualificationStatus('ARG', groupJ, played1, remaining1);
printStatus(
  'SCENARIO 1 — Clearly Qualified (Argentina, 9 pts, all own matches played)',
  'Argentina 🇦🇷',
  result1
);

// ═════════════════════════════════════════════════════════════
//  SCENARIO 2 — Clearly Eliminated
//
//  Same situation, viewed from Algeria's perspective.
//  ALG: 0 pts, GD -4. Even beating Austria leaves ALG 4th on GD.
// ═════════════════════════════════════════════════════════════

const result2 = getQualificationStatus('ALG', groupJ, played1, remaining1);
printStatus(
  'SCENARIO 2 — Clearly Eliminated (Algeria, 0 pts, 1 match left)',
  'Algeria 🇩🇿',
  result2
);

// ═════════════════════════════════════════════════════════════
//  SCENARIO 3 — Knife-edge
//
//  Played (3 of 6):
//    ARG 1-1 AUT, ALG 0-0 JOR, ARG 2-1 ALG
//  Remaining: AUT vs JOR, ARG vs JOR, AUT vs ALG (3 matches = 27 perms)
//
//  ARG 4pts | AUT 1pt | ALG 1pt | JOR 1pt
//  Austria have 2 matches left. Win both and they're through.
//  Lose both and they're out. Everything depends on margins.
// ═════════════════════════════════════════════════════════════

const played3: MatchResult[] = [
  { matchId: 'gJ-0', result: 'draw',  homeScore: 1, awayScore: 1 },
  { matchId: 'gJ-1', result: 'draw',  homeScore: 0, awayScore: 0 },
  { matchId: 'gJ-2', result: 'home',  homeScore: 2, awayScore: 1 },
  { matchId: 'gJ-3', result: null,    homeScore: 0, awayScore: 0 },
  { matchId: 'gJ-4', result: null,    homeScore: 0, awayScore: 0 },
  { matchId: 'gJ-5', result: null,    homeScore: 0, awayScore: 0 },
];

const remaining3 = [allMatches[3], allMatches[4], allMatches[5]];

const standings3 = computeStandings(groupJ, played3);
console.log('\n' + '═'.repeat(60));
console.log('  STANDINGS AFTER 3 MATCHES');
console.log('═'.repeat(60));
printStandings('', standings3);

const result3 = getQualificationStatus('AUT', groupJ, played3, remaining3);
printStatus(
  'SCENARIO 3 — Knife-Edge (Austria, 1 pt, 2 own matches left, 27 permutations)',
  'Austria 🇦🇹',
  result3
);

console.log('\n✅ All 3 qualification scenarios complete.\n');
