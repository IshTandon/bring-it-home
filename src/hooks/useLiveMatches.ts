/**
 * useLiveMatches.ts — Smart polling hook for live scores.
 *
 * Polling strategy:
 * - Live matches in progress → every 30s
 * - No live matches          → every 5 minutes
 * - Late night (23:00–06:00) → every 15 minutes
 *
 * Revalidates on focus + reconnect so scores catch up
 * the instant the user switches back to the tab.
 */

import useSWR from 'swr';
import type { Match } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface MatchesResponse {
  matches: (Match & { isLive: boolean })[];
  lastUpdated: string;
  isMock: boolean;
}

function isLateNight(): boolean {
  const hour = new Date().getHours();
  return hour >= 23 || hour < 6;
}

export function useLiveMatches() {
  const { data: todayData } = useSWR<MatchesResponse>(
    '/api/matches?mode=today',
    fetcher,
    { refreshInterval: 60_000 },
  );

  const hasLiveMatches = todayData?.matches?.some(m => m.isLive) ?? false;

  let refreshInterval = 300_000; // 5 min default
  if (hasLiveMatches) {
    refreshInterval = 30_000;    // 30s during live matches
  } else if (isLateNight()) {
    refreshInterval = 900_000;   // 15 min late night
  }

  const { data, error, isLoading, mutate } = useSWR<MatchesResponse>(
    '/api/matches?mode=all',
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    matches: data?.matches ?? [],
    hasLiveMatches,
    lastUpdated: data?.lastUpdated,
    isMock: data?.isMock ?? false,
    error,
    isLoading,
    refresh: mutate,
  };
}
