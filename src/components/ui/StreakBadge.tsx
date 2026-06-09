'use client';

import { useState, useEffect } from 'react';
import { getStreakState, recalculateStreak } from '@/lib/streaks';

export default function StreakBadge() {
  const [streak, setStreak] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const state = recalculateStreak();
    setStreak(state.currentStreak);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'wc2026-daily-streaks') {
        const state = getStreakState();
        setStreak(state.currentStreak);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [mounted]);

  if (!mounted || streak === 0) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
      <span className="text-sm" role="img" aria-label="streak fire">🔥</span>
      <span className="text-xs font-bold text-amber-400 tabular-nums">{streak}</span>
    </div>
  );
}
