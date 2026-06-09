/**
 * POST /api/wrapped/narrative
 * Generates a daily wrapped narrative using Gemini.
 * Returns static fallback text if the API key is missing or the call fails.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMatchdayNarrative } from '@/lib/gemini';

const FALLBACK_NARRATIVE =
  'The tournament writes another chapter. Every match matters more than the last.';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, date, matches } = body;

    const narrative = await generateMatchdayNarrative(day, date, matches);
    return NextResponse.json({ narrative, isMock: false });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[narrative] error:', err);
    return NextResponse.json({ narrative: FALLBACK_NARRATIVE, isMock: true });
  }
}
