import type { CalledItMoment, BracketMatch, Team } from '@/types';

const STORAGE_KEY = 'wc2026-called-it-moments';

export function getCalledItMoments(): CalledItMoment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCalledItMoment(moment: CalledItMoment): void {
  const moments = getCalledItMoments();
  if (moments.some(m => m.id === moment.id)) return;
  moments.unshift(moment);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
  } catch { /* quota exceeded — silently ignore */ }
}

export function clearCalledItMoments(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const HEADLINES = [
  'You called it.',
  'I called it before anyone.',
  'Everyone doubted it. You didn\'t.',
  'Against the odds. You knew.',
  'The upset you saw coming.',
];

export function generateHeadline(): string {
  return HEADLINES[Math.floor(Math.random() * HEADLINES.length)];
}

export function isUpset(pickedTeam: Team, opponent: Team): boolean {
  return pickedTeam.rank > opponent.rank;
}

export function detectCalledIt(
  bracketMatch: BracketMatch,
  actualWinnerId: string
): CalledItMoment | null {
  const { winner, teamA, teamB } = bracketMatch;
  if (!winner || !teamA || !teamB) return null;
  if (winner.id !== actualWinnerId) return null;

  const opponent = winner.id === teamA.id ? teamB : teamA;
  if (!isUpset(winner, opponent)) return null;

  return {
    id: `${bracketMatch.id}-${Date.now()}`,
    matchId: bracketMatch.id,
    round: bracketMatch.round,
    matchIndex: bracketMatch.matchIndex,
    teamPicked: { id: winner.id, name: winner.name, flag: winner.flag, rank: winner.rank },
    teamOpponent: { id: opponent.id, name: opponent.name, flag: opponent.flag, rank: opponent.rank },
    result: `${winner.name} wins`,
    timestamp: new Date().toISOString(),
    headline: generateHeadline(),
  };
}
