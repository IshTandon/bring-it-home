/**
 * useMatchEvents.ts — Polls match events during live games.
 *
 * Polls /api/matches/[id]/events every 45s while the match is live.
 * Stops polling when the match finishes (FT / AET / PEN).
 */

import useSWR from 'swr';
import { isMatchLive } from '@/lib/matchUtils';
import type { MatchEvent, MatchStatus } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface EventsResponse {
  events: MatchEvent[];
  lastUpdated: string;
  isMock: boolean;
}

export function useMatchEvents(matchId: string | null, status: MatchStatus) {
  const live = isMatchLive(status);

  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    matchId ? `/api/matches/${matchId}/events` : null,
    fetcher,
    {
      refreshInterval: live ? 45_000 : 0,
      revalidateOnFocus: live,
      revalidateOnReconnect: live,
    },
  );

  return {
    events: data?.events ?? [],
    lastUpdated: data?.lastUpdated,
    isMock: data?.isMock ?? false,
    isLive: live,
    error,
    isLoading,
    refresh: mutate,
  };
}
