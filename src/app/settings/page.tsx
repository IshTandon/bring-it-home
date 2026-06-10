'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserPreferencesStore } from '@/lib/store';
import { TEAMS } from '@/lib/data';
import WelcomeFlow from '@/components/onboarding/WelcomeFlow';

export default function SettingsPage() {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const fanMode = useUserPreferencesStore(s => s.fanMode);

  const [mounted, setMounted] = useState(false);
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setMounted(true);
  }, []);

  const handleChangeTeam = useCallback(() => {
    setShowFlow(true);
  }, []);

  const handleFlowClose = useCallback(() => {
    setShowFlow(false);
  }, []);

  if (!mounted) return null;

  const team = favoriteTeamId && favoriteTeamId !== 'skipped'
    ? TEAMS.find(t => t.id === favoriteTeamId)
    : null;

  const modeLabel = fanMode === 'new' ? 'New fan (guided)' : fanMode === 'diehard' ? 'Die-hard' : 'Not set';

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">
          Preferences
        </p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Settings</h1>
      </div>

      <div className="space-y-2">
        {/* Favourite team */}
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

        {/* Fan mode */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">{fanMode === 'new' ? '🌱' : fanMode === 'diehard' ? '🔥' : '⚙️'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-dark-text-muted mb-0.5">Experience mode</p>
            <p className="text-sm font-medium text-dark-text-primary">{modeLabel}</p>
          </div>
        </div>
      </div>

      {showFlow && <WelcomeFlow forceOpen onClose={handleFlowClose} />}
    </div>
  );
}
