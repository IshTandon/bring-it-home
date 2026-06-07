/**
 * GET /api/matches?mode=live|today|all
 * Returns matches filtered by mode.
 * Uses API-Football when key is set, mock data otherwise.
 *
 * Response envelope:
 * { matches, lastUpdated, isMock }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTodayMatches, getLiveMatches } from '@/lib/api-football';
import { isMatchLive } from '@/lib/matchUtils';

const LIVE_STATUSES = ['1H', 'HT', '2H', 'AET', 'PEN'];

const MOCK_MATCHES = [
  {
    id: 'match-1',
    homeTeam: { id: 'BRA', name: 'Brazil', flag: '🇧🇷', rating: 92 },
    awayTeam: { id: 'GER', name: 'Germany', flag: '🇩🇪', rating: 85 },
    homeScore: 2, awayScore: 1,
    status: '2H', minute: 67,
    stadium: 'Estadio Azteca', city: 'Mexico City',
    date: new Date().toISOString().split('T')[0],
    time: '20:00', round: 'Group E',
    isLive: true,
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
    time: '23:00', round: 'Group D',
    isLive: false,
    events: [],
  },
  {
    id: 'match-3',
    homeTeam: { id: 'ESP', name: 'Spain', flag: '🇪🇸', rating: 88 },
    awayTeam: { id: 'JPN', name: 'Japan', flag: '🇯🇵', rating: 78 },
    homeScore: 1, awayScore: 1,
    status: 'FT', minute: 90,
    stadium: 'MetLife Stadium', city: 'New Jersey',
    date: new Date().toISOString().split('T')[0],
    time: '17:00', round: 'Group E',
    isLive: false,
    events: [
      { minute: 34, type: 'Goal', team: 'Spain', player: 'Yamal', detail: 'Normal Goal' },
      { minute: 72, type: 'Goal', team: 'Japan', player: 'Mitoma', detail: 'Normal Goal' },
    ],
  },
];

function addIsLive<T extends { status?: string }>(matches: T[]): (T & { isLive: boolean })[] {
  return matches.map(m => ({
    ...m,
    isLive: isMatchLive(m.status ?? ''),
  }));
}

function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter(m => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') ?? 'all';
  const now = new Date().toISOString();

  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.FOOTBALL_API_KEY;

  if (useMock) {
    let filtered = MOCK_MATCHES;
    if (mode === 'live') {
      filtered = MOCK_MATCHES.filter(m => LIVE_STATUSES.includes(m.status));
    } else if (mode === 'today') {
      // all mock matches are "today" by definition
    }
    return NextResponse.json({
      matches: filtered,
      lastUpdated: now,
      isMock: true,
    });
  }

  try {
    if (mode === 'live') {
      const raw = await getLiveMatches() as { id: string; status?: string }[];
      return NextResponse.json({
        matches: addIsLive(raw),
        lastUpdated: now,
        isMock: false,
      });
    }

    if (mode === 'today') {
      const raw = await getTodayMatches() as { id: string; status?: string }[];
      return NextResponse.json({
        matches: addIsLive(raw),
        lastUpdated: now,
        isMock: false,
      });
    }

    // mode=all: merge live + today, dedupe
    const [liveRes, todayRes] = await Promise.allSettled([
      getLiveMatches() as Promise<{ id: string; status?: string }[]>,
      getTodayMatches() as Promise<{ id: string; status?: string }[]>,
    ]);
    const live = liveRes.status === 'fulfilled' ? liveRes.value : [];
    const today = todayRes.status === 'fulfilled' ? todayRes.value : [];
    const merged = dedupeById([...live, ...today]);

    return NextResponse.json({
      matches: addIsLive(merged),
      lastUpdated: now,
      isMock: false,
    });
  } catch {
    return NextResponse.json({
      matches: MOCK_MATCHES,
      lastUpdated: now,
      isMock: true,
    });
  }
}
