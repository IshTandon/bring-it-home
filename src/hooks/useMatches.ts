/**
 * useMatches.ts — SWR hooks for live data
 * Polls /api/matches every 30s during live games.
 * All hooks fall back gracefully to mock data.
 */

import useSWR from 'swr';
import type { Match, StandingRow, Player } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Live + today's matches — polls every 30s
export function useMatches() {
  const { data, error, isLoading } = useSWR<{ matches: Match[]; lastUpdated: string }>(
    '/api/matches',
    fetcher,
    { refreshInterval: 30_000 }
  );
  return { matches: data?.matches ?? [], lastUpdated: data?.lastUpdated, error, isLoading };
}

// Group standings
export function useStandings() {
  const { data, error, isLoading } = useSWR<{ groups: Record<string, StandingRow[]> }>(
    '/api/groups',
    fetcher,
    { refreshInterval: 60_000 }
  );
  return { groups: data?.groups ?? {}, error, isLoading };
}

// Player list + stats
export function usePlayers() {
  const { data, error, isLoading } = useSWR<{ players: Player[] }>(
    '/api/players',
    fetcher,
    { revalidateOnFocus: false }
  );
  return { players: data?.players ?? [], error, isLoading };
}

// Single player
export function usePlayer(id: string) {
  const { data, error, isLoading } = useSWR<{ player: Player }>(
    id ? `/api/players/${id}` : null,
    fetcher
  );
  return { player: data?.player, error, isLoading };
}
