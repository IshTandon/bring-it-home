'use client';

import { useState, useEffect } from 'react';
import { isStreakAtRisk, getStreakState } from '@/lib/streaks';

export default function StreakNudgeBanner() {
  const [showNudge, setShowNudge] = useState(false);
  const [streak, setStreak] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isStreakAtRisk()) {
      const state = getStreakState();
      setStreak(state.currentStreak);
      setShowNudge(true);
    }
  }, []);

  if (!mounted || !showNudge || dismissed) return null;

  return (
    <div className="mb-4 bg-amber-400/10 border border-amber-400/25 rounded-xl p-3 flex items-center gap-3 animate-team-slide-in">
      <div className="shrink-0 w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center">
        <span className="text-lg">🔥</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-300">
          Your streak is at risk!
        </p>
        <p className="text-xs text-dark-text-muted mt-0.5">
          You&apos;re on a {streak}-day streak. Predict today&apos;s matches to keep it alive.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-dark-text-muted hover:text-dark-text-primary transition-colors p-1"
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
