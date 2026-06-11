'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferencesStore } from '@/lib/store';
import { TEAMS } from '@/lib/data';

type Step = 'team' | 'mode';

const POPULAR_IDS = ['ARG', 'BRA', 'FRA', 'ENG', 'ESP', 'GER', 'POR', 'NED', 'USA', 'MEX', 'JPN', 'MAR'];

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panel = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 26, stiffness: 280 } },
  exit: { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.2 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 26, stiffness: 280 } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.15 } },
};

const slideRight = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 26, stiffness: 280 } },
  exit: { opacity: 0, x: 60, transition: { duration: 0.15 } },
};

export default function WelcomeFlow({ onClose, forceOpen, startStep }: { onClose?: () => void; forceOpen?: boolean; startStep?: Step }) {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const setFavoriteTeam = useUserPreferencesStore(s => s.setFavoriteTeam);
  const setFanMode = useUserPreferencesStore(s => s.setFanMode);

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>(startStep ?? 'team');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matchesSearch = (t: typeof TEAMS[number]) =>
      !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);

    const popularTeams = POPULAR_IDS
      .map(id => TEAMS.find(t => t.id === id)!)
      .filter(matchesSearch);

    const restTeams = TEAMS
      .filter(t => !POPULAR_IDS.includes(t.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter(matchesSearch);

    return { popular: popularTeams, rest: restTeams };
  }, [search]);

  const dismiss = useCallback(() => {
    if (!forceOpen) setFavoriteTeam('skipped');
    onClose?.();
  }, [setFavoriteTeam, onClose, forceOpen]);

  const confirmTeam = useCallback(() => {
    if (!selectedId) return;
    setFavoriteTeam(selectedId);
    setStep('mode');
  }, [selectedId, setFavoriteTeam]);

  const skip = useCallback(() => {
    if (!forceOpen) setFavoriteTeam('skipped');
    onClose?.();
  }, [setFavoriteTeam, onClose, forceOpen]);

  const pickMode = useCallback((mode: 'new' | 'diehard') => {
    setFanMode(mode);
    onClose?.();
  }, [setFanMode, onClose]);

  const show = forceOpen || (hydrated && favoriteTeamId === null);
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="welcome-backdrop"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          key="welcome-panel"
          variants={panel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md max-h-[90vh] bg-dark-surface border border-dark-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {step === 'team' && (
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg
                         text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-border transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === 'team' ? (
              <TeamStep
                key="step-team"
                search={search}
                onSearch={setSearch}
                filteredTeams={filteredTeams}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onConfirm={confirmTeam}
                onSkip={skip}
              />
            ) : (
              <ModeStep key="step-mode" onPick={pickMode} />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TeamButton({ team, selected, onSelect }: { team: typeof TEAMS[number]; selected: boolean; onSelect: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(team.id)}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all active:scale-95
        ${selected
          ? 'bg-dark-accent/20 border-2 border-dark-accent ring-1 ring-dark-accent/30'
          : 'bg-dark-bg border border-dark-border hover:border-dark-accent/30'}
      `}
    >
      <span className="text-2xl">{team.flag}</span>
      <span className={`text-[11px] font-medium leading-tight ${
        selected ? 'text-dark-accent' : 'text-dark-text-primary'
      }`}>
        {team.name}
      </span>
    </button>
  );
}

function TeamStep({
  search, onSearch, filteredTeams, selectedId, onSelect, onConfirm, onSkip,
}: {
  search: string;
  onSearch: (v: string) => void;
  filteredTeams: { popular: typeof TEAMS; rest: typeof TEAMS };
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const hasResults = filteredTeams.popular.length > 0 || filteredTeams.rest.length > 0;

  return (
    <motion.div variants={slideRight} initial="hidden" animate="visible" exit="exit" className="flex flex-col">
      <div className="px-5 pt-6 pb-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent mb-1">Step 1 of 2</p>
        <h2 className="text-xl font-bold text-dark-text-primary leading-tight">Who are you backing?</h2>
        <p className="text-sm text-dark-text-muted mt-1">Pick the team you want to bring it home.</p>
      </div>

      <div className="px-5 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-sm text-dark-text-primary
                       placeholder:text-dark-text-muted/60 focus:outline-none focus:border-dark-accent/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-3 max-h-[45vh] scrollbar-none">
        {!hasResults && (
          <p className="text-center text-sm text-dark-text-muted py-6">No teams match your search.</p>
        )}

        {filteredTeams.popular.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-text-muted mb-2">Popular</p>
            <div className="grid grid-cols-3 min-[420px]:grid-cols-4 gap-2">
              {filteredTeams.popular.map(team => (
                <TeamButton key={team.id} team={team} selected={selectedId === team.id} onSelect={onSelect} />
              ))}
            </div>
          </>
        )}

        {filteredTeams.rest.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-dark-text-muted shrink-0">All teams A–Z</span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>
            <div className="grid grid-cols-3 min-[420px]:grid-cols-4 gap-2">
              {filteredTeams.rest.map(team => (
                <TeamButton key={team.id} team={team} selected={selectedId === team.id} onSelect={onSelect} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-5 py-4 border-t border-dark-border flex flex-col gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!selectedId}
          className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          That&apos;s my team →
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2.5 text-sm text-dark-text-muted hover:text-dark-text-primary transition-colors font-medium"
        >
          Just here for the football
        </button>
      </div>
    </motion.div>
  );
}

function ModeStep({ onPick }: { onPick: (mode: 'new' | 'diehard') => void }) {
  return (
    <motion.div variants={slideLeft} initial="hidden" animate="visible" exit="exit" className="flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent mb-1">Step 2 of 2</p>
        <h2 className="text-xl font-bold text-dark-text-primary leading-tight">How do you follow the game?</h2>
        <p className="text-sm text-dark-text-muted mt-1">We&apos;ll tailor the experience.</p>
      </div>

      <div className="px-5 pb-6 space-y-3">
        <button
          type="button"
          onClick={() => onPick('new')}
          className="w-full text-left bg-dark-bg border border-dark-border rounded-xl p-5 transition-all
                     hover:border-dark-accent/50 hover:bg-dark-accent/5 active:scale-[0.98] group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🌱</span>
            <div>
              <p className="text-sm font-semibold text-dark-text-primary group-hover:text-dark-accent transition-colors">
                Casual fan — guide me through it
              </p>
              <p className="text-xs text-dark-text-muted mt-1 leading-relaxed">
                One-line explainers on features, simpler language, and gentle nudges to help you enjoy the tournament.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onPick('diehard')}
          className="w-full text-left bg-dark-bg border border-dark-border rounded-xl p-5 transition-all
                     hover:border-dark-accent/50 hover:bg-dark-accent/5 active:scale-[0.98] group"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">🔥</span>
            <div>
              <p className="text-sm font-semibold text-dark-text-primary group-hover:text-dark-accent transition-colors">
                I live for this — skip the basics
              </p>
              <p className="text-xs text-dark-text-muted mt-1 leading-relaxed">
                Clean expert UI. Raw stats, deep scenarios, no hand-holding. You know the beautiful game.
              </p>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
