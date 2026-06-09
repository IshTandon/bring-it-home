/**
 * GET /api/matches/[id]/events
 * Returns match events (goals, cards, substitutions) for a specific fixture.
 * Uses API-Football when key is set, empty array otherwise.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatchEvents } from '@/lib/api-football';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const fixtureId = params.id;

  if (!process.env.FOOTBALL_API_KEY) {
    return NextResponse.json({
      events: [],
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
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[events] error:', err);
    return NextResponse.json({
      events: [],
      lastUpdated: new Date().toISOString(),
      isMock: true,
    });
  }
}
