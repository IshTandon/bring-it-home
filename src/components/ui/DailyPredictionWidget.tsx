'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Match, DailyPick, DailyPrediction } from '@/types';
import {
  addDailyPrediction,
  getTodayPredictions,
  getTodayStr,
  resolvePrediction,
  recalculateStreak,
  getStreakState,
} from '@/lib/streaks';
import { useLiveMatches } from '@/hooks/useLiveMatches';

function ResultBadge({ result }: { result: 'correct' | 'wrong' | 'pending' }) {
  if (result === 'pending') return null;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full animate-milestone-pop ${
      result === 'correct'
        ? 'bg-green-900/40 text-green-300'
        : 'bg-red-900/40 text-red-300'
    }`}>
      {result === 'correct' ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
      {result === 'correct' ? 'Correct' : 'Wrong'}
    </span>
  );
}

interface MatchPredictionRowProps {
  match: Match & { isLive?: boolean };
  existingPick?: DailyPrediction;
  onPick: (matchId: string, pick: DailyPick) => void;
}

function MatchPredictionRow({ match, existingPick, onPick }: MatchPredictionRowProps) {
  const isKickedOff = match.status !== 'NS';
  const isFinished = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
  const locked = !!existingPick || isKickedOff;

  const picks: { value: DailyPick; label: string }[] = [
    { value: 'home', label: match.homeTeam.name },
    { value: 'draw', label: 'Draw' },
    { value: 'away', label: match.awayTeam.name },
  ];

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
      {/* Match header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base">{match.homeTeam.flag}</span>
          <span className="text-xs font-medium text-dark-text-primary truncate">
            {match.homeTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-2 px-2">
          {isFinished ? (
            <span className="text-sm font-bold text-dark-text-primary tabular-nums">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : match.status !== 'NS' ? (
            <span className="badge badge-live text-[10px]">LIVE</span>
          ) : (
            <span className="text-dark-text-muted text-[10px]">{match.time}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-xs font-medium text-dark-text-primary truncate text-right">
            {match.awayTeam.name}
          </span>
          <span className="text-base">{match.awayTeam.flag}</span>
        </div>
      </div>

      {/* Pick buttons */}
      <div className="grid grid-cols-3 gap-1.5">
        {picks.map(({ value, label }) => {
          const isSelected = existingPick?.pick === value;
          const isDisabled = locked && !isSelected;

          return (
            <button
              key={value}
              disabled={locked}
              onClick={() => onPick(match.id, value)}
              className={`relative px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-dark-accent/20 border border-dark-accent text-dark-accent'
                  : isDisabled
                    ? 'bg-dark-surface border border-dark-border/50 text-dark-text-muted/50 cursor-not-allowed'
                    : 'bg-dark-bg border border-dark-border text-dark-text-muted hover:border-dark-accent/40 hover:text-dark-text-primary active:scale-[0.97]'
              }`}
            >
              <span className="truncate block">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Result badge */}
      {existingPick?.result && existingPick.result !== 'pending' && (
        <div className="flex justify-center mt-2">
          <ResultBadge result={existingPick.result} />
        </div>
      )}

      {locked && !existingPick && (
        <p className="text-dark-text-muted text-[10px] text-center mt-2">
          Match started — predictions locked
        </p>
      )}
    </div>
  );
}

export default function DailyPredictionWidget() {
  const { matches } = useLiveMatches();
  const [todayPreds, setTodayPreds] = useState<DailyPrediction[]>([]);
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  const today = getTodayStr();

  const todayMatches = matches.filter(m => {
    const matchDate = m.date?.slice(0, 10);
    return matchDate === today;
  });

  useEffect(() => {
    setMounted(true);
    setTodayPreds(getTodayPredictions());
    const state = recalculateStreak();
    setStreak(state.currentStreak);
  }, []);

  useEffect(() => {
    if (!mounted || todayMatches.length === 0) return;

    let updated = false;
    for (const match of todayMatches) {
      const isFinished = match.status === 'FT' || match.status === 'AET' || match.status === 'PEN';
      if (!isFinished) continue;

      const pred = todayPreds.find(p => p.matchId === match.id && p.result === 'pending');
      if (!pred) continue;

      let actualResult: DailyPick;
      if (match.homeScore! > match.awayScore!) actualResult = 'home';
      else if (match.homeScore! < match.awayScore!) actualResult = 'away';
      else actualResult = 'draw';

      resolvePrediction(match.id, actualResult);
      updated = true;
    }

    if (updated) {
      const newState = recalculateStreak();
      setStreak(newState.currentStreak);
      setTodayPreds(getTodayPredictions());
    }
  }, [matches, mounted, todayMatches, todayPreds]);

  const handlePick = useCallback((matchId: string, pick: DailyPick) => {
    const match = todayMatches.find(m => m.id === matchId);
    if (!match) return;

    addDailyPrediction({
      matchId,
      date: today,
      pick,
      homeTeam: { id: match.homeTeam.id, name: match.homeTeam.name, flag: match.homeTeam.flag },
      awayTeam: { id: match.awayTeam.id, name: match.awayTeam.name, flag: match.awayTeam.flag },
    });
    setTodayPreds(getTodayPredictions());
  }, [todayMatches, today]);

  if (!mounted) return null;
  if (todayMatches.length === 0) return null;

  const displayMatches = todayMatches.slice(0, 3);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-400/15 flex items-center justify-center text-sm">
            ⚡
          </span>
          Predict Today
        </h3>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
            <span>🔥</span>
            <span>{streak} day streak</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {displayMatches.map(match => (
          <MatchPredictionRow
            key={match.id}
            match={match}
            existingPick={todayPreds.find(p => p.matchId === match.id)}
            onPick={handlePick}
          />
        ))}
      </div>

      {todayMatches.length > 3 && (
        <p className="text-dark-text-muted text-xs text-center mt-2">
          +{todayMatches.length - 3} more match{todayMatches.length - 3 > 1 ? 'es' : ''} today
        </p>
      )}
    </section>
  );
}
