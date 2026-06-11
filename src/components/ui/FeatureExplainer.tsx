'use client';

import { useState, useEffect } from 'react';
import { useUserPreferencesStore } from '@/lib/store';

interface FeatureExplainerProps {
  text: string;
  featureId: string;
}

const STORAGE_PREFIX = 'explainer-dismissed-';

export default function FeatureExplainer({ text, featureId }: FeatureExplainerProps) {
  const fanMode = useUserPreferencesStore(s => s.fanMode);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${featureId}`);
    setDismissed(stored === '1');
  }, [featureId]);

  if (fanMode !== 'new' || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(`${STORAGE_PREFIX}${featureId}`, '1');
    setDismissed(true);
  };

  return (
    <div className="flex items-start gap-2 bg-dark-accent/5 border border-dark-accent/15 rounded-lg px-3 py-2 mb-3">
      <span className="shrink-0 text-sm leading-none mt-0.5">💡</span>
      <p className="flex-1 text-xs text-dark-text-secondary leading-relaxed">{text}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 text-dark-text-muted hover:text-dark-text-primary transition-colors ml-1 mt-0.5"
        aria-label="Dismiss tip"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
