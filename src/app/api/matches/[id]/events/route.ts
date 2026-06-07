/**
 * GET /api/matches/[id]/events
 * Returns match events (goals, cards, substitutions) for a specific fixture.
 * Uses API-Football when key is set, mock data otherwise.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatchEvents } from '@/lib/api-football';
import type { MatchEvent } from '@/types';

const MOCK_EVENTS: Record<string, MatchEvent[]> = {
  'match-1': [
    { minute: 23, type: 'Goal', team: 'Brazil', player: 'Vinicius Jr', detail: 'Normal Goal' },
    { minute: 44, type: 'Goal', team: 'Germany', player: 'Musiala', detail: 'Normal Goal' },
    { minute: 51, type: 'Goal', team: 'Brazil', player: 'Rodrygo', detail: 'Normal Goal' },
    { minute: 61, type: 'Card', team: 'Germany', player: 'Kimmich', detail: 'Yellow Card' },
    { minute: 68, type: 'Subst', team: 'Brazil', player: 'Endrick', detail: 'Substitution (in)' },
  ],
  'match-3': [
    { minute: 34, type: 'Goal', team: 'Spain', player: 'Yamal', detail: 'Normal Goal' },
    { minute: 72, type: 'Goal', team: 'Japan', player: 'Mitoma', detail: 'Normal Goal' },
  ],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const fixtureId = params.id;
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.FOOTBALL_API_KEY;

  if (useMock) {
    return NextResponse.json({
      events: MOCK_EVENTS[fixtureId] ?? [],
      lastUpdated: new Date().toISOString(),
      isMock: true,
    });
  }

  try {
    const raw = await getMatchEvents(fixtureId);
    return NextResponse.json({
      events: raw,
      lastUpdated: new Date().toISOString(),
      isMock: false,
    });
  } catch {
    return NextResponse.json({
      events: MOCK_EVENTS[fixtureId] ?? [],
      lastUpdated: new Date().toISOString(),
      isMock: true,
    });
  }
}
