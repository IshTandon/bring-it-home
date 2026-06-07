/**
 * api-football.ts
 * Wrapper around API-Football (v3.football.api-sports.io).
 * Falls back to mock data when NEXT_PUBLIC_USE_MOCK_DATA=true
 * or when no API key is set.
 *
 * API-Football docs: https://www.api-football.com/documentation-v3
 * Free tier: 100 req/day, all WC endpoints available.
 */

const BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY ?? '';
const WC_LEAGUE = process.env.NEXT_PUBLIC_WC_LEAGUE_ID ?? '1';
const WC_SEASON = process.env.NEXT_PUBLIC_WC_SEASON ?? '2026';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !API_KEY;

interface FetchOptions {
  revalidate?: number | false;
}

async function apiFetch<T>(endpoint: string, opts: FetchOptions = {}): Promise<T> {
  if (USE_MOCK) {
    console.log(`[mock] ${endpoint}`);
    throw new Error('mock');
  }

  const nextOpts: RequestInit['next'] = {};
  if (opts.revalidate === 0 || opts.revalidate === false) {
    nextOpts.revalidate = 0;
  } else {
    nextOpts.revalidate = opts.revalidate ?? 30;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-apisports-key': API_KEY,
      'x-rapidapi-host': BASE_URL,
    },
    next: nextOpts,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.response as T;
}

// ─── Fixtures / Matches ───────────────────────────────────
export async function getLiveMatches() {
  return apiFetch(`/fixtures?live=all&league=${WC_LEAGUE}&season=${WC_SEASON}`, { revalidate: 0 });
}

export async function getTodayMatches() {
  const today = new Date().toISOString().split('T')[0];
  return apiFetch(`/fixtures?date=${today}&league=${WC_LEAGUE}&season=${WC_SEASON}`, { revalidate: 30 });
}

export async function getMatchById(fixtureId: string) {
  return apiFetch(`/fixtures?id=${fixtureId}`, { revalidate: 0 });
}

export async function getMatchStats(fixtureId: string) {
  return apiFetch(`/fixtures/statistics?fixture=${fixtureId}`, { revalidate: 0 });
}

export async function getMatchEvents(fixtureId: string) {
  return apiFetch(`/fixtures/events?fixture=${fixtureId}`, { revalidate: 0 });
}

// ─── Standings ────────────────────────────────────────────
export async function getStandings() {
  return apiFetch(`/standings?league=${WC_LEAGUE}&season=${WC_SEASON}`, { revalidate: 60 });
}

// ─── Players ──────────────────────────────────────────────
export async function getTopScorers() {
  return apiFetch(`/players/topscorers?league=${WC_LEAGUE}&season=${WC_SEASON}`);
}

export async function getTopAssists() {
  return apiFetch(`/players/topassists?league=${WC_LEAGUE}&season=${WC_SEASON}`);
}

export async function getPlayerStats(playerId: string) {
  return apiFetch(`/players?id=${playerId}&league=${WC_LEAGUE}&season=${WC_SEASON}`);
}

// ─── Squad Players (all WC squads with photos) ───────────
export async function getSquadPlayers(page = 1) {
  return apiFetch(`/players?league=${WC_LEAGUE}&season=${WC_SEASON}&page=${page}`);
}

export async function getAllSquadPlayers() {
  const pages: unknown[][] = [];
  let page = 1;
  const maxPages = 10;

  while (page <= maxPages) {
    try {
      const data = await apiFetch<unknown[]>(
        `/players?league=${WC_LEAGUE}&season=${WC_SEASON}&page=${page}`
      );
      if (!data || data.length === 0) break;
      pages.push(data);
      page++;
    } catch {
      break;
    }
  }

  return pages.flat();
}
