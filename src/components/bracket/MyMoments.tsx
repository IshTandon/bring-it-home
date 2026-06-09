'use client';

import { useState, useEffect } from 'react';
import type { CalledItMoment } from '@/types';
import { getCalledItMoments } from '@/lib/called-it';
import ICalledItCard from './ICalledItCard';

export default function MyMoments() {
  const [moments, setMoments] = useState<CalledItMoment[]>([]);
  const [selectedMoment, setSelectedMoment] = useState<CalledItMoment | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMoments(getCalledItMoments());
  }, []);

  if (!mounted) return null;
  if (moments.length === 0) return null;

  const roundLabel: Record<string, string> = {
    r32: 'R32',
    r16: 'R16',
    qf: 'QF',
    sf: 'SF',
    final: 'Final',
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-400/15 flex items-center justify-center text-sm">
            ✨
          </span>
          My Moments
        </h3>
        <span className="text-dark-text-muted text-xs">
          {moments.length} upset{moments.length !== 1 ? 's' : ''} called
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {moments.map(moment => (
          <button
            key={moment.id}
            onClick={() => setSelectedMoment(moment)}
            className="shrink-0 bg-dark-surface border border-dark-border rounded-xl p-3 min-w-[140px] text-left hover:border-dark-accent/40 transition-colors active:scale-[0.97]"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-lg">{moment.teamPicked.flag}</span>
              <span className="text-dark-accent text-[10px] font-medium uppercase">
                {roundLabel[moment.round]}
              </span>
            </div>
            <p className="text-dark-text-primary text-xs font-medium leading-tight truncate">
              {moment.teamPicked.name}
            </p>
            <p className="text-dark-text-muted text-[10px] mt-0.5">
              beat #{moment.teamOpponent.rank} {moment.teamOpponent.name}
            </p>
          </button>
        ))}
      </div>

      {selectedMoment && (
        <ICalledItCard
          moment={selectedMoment}
          onClose={() => setSelectedMoment(null)}
        />
      )}
    </div>
  );
}
