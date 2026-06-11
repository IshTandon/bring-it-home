'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STEPS = [
  {
    title: 'Pick the winners',
    body: 'Pick winners through every round. Share your picks with the world.',
    visual: 'bracket',
  },
  {
    title: 'The Glory Index',
    body: 'Our live ranking of all 48 nations. Updates after every match.',
    visual: 'leaderboard',
  },
  {
    title: 'Predict. Streak. Win.',
    body: "Call today's results. Keep your streak alive. Every matchday counts.",
    visual: 'streak',
  },
] as const;

function BracketVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex flex-col gap-2">
        <div className="w-20 h-7 rounded-lg bg-dark-accent/20 border border-dark-accent/40 flex items-center px-2">
          <span className="text-xs text-dark-accent font-medium">🇧🇷 Brazil</span>
        </div>
        <div className="w-20 h-7 rounded-lg bg-dark-border flex items-center px-2">
          <span className="text-xs text-dark-text-muted">🇨🇭 Switz.</span>
        </div>
      </div>
      <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="#c9a84c" strokeWidth="1.5">
        <path d="M0 10 H12 V20 H24" />
        <path d="M0 30 H12 V20" />
      </svg>
      <div className="w-20 h-7 rounded-lg bg-dark-accent/20 border border-dark-accent/40 flex items-center px-2">
        <span className="text-xs text-dark-accent font-medium">🇧🇷 Brazil</span>
      </div>
    </div>
  );
}

function LeaderboardVisual() {
  const teams = [
    { flag: '🇫🇷', name: 'France', score: '100.0' },
    { flag: '🇪🇸', name: 'Spain', score: '96.2' },
    { flag: '🇦🇷', name: 'Argentina', score: '93.9' },
  ];
  return (
    <div className="space-y-2 w-48">
      {teams.map((t, i) => (
        <div key={t.name} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${i === 0 ? 'bg-dark-accent/15 border border-dark-accent/30' : 'bg-dark-border/50'}`}>
          <span className="text-sm font-bold text-dark-text-muted w-5">{i + 1}</span>
          <span className="text-base">{t.flag}</span>
          <span className="text-xs font-medium text-dark-text-primary flex-1">{t.name}</span>
          <span className={`text-xs font-bold tabular-nums ${i === 0 ? 'text-dark-accent' : 'text-dark-text-muted'}`}>{t.score}</span>
        </div>
      ))}
    </div>
  );
}

function StreakVisual() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20">
        <span className="text-2xl">🔥</span>
        <span className="text-2xl font-bold text-amber-400 tabular-nums">7</span>
      </div>
      <div className="flex gap-1">
        {['✓', '✓', '✓', '✓', '✓', '✓', '✓'].map((_, i) => (
          <span key={i} className="w-5 h-5 rounded-full bg-green-900/40 text-green-400 text-[10px] flex items-center justify-center font-bold">✓</span>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    setMounted(true);
    const done = localStorage.getItem('onboarding_complete');
    if (!done) setVisible(true);
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem('onboarding_complete', 'true');
    setVisible(false);
  }, []);

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else complete();
  }, [step, complete]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && step < STEPS.length - 1) setStep(s => s + 1);
      if (dx > 0 && step > 0) setStep(s => s - 1);
    }
  }, [step]);

  if (!mounted || !visible) return null;

  const currentStep = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0a0e1a 0%, #1a1025 50%, #0a0e1a 100%)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Skip */}
      <button
        type="button"
        onClick={complete}
        className="absolute top-5 right-5 text-xs text-dark-text-muted hover:text-dark-text-primary transition-colors"
      >
        Skip
      </button>

      {/* Visual */}
      <div className="flex-1 flex items-end justify-center pb-8 pt-16">
        {currentStep.visual === 'bracket' && <BracketVisual />}
        {currentStep.visual === 'leaderboard' && <LeaderboardVisual />}
        {currentStep.visual === 'streak' && <StreakVisual />}
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col items-center text-center pt-6">
        <h2 className="text-2xl font-bold text-dark-text-primary mb-3">{currentStep.title}</h2>
        <p className="text-sm text-dark-text-muted leading-relaxed max-w-[280px]">{currentStep.body}</p>
      </div>

      {/* Bottom section */}
      <div className="pb-8 flex flex-col items-center gap-5 w-full max-w-xs">
        {/* Dots */}
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-dark-accent' : 'w-2 bg-dark-border'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={next}
          className="btn-primary w-full justify-center text-center py-3"
        >
          {step < STEPS.length - 1 ? 'Next' : "Let's go"}
        </button>
      </div>
    </div>
  );
}
