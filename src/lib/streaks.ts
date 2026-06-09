import type { DailyPrediction, DailyPick, StreakState } from '@/types';

const STORAGE_KEY = 'wc2026-daily-streaks';

function defaultState(): StreakState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    predictions: [],
  };
}

export function getStreakState(): StreakState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

export function saveStreakState(state: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded */ }
}

export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDailyPrediction(
  prediction: Omit<DailyPrediction, 'lockedAt' | 'result'>
): StreakState {
  const state = getStreakState();
  const exists = state.predictions.some(
    p => p.matchId === prediction.matchId && p.date === prediction.date
  );
  if (exists) return state;

  state.predictions.push({
    ...prediction,
    lockedAt: new Date().toISOString(),
    result: 'pending',
  });
  state.lastActiveDate = prediction.date;
  saveStreakState(state);
  return state;
}

export function resolvePrediction(
  matchId: string,
  actualResult: DailyPick
): StreakState {
  const state = getStreakState();
  const pred = state.predictions.find(p => p.matchId === matchId && p.result === 'pending');
  if (!pred) return state;

  pred.actualResult = actualResult;
  pred.result = pred.pick === actualResult ? 'correct' : 'wrong';
  saveStreakState(state);
  return state;
}

export function recalculateStreak(): StreakState {
  const state = getStreakState();
  const today = getTodayStr();

  const byDate = new Map<string, DailyPrediction[]>();
  for (const p of state.predictions) {
    if (!byDate.has(p.date)) byDate.set(p.date, []);
    byDate.get(p.date)!.push(p);
  }

  const sortedDates = Array.from(byDate.keys()).sort().reverse();

  let streak = 0;
  for (const date of sortedDates) {
    const preds = byDate.get(date)!;
    const allResolved = preds.every(p => p.result !== 'pending');
    if (!allResolved) continue;

    const hasCorrect = preds.some(p => p.result === 'correct');
    if (hasCorrect) {
      streak++;
    } else {
      break;
    }
  }

  state.currentStreak = streak;
  state.longestStreak = Math.max(streak, state.longestStreak);

  if (state.lastActiveDate && state.lastActiveDate !== today) {
    const lastDate = new Date(state.lastActiveDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
    if (diffDays > 1) {
      state.currentStreak = 0;
    }
  }

  saveStreakState(state);
  return state;
}

export function isStreakAtRisk(): boolean {
  const state = getStreakState();
  if (state.currentStreak === 0) return false;
  const today = getTodayStr();
  const todayPreds = state.predictions.filter(p => p.date === today);
  return todayPreds.length === 0;
}

export function getTodayPredictions(): DailyPrediction[] {
  const state = getStreakState();
  const today = getTodayStr();
  return state.predictions.filter(p => p.date === today);
}
