/**
 * POST /api/simulator
 * Body: { teamAId, teamBId, formA, formB, neutral }
 * Returns: SimResult with win probabilities, xG, score distribution
 */

import { NextRequest, NextResponse } from 'next/server';
import { TEAMS } from '@/lib/data';
import type { SimResult } from '@/types';

function monteCarlo(
  ratingA: number, ratingB: number,
  formA: number, formB: number,
  neutral: boolean,
  iterations = 10000
): SimResult {
  const strA = ratingA + formA * 0.8 + (neutral ? 0 : 3);
  const strB = ratingB + formB * 0.8;
  const total = strA + strB;
  const pA = strA / total;
  const pB = strB / total;
  const drawFactor = Math.max(0.05, 0.22 - Math.abs(pA - pB) * 0.3);

  const rawWinA = pA * (1 - drawFactor);
  const rawWinB = pB * (1 - drawFactor);
  const norm = rawWinA + drawFactor + rawWinB;
  const winA = rawWinA / norm;
  const drawP = drawFactor / norm;
  const winB = rawWinB / norm;

  const xgA = parseFloat((strA / 100 * 2.2).toFixed(1));
  const xgB = parseFloat((strB / 100 * 2.2).toFixed(1));

  const scoreMap: Record<string, number> = {};
  for (let i = 0; i < iterations; i++) {
    const r = Math.random();
    let ga: number, gb: number;
    if (r < winA) {
      ga = Math.floor(Math.random() * 3) + 1;
      gb = Math.floor(Math.random() * ga);
    } else if (r < winA + drawP) {
      ga = Math.floor(Math.random() * 3);
      gb = ga;
    } else {
      gb = Math.floor(Math.random() * 3) + 1;
      ga = Math.floor(Math.random() * gb);
    }
    const key = `${ga}-${gb}`;
    scoreMap[key] = (scoreMap[key] ?? 0) + 1;
  }

  const topScores = Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([score, count]) => ({ score, pct: Math.round(count / iterations * 100) }));

  const winner = winA > winB ? 'Team A' : winB > winA ? 'Team B' : null;

  return {
    teamA: { name: '', flag: '', winPct: Math.round(winA * 100), xG: xgA },
    teamB: { name: '', flag: '', winPct: Math.round(winB * 100), xG: xgB },
    drawPct: Math.round(drawP * 100),
    topScores,
    narrative: winner
      ? `Model gives ${winner} a ${Math.round(Math.max(winA, winB) * 100)}% win probability with ${Math.round(drawP * 100)}% draw chance.`
      : `Perfectly balanced — ${Math.round(winA * 100)}% each with ${Math.round(drawP * 100)}% draw.`,
  };
}

export async function POST(req: NextRequest) {
  const { teamAId, teamBId, formA = 7, formB = 7, neutral = true } = await req.json();

  const teamA = TEAMS.find(t => t.id === teamAId);
  const teamB = TEAMS.find(t => t.id === teamBId);

  if (!teamA || !teamB) {
    return NextResponse.json({ error: 'Teams not found' }, { status: 400 });
  }

  const result = monteCarlo(teamA.rating, teamB.rating, formA, formB, neutral);
  result.teamA.name = teamA.name;
  result.teamA.flag = teamA.flag;
  result.teamB.name = teamB.name;
  result.teamB.flag = teamB.flag;

  return NextResponse.json(result);
}
