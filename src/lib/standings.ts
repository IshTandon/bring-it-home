import type { Team, StandingRow } from '@/types';

export interface MatchOutcome {
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
}

/**
 * Compute group standings from match outcomes.
 * Tie-break order follows FIFA rules: points > goal difference > goals scored.
 */
export function computeGroupStandings(
  teams: Team[],
  outcomes: MatchOutcome[]
): StandingRow[] {
  const stats: Record<string, StandingRow> = {};

  for (const team of teams) {
    stats[team.id] = {
      rank: 0, team, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, qualProb: 0,
    };
  }

  for (const o of outcomes) {
    const home = stats[o.homeTeamId];
    const away = stats[o.awayTeamId];
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goalsFor += o.homeGoals;
    home.goalsAgainst += o.awayGoals;
    away.goalsFor += o.awayGoals;
    away.goalsAgainst += o.homeGoals;

    if (o.homeGoals > o.awayGoals) {
      home.won++; away.lost++;
      home.points += 3;
    } else if (o.homeGoals === o.awayGoals) {
      home.drawn++; away.drawn++;
      home.points++; away.points++;
    } else {
      away.won++; home.lost++;
      away.points += 3;
    }
  }

  const rows = Object.values(stats);
  for (const row of rows) {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  }

  rows.sort((a, b) =>
    b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor
  );

  for (let i = 0; i < rows.length; i++) {
    rows[i].rank = i + 1;
  }

  return rows;
}
