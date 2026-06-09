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

function getMockMatches() {
  const today = new Date().toISOString().slice(0, 10);

  return [
    {
      id: 'mock-1',
      homeTeam: { id: 'GER', name: 'Germany', flag: '🇩🇪', rating: 90, rank: 6, group: 'E', coach: 'Julian Nagelsmann', mascot: '', style: '', titles: 4, finals: 8, semifinals: 13, bestResult: 'Winners (4x)', facts: [], players: [] },
      awayTeam: { id: 'JPN', name: 'Japan', flag: '🇯🇵', rating: 80, rank: 18, group: 'E', coach: 'Hajime Moriyasu', mascot: '', style: '', titles: 0, finals: 0, semifinals: 0, bestResult: 'Round of 16', facts: [], players: [] },
      homeScore: 1,
      awayScore: 2,
      status: 'FT',
      stadium: 'AT&T Stadium',
      city: 'Dallas',
      date: today,
      time: '11:00 ET',
      round: 'Group E',
      group: 'E',
      events: [
        { minute: 23, type: 'Goal', team: 'Germany', player: 'Musiala', detail: 'Open play' },
        { minute: 51, type: 'Goal', team: 'Japan', player: 'Mitoma', detail: 'Counter-attack' },
        { minute: 78, type: 'Goal', team: 'Japan', player: 'Kubo', detail: 'Free kick' },
      ],
    },
    {
      id: 'mock-2',
      homeTeam: { id: 'BRA', name: 'Brazil', flag: '🇧🇷', rating: 92, rank: 3, group: 'G', coach: 'Dorival Jr.', mascot: '', style: '', titles: 5, finals: 7, semifinals: 11, bestResult: 'Winners (5x)', facts: [], players: [] },
      awayTeam: { id: 'SUI', name: 'Switzerland', flag: '🇨🇭', rating: 82, rank: 15, group: 'G', coach: 'Murat Yakin', mascot: '', style: '', titles: 0, finals: 0, semifinals: 3, bestResult: 'Quarter-finals', facts: [], players: [] },
      homeScore: null,
      awayScore: null,
      status: 'NS',
      stadium: 'MetLife Stadium',
      city: 'New York',
      date: today,
      time: '14:00 ET',
      round: 'Group G',
      group: 'G',
      events: [],
    },
    {
      id: 'mock-3',
      homeTeam: { id: 'USA', name: 'United States', flag: '🇺🇸', rating: 86, rank: 11, group: 'A', coach: 'Mauricio Pochettino', mascot: '', style: '', titles: 0, finals: 0, semifinals: 1, bestResult: 'Semi-finals (1930)', facts: [], players: [] },
      awayTeam: { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 91, rank: 4, group: 'A', coach: 'Thomas Tuchel', mascot: '', style: '', titles: 1, finals: 2, semifinals: 4, bestResult: 'Winners (1966)', facts: [], players: [] },
      homeScore: null,
      awayScore: null,
      status: 'NS',
      stadium: 'SoFi Stadium',
      city: 'Los Angeles',
      date: today,
      time: '20:00 ET',
      round: 'Group A',
      group: 'A',
      events: [],
    },
  ];
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('mode') ?? 'all';
  const now = new Date().toISOString();

  if (!process.env.FOOTBALL_API_KEY) {
    const mockMatches = getMockMatches();
    return NextResponse.json({
      matches: addIsLive(mockMatches),
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
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[matches] error:', err);
    return NextResponse.json({ matches: [], lastUpdated: now, isMock: true });
  }
}
