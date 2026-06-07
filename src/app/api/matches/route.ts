/**
 * GET /api/matches
 * Returns today's matches + any live games.
 * Uses API-Football when key is set, mock data otherwise.
 */

import { NextResponse } from 'next/server';
import { getTodayMatches, getLiveMatches } from '@/lib/api-football';

// Mock data for development
const MOCK_MATCHES = [
  {
    id: 'match-1',
    homeTeam: { id: 'BRA', name: 'Brazil', flag: '🇧🇷', rating: 92 },
    awayTeam: { id: 'GER', name: 'Germany', flag: '🇩🇪', rating: 85 },
    homeScore: 2, awayScore: 1,
    status: '2H', minute: 67,
    stadium: 'Estadio Azteca', city: 'Mexico City',
    date: new Date().toISOString().split('T')[0],
    time: '20:00', round: 'Group A',
    events: [
      { minute: 23, type: 'Goal', team: 'Brazil', player: 'Vinicius Jr', detail: 'Normal Goal' },
      { minute: 44, type: 'Goal', team: 'Germany', player: 'Musiala', detail: 'Normal Goal' },
      { minute: 51, type: 'Goal', team: 'Brazil', player: 'Rodrygo', detail: 'Normal Goal' },
      { minute: 61, type: 'Card', team: 'Germany', player: 'Kimmich', detail: 'Yellow Card' },
    ],
  },
  {
    id: 'match-2',
    homeTeam: { id: 'FRA', name: 'France', flag: '🇫🇷', rating: 90 },
    awayTeam: { id: 'ARG', name: 'Argentina', flag: '🇦🇷', rating: 89 },
    homeScore: null, awayScore: null,
    status: 'NS', minute: null,
    stadium: 'SoFi Stadium', city: 'Los Angeles',
    date: new Date().toISOString().split('T')[0],
    time: '23:00', round: 'Group B',
    events: [],
  },
];

export async function GET() {
  try {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
    if (useMock) {
      return NextResponse.json({ matches: MOCK_MATCHES, lastUpdated: new Date().toISOString() });
    }
    const [live, today] = await Promise.allSettled([getLiveMatches(), getTodayMatches()]);
    const matches = [
      ...(live.status === 'fulfilled' ? (live.value as unknown[]) : []),
      ...(today.status === 'fulfilled' ? (today.value as unknown[]) : []),
    ];
    return NextResponse.json({ matches, lastUpdated: new Date().toISOString() });
  } catch {
    return NextResponse.json({ matches: MOCK_MATCHES, lastUpdated: new Date().toISOString() });
  }
}
