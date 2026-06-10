import type { Group, Match, StandingRow } from '@/types';
import type { MatchResult, Result } from './qualification-calc';
import { computeStandings } from './qualification-calc';

export interface UpsetEvent {
  matchId: string;
  description: string;
}

export interface ChaosScenario {
  id: string;
  results: Record<string, { home: number; away: number }>;
  finalStandings: StandingRow[];
  qualifiers: string[];
  thirdPlace: string;
  eliminatedTeams: string[];
  upsets: UpsetEvent[];
}

const COMMON_SCORES: [number, number][] = [
  [1, 0], [2, 0], [2, 1], [1, 1], [0, 0], [3, 1], [3, 0],
];

const RARE_SCORES: [number, number][] = [
  [4, 0], [3, 2], [4, 1], [4, 2], [5, 0], [5, 1], [0, 0],
];

function generateScore(homeRating: number, awayRating: number): { home: number; away: number; result: Result } {
  const ratingDiff = homeRating - awayRating;
  const homeAdvantage = 3;
  const effectiveDiff = ratingDiff + homeAdvantage;

  const homeWinProb = 0.35 + (effectiveDiff / 100);
  const drawProb = 0.28 - Math.abs(effectiveDiff) * 0.003;
  const clampedHomeWin = Math.max(0.1, Math.min(0.8, homeWinProb));
  const clampedDraw = Math.max(0.1, Math.min(0.35, drawProb));
  const awayWinProb = Math.max(0.1, 1 - clampedHomeWin - clampedDraw);

  const roll = Math.random();
  let outcome: 'home' | 'draw' | 'away';
  if (roll < clampedHomeWin) outcome = 'home';
  else if (roll < clampedHomeWin + clampedDraw) outcome = 'draw';
  else outcome = 'away';

  const useCommon = Math.random() < 0.7;
  let homeGoals: number;
  let awayGoals: number;

  if (useCommon) {
    const [g1, g2] = COMMON_SCORES[Math.floor(Math.random() * COMMON_SCORES.length)];
    if (outcome === 'home') {
      homeGoals = Math.max(g1, g2);
      awayGoals = Math.min(g1, g2);
      if (homeGoals === awayGoals) { homeGoals = 1; awayGoals = 0; }
    } else if (outcome === 'away') {
      awayGoals = Math.max(g1, g2);
      homeGoals = Math.min(g1, g2);
      if (homeGoals === awayGoals) { awayGoals = 1; homeGoals = 0; }
    } else {
      const drawScores: [number, number][] = [[0, 0], [1, 1], [2, 2]];
      const pick = drawScores[Math.floor(Math.random() * drawScores.length)];
      homeGoals = pick[0];
      awayGoals = pick[1];
    }
  } else {
    const [g1, g2] = RARE_SCORES[Math.floor(Math.random() * RARE_SCORES.length)];
    if (outcome === 'home') {
      homeGoals = Math.max(g1, g2);
      awayGoals = Math.min(g1, g2);
      if (homeGoals === awayGoals) { homeGoals = 2; awayGoals = 1; }
    } else if (outcome === 'away') {
      awayGoals = Math.max(g1, g2);
      homeGoals = Math.min(g1, g2);
      if (homeGoals === awayGoals) { awayGoals = 2; homeGoals = 1; }
    } else {
      const drawScores: [number, number][] = [[1, 1], [2, 2], [3, 3]];
      const pick = drawScores[Math.floor(Math.random() * drawScores.length)];
      homeGoals = pick[0];
      awayGoals = pick[1];
    }
  }

  homeGoals = Math.min(5, homeGoals);
  awayGoals = Math.min(5, awayGoals);

  const result: Result = homeGoals > awayGoals ? 'home' : awayGoals > homeGoals ? 'away' : 'draw';

  return { home: homeGoals, away: awayGoals, result };
}

function isUpset(winnerRating: number, loserRating: number): boolean {
  return loserRating - winnerRating >= 8;
}

export function generateChaosScenario(
  group: Group,
  playedResults: MatchResult[],
  remainingMatches: Match[],
): ChaosScenario {
  const id = crypto.randomUUID();
  const results: Record<string, { home: number; away: number }> = {};
  const upsets: UpsetEvent[] = [];

  const remainingIds = new Set(remainingMatches.map(m => m.id));
  const generatedByMatchId: Record<string, MatchResult> = {};

  for (const match of remainingMatches) {
    const score = generateScore(match.homeTeam.rating, match.awayTeam.rating);
    results[match.id] = { home: score.home, away: score.away };
    generatedByMatchId[match.id] = {
      matchId: match.id,
      result: score.result,
      homeScore: score.home,
      awayScore: score.away,
    };

    if (score.result === 'home' && isUpset(match.homeTeam.rating, match.awayTeam.rating)) {
      upsets.push({
        matchId: match.id,
        description: `${match.homeTeam.name} beat ${match.awayTeam.name} ${score.home}-${score.away}`,
      });
    } else if (score.result === 'away' && isUpset(match.awayTeam.rating, match.homeTeam.rating)) {
      upsets.push({
        matchId: match.id,
        description: `${match.awayTeam.name} beat ${match.homeTeam.name} ${score.away}-${score.home}`,
      });
    }
  }

  const allResults: MatchResult[] = group.matches.map((match, idx) => {
    if (remainingIds.has(match.id)) {
      return generatedByMatchId[match.id];
    }
    return playedResults[idx] ?? { matchId: match.id, result: null, homeScore: 0, awayScore: 0 };
  });

  const finalStandings = computeStandings(group, allResults);
  const qualifiers = finalStandings.slice(0, 2).map(r => r.team.id);
  const thirdPlace = finalStandings[2]?.team.id ?? '';
  const eliminatedTeams = finalStandings.slice(2).map(r => r.team.id);

  return { id, results, finalStandings, qualifiers, thirdPlace, eliminatedTeams, upsets };
}

export function findDramaticScenario(
  group: Group,
  playedResults: MatchResult[],
  remainingMatches: Match[],
  targetTeamId: string,
): ChaosScenario {
  let lastScenario: ChaosScenario | null = null;

  for (let i = 0; i < 50; i++) {
    const scenario = generateChaosScenario(group, playedResults, remainingMatches);
    lastScenario = scenario;

    if (scenario.eliminatedTeams.includes(targetTeamId)) {
      return scenario;
    }
  }

  return lastScenario!;
}
