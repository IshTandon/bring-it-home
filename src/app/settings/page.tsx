'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserPreferencesStore, useBracketStore, usePredictionStore } from '@/lib/store';
import { TEAMS } from '@/lib/data';
import WelcomeFlow from '@/components/onboarding/WelcomeFlow';

export default function SettingsPage() {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const fanMode = useUserPreferencesStore(s => s.fanMode);

  const [mounted, setMounted] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [flowStartStep, setFlowStartStep] = useState<'team' | 'mode'>('team');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const handleChangeTeam = useCallback(() => {
    setFlowStartStep('team');
    setShowFlow(true);
  }, []);

  const handleSetFanMode = useCallback(() => {
    setFlowStartStep('mode');
    setShowFlow(true);
  }, []);

  const handleFlowClose = useCallback(() => {
    setShowFlow(false);
  }, []);

  const handleResetEverything = useCallback(() => {
    useUserPreferencesStore.getState().resetPreferences();
    useBracketStore.getState().resetBracket();
    usePredictionStore.getState().resetStreak();
    localStorage.removeItem('wc2026-user-prefs');
    localStorage.removeItem('wc2026-bracket');
    localStorage.removeItem('wc2026-predictions');
    setShowResetConfirm(false);
    window.location.reload();
  }, []);

  if (!mounted) return null;

  const team = favoriteTeamId && favoriteTeamId !== 'skipped'
    ? TEAMS.find(t => t.id === favoriteTeamId)
    : null;

  const modeLabel = fanMode === 'new' ? 'Casual fan' : fanMode === 'diehard' ? 'Die-hard' : null;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">
          Preferences
        </p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Settings</h1>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={handleChangeTeam}
          className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-4
                     hover:border-dark-accent/30 transition-colors text-left active:scale-[0.99]"
        >
          <span className="text-2xl">{team ? team.flag : '🏳️'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-dark-text-muted mb-0.5">Your team</p>
            <p className="text-sm font-medium text-dark-text-primary truncate">
              {team ? team.name : 'No team selected'}
            </p>
          </div>
          <span className="text-xs text-dark-accent font-medium shrink-0">Change →</span>
        </button>

        {modeLabel ? (
          <button
            type="button"
            onClick={handleSetFanMode}
            className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-4
                       hover:border-dark-accent/30 transition-colors text-left active:scale-[0.99]"
          >
            <span className="text-2xl">{fanMode === 'new' ? '🌱' : '🔥'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-dark-text-muted mb-0.5">Fan mode</p>
              <p className="text-sm font-medium text-dark-text-primary">{modeLabel}</p>
            </div>
            <span className="text-xs text-dark-accent font-medium shrink-0">Change →</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSetFanMode}
            className="w-full bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-4
                       hover:border-dark-accent/30 transition-colors text-left active:scale-[0.99]"
          >
            <span className="text-2xl">⚙️</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-dark-text-muted mb-0.5">Fan mode</p>
              <p className="text-sm font-medium text-dark-accent">Tap to set</p>
            </div>
            <span className="text-xs text-dark-accent font-medium shrink-0">Set →</span>
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-dark-border">
        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
          >
            Reset everything
          </button>
        ) : (
          <div className="bg-dark-surface border border-red-500/30 rounded-xl p-4 space-y-3">
            <p className="text-sm text-dark-text-primary font-medium">Clear all data?</p>
            <p className="text-xs text-dark-text-muted">
              This removes your team, picks, predictions, and all preferences. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetEverything}
                className="flex-1 py-2.5 text-sm font-medium bg-red-500/20 border border-red-500/40 rounded-lg text-red-400
                           hover:bg-red-500/30 transition-colors"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium bg-dark-bg border border-dark-border rounded-lg text-dark-text-muted
                           hover:text-dark-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {showFlow && <WelcomeFlow forceOpen startStep={flowStartStep} onClose={handleFlowClose} />}
    </div>
  );
}
