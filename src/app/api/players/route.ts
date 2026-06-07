import { NextResponse } from 'next/server';
import { PLAYERS } from '@/lib/data';

export async function GET() {
  // In production: fetch from API-Football /players/topscorers
  // and merge with our rating/attribute data
  return NextResponse.json({ players: PLAYERS, lastUpdated: new Date().toISOString() });
}
