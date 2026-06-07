/**
 * useMatches.ts — SWR hooks for match + player data.
 * Polls /api/matches every 30s during live games.
 * All hooks fall back gracefully to mock data.
 */

import useSWR from 'swr';
import type { Match, StandingRow, Player } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface MatchesResponse {
  matches: (Match & { isLive?: boolean })[];
  lastUpdated: string;
  isMock?: boolean;
}

export function useMatches(mode: 'live' | 'today' | 'all' = 'all') {
  const { data, error, isLoading } = useSWR<MatchesResponse>(
    `/api/matches?mode=${mode}`,
    fetcher,
    { refreshInterval: 30_000 },
  );
  return {
    matches: data?.matches ?? [],
    lastUpdated: data?.lastUpdated,
    isMock: data?.isMock ?? false,
    error,
    isLoading,
  };
}

// Group standings
export function useStandings() {
  const { data, error, isLoading } = useSWR<{ groups: Record<string, StandingRow[]> }>(
    '/api/groups',
    fetcher,
    { refreshInterval: 60_000 },
  );
  return { groups: data?.groups ?? {}, error, isLoading };
}

// Player list + stats
export function usePlayers() {
  const { data, error, isLoading } = useSWR<{ players: Player[] }>(
    '/api/players',
    fetcher,
    { revalidateOnFocus: false },
  );
  return { players: data?.players ?? [], error, isLoading };
}

// Single player
export function usePlayer(id: string) {
  const { data, error, isLoading } = useSWR<{ player: Player }>(
    id ? `/api/players/${id}` : null,
    fetcher,
  );
  return { player: data?.player, error, isLoading };
}
