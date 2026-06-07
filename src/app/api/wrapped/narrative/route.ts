/**
 * POST /api/wrapped/narrative
 * Generates a daily wrapped narrative using Claude.
 * Falls back to a pre-written mock narrative when no API key is set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateMatchdayNarrative } from '@/lib/claude';

const MOCK_NARRATIVES = [
  'Brazil remind everyone why they are five-time champions. Germany are left picking up the pieces after Vinicius Jr dances through their backline twice.',
  'The group stage refuses to follow the script. Two favourites stumble, three underdogs rise, and the bracket is already in chaos.',
  'Spain pass their way to another statement win while Japan prove once again that reputation counts for nothing on this stage.',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { day, date, matches } = body;

    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.ANTHROPIC_API_KEY;

    if (useMock) {
      const narrative = MOCK_NARRATIVES[((day ?? 1) - 1) % MOCK_NARRATIVES.length];
      return NextResponse.json({ narrative, isMock: true });
    }

    const narrative = await generateMatchdayNarrative(day, date, matches);
    return NextResponse.json({ narrative, isMock: false });
  } catch {
    const narrative = MOCK_NARRATIVES[0];
    return NextResponse.json({ narrative, isMock: true });
  }
}
