/**
 * store.ts
 * Global state with Zustand.
 * Bracket state + user predictions persist to localStorage.
 * Share bracket: serialize to base64 URL param.
 *
 * Bracket slice is isolated so winner updates only notify bracket subscribers.
 * MatchCard components use selector + shallow equality to avoid re-renders.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import type { BracketState, BracketMatch, Team, Prediction, UserStats } from '@/types';
import { TEAMS } from '@/lib/data';

// ─── Bracket Store ────────────────────────────────────────
interface BracketStore {
  bracket: BracketState;
  initBracket: () => void;
  pickWinner: (round: keyof BracketState, matchIndex: number, team: Team) => void;
  resetBracket: () => void;
  getBracketShareUrl: () => string;
  loadBracketFromUrl: (encoded: string) => boolean;
}

const STADIUM_NAMES = [
  'MetLife Stadium', 'AT&T Stadium', 'SoFi Stadium', 'Hard Rock Stadium',
  'Lumen Field', 'Lincoln Financial Field', 'NRG Stadium', 'Mercedes-Benz Stadium',
  'Gillette Stadium', 'GEHA Field at Arrowhead', "Levi's Stadium",
  'Estadio Azteca', 'Estadio Akron', 'Estadio BBVA', 'BMO Field', 'BC Place',
];
const MATCH_TIMES = ['14:00 ET', '17:00 ET', '20:00 ET', '13:00 ET'];

function seedBracket(teams: typeof TEAMS): typeof TEAMS {
  const sorted = [...teams].sort((a, b) => a.rank - b.rank);
  const seeded: typeof TEAMS = new Array(32);
  const order = [0, 31, 16, 15, 8, 23, 24, 7, 4, 27, 20, 11, 12, 19, 28, 3, 2, 29, 18, 13, 10, 21, 26, 5, 6, 25, 22, 9, 14, 17, 30, 1];
  for (let i = 0; i < 32; i++) seeded[i] = sorted[order[i]] ?? null;
  return seeded;
}

function makeEmptyBracket(): BracketState {
  const seeded = seedBracket(TEAMS);
  const r32: BracketMatch[] = [];
  for (let i = 0; i < 16; i++) {
    r32.push({
      id: `r32-${i}`, round: 'r32', matchIndex: i,
      teamA: seeded[i * 2] ?? null,
      teamB: seeded[i * 2 + 1] ?? null,
      winner: null,
      stadium: STADIUM_NAMES[i % 4],
      time: MATCH_TIMES[i % 4],
    });
  }
  const make = (round: BracketMatch['round'], count: number): BracketMatch[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `${round}-${i}`, round, matchIndex: i,
      teamA: null, teamB: null, winner: null,
      stadium: STADIUM_NAMES[i % 4],
      time: MATCH_TIMES[i % 4],
    }));
  return { r32, r16: make('r16', 8), qf: make('qf', 4), sf: make('sf', 2), final: make('final', 1) };
}

const ROUND_ORDER: (keyof BracketState)[] = ['r32', 'r16', 'qf', 'sf', 'final'];

let pendingPropagation: number | null = null;

export const useBracketStore = create<BracketStore>()(
  persist(
    (set, get) => ({
      bracket: makeEmptyBracket(),

      initBracket: () => set({ bracket: makeEmptyBracket() }),

      pickWinner: (round, matchIndex, team) => {
        set(state => {
          const bracket = { ...state.bracket };
          const roundMatches = [...bracket[round]];
          roundMatches[matchIndex] = { ...roundMatches[matchIndex], winner: team };
          bracket[round] = roundMatches;
          return { bracket };
        });

        if (pendingPropagation !== null) {
          cancelAnimationFrame(pendingPropagation);
        }

        pendingPropagation = requestAnimationFrame(() => {
          pendingPropagation = null;
          const ri = ROUND_ORDER.indexOf(round);
          if (ri < ROUND_ORDER.length - 1) {
            set(state => {
              const bracket = { ...state.bracket };
              const nextRound = ROUND_ORDER[ri + 1];
              const nextIdx = Math.floor(matchIndex / 2);
              const slot = matchIndex % 2 === 0 ? 'teamA' : 'teamB';
              const nextMatches = [...bracket[nextRound]];
              nextMatches[nextIdx] = { ...nextMatches[nextIdx], [slot]: team, winner: null };
              bracket[nextRound] = nextMatches;
              return { bracket };
            });
          }
        });
      },

      resetBracket: () => set({ bracket: makeEmptyBracket() }),

      getBracketShareUrl: () => {
        const { bracket } = get();
        const expectedCounts: Record<keyof BracketState, number> = { r32: 16, r16: 8, qf: 4, sf: 2, final: 1 };
        for (const r of ROUND_ORDER) {
          if (!bracket[r] || bracket[r].length !== expectedCounts[r]) {
            throw new Error(`Bracket incomplete: ${r} has ${bracket[r]?.length ?? 0} matches, expected ${expectedCounts[r]}`);
          }
        }
        const winners: Record<string, string | null> = {};
        ROUND_ORDER.forEach(r => {
          bracket[r].forEach((m, i) => {
            winners[`${r}-${i}`] = m.winner?.id ?? null;
          });
        });
        const json = JSON.stringify(winners, (_key, value) => value === undefined ? null : value);
        const encoded = btoa(json);
        return `${window.location.origin}/bracket?b=${encoded}`;
      },

      loadBracketFromUrl: (encoded: string): boolean => {
        try {
          const decoded = atob(encoded);
          const winners: Record<string, string | null> = JSON.parse(decoded);
          if (!winners || typeof winners !== 'object') {
            set({ bracket: makeEmptyBracket() });
            return false;
          }

          set({ bracket: makeEmptyBracket() });

          for (const round of ROUND_ORDER) {
            const bracket = get().bracket;
            bracket[round].forEach((match, idx) => {
              const winnerId = winners[`${round}-${idx}`];
              if (winnerId) {
                const team = match.teamA?.id === winnerId ? match.teamA
                  : match.teamB?.id === winnerId ? match.teamB : null;
                if (team) get().pickWinner(round, idx, team);
              }
            });
          }
          return true;
        } catch {
          set({ bracket: makeEmptyBracket() });
          return false;
        }
      },
    }),
    { name: 'wc2026-bracket', skipHydration: true }
  )
);

// ─── Selector hooks for granular subscriptions ───────────
export function useBracketMatch(round: keyof BracketState, matchIndex: number): BracketMatch {
  return useBracketStore(
    state => state.bracket[round][matchIndex],
    shallow
  );
}

export function useBracketRound(round: keyof BracketState): BracketMatch[] {
  return useBracketStore(
    state => state.bracket[round],
    shallow
  );
}

export function useBracketActions() {
  return useBracketStore(
    state => ({
      pickWinner: state.pickWinner,
      resetBracket: state.resetBracket,
      getBracketShareUrl: state.getBracketShareUrl,
      loadBracketFromUrl: state.loadBracketFromUrl,
    }),
    shallow
  );
}

// ─── User Preferences Store ──────────────────────────────
export type FanMode = 'new' | 'diehard' | null;

interface UserPreferencesStore {
  favoriteTeamId: string | null;
  fanMode: FanMode;
  setFavoriteTeam: (teamId: string | null) => void;
  setFanMode: (mode: FanMode) => void;
  resetPreferences: () => void;
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      favoriteTeamId: null,
      fanMode: null,
      setFavoriteTeam: (teamId) => set({ favoriteTeamId: teamId }),
      setFanMode: (mode) => set({ fanMode: mode }),
      resetPreferences: () => set({ favoriteTeamId: null, fanMode: null }),
    }),
    { name: 'wc2026-user-prefs', skipHydration: true }
  )
);

// ─── Group Simulation Store ───────────────────────────────
import type { MatchResult } from '@/lib/qualification-calc';

interface GroupSimulationStore {
  simulatedResults: Record<string, MatchResult[]>;
  setGroupResults: (groupId: string, results: MatchResult[]) => void;
}

export const useGroupSimulationStore = create<GroupSimulationStore>()(
  (set) => ({
    simulatedResults: {},
    setGroupResults: (groupId, results) =>
      set(state => ({
        simulatedResults: { ...state.simulatedResults, [groupId]: results },
      })),
  })
);

// ─── Predictions Store ────────────────────────────────────
interface PredictionStore {
  predictions: Prediction[];
  userStats: UserStats;
  addPrediction: (prediction: Prediction) => void;
  updatePredictionResult: (matchId: string, result: 'correct' | 'wrong') => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set, get) => ({
      predictions: [],
      userStats: {
        streak: 0,
        totalPredictions: 0,
        correctPredictions: 0,
        longestStreak: 0,
        fanIQLevel: 'Casual Fan',
        topTeamViewed: '',
        topPlayerViewed: '',
        topStadiumViewed: '',
      },

      addPrediction: (prediction) => {
        set(state => ({
          predictions: [...state.predictions, prediction],
          userStats: {
            ...state.userStats,
            totalPredictions: state.userStats.totalPredictions + 1,
          },
        }));
      },

      updatePredictionResult: (matchId, result) => {
        set(state => {
          const predictions = state.predictions.map(p =>
            p.matchId === matchId ? { ...p, result } : p
          );
          const correct = predictions.filter(p => p.result === 'correct').length;
          const accuracy = correct / Math.max(predictions.length, 1);
          const fanIQLevel =
            accuracy >= 0.8 ? 'World Cup Oracle' :
            accuracy >= 0.65 ? 'Scout' :
            accuracy >= 0.5 ? 'Tactical Analyst' :
            accuracy >= 0.35 ? 'Football Nerd' : 'Casual Fan';
          return {
            predictions,
            userStats: { ...state.userStats, correctPredictions: correct, fanIQLevel },
          };
        });
      },

      incrementStreak: () => {
        set(state => {
          const newStreak = state.userStats.streak + 1;
          return {
            userStats: {
              ...state.userStats,
              streak: newStreak,
              longestStreak: Math.max(newStreak, state.userStats.longestStreak),
            },
          };
        });
      },

      resetStreak: () => set(state => ({ userStats: { ...state.userStats, streak: 0 } })),
    }),
    { name: 'wc2026-predictions', skipHydration: true }
  )
);
