'use client';

import { useRef, useState, useCallback } from 'react';
import type { CalledItMoment } from '@/types';

interface Props {
  moment: CalledItMoment;
  onClose?: () => void;
}

export default function ICalledItCard({ moment, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shared, setShared] = useState(false);
  const [copying, setCopying] = useState(false);

  const shareText = `${moment.headline}\n\n${moment.teamPicked.flag} ${moment.teamPicked.name} beat ${moment.teamOpponent.flag} ${moment.teamOpponent.name}\nFIFA World Cup 2026 · Bring It Home`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I Called It — World Cup 2026',
          text: shareText,
          url: window.location.origin,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
      } catch { /* fallback failed */ }
    }
  }, [shareText]);

  const handleDownloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0e1a',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `i-called-it-${moment.teamPicked.name.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      /* html2canvas not available — graceful fallback */
      handleShare();
    }
  }, [moment.teamPicked.name, handleShare]);

  const roundLabel: Record<string, string> = {
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-Final',
    sf: 'Semi-Final',
    final: 'Final',
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[360px] animate-milestone-pop">
        {/* The shareable card — 9:16 aspect ratio */}
        <div
          ref={cardRef}
          className="relative w-full overflow-hidden rounded-2xl border border-dark-accent/30"
          style={{ aspectRatio: '9/16', background: 'linear-gradient(160deg, #0a0e1a 0%, #1a1025 40%, #0a0e1a 100%)' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-dark-accent to-transparent" />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #c9a84c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-between p-6 text-center">
            {/* Top badge */}
            <div className="mt-4">
              <span className="badge badge-amber text-xs uppercase tracking-widest">
                {roundLabel[moment.round] || moment.round}
              </span>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {/* Teams */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-1">{moment.teamPicked.flag}</span>
                  <span className="text-sm font-semibold text-dark-text-primary">{moment.teamPicked.name}</span>
                  <span className="text-[10px] text-dark-text-muted">#{moment.teamPicked.rank}</span>
                </div>
                <div className="flex flex-col items-center px-3">
                  <span className="text-dark-text-muted text-xs font-medium">vs</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-1">{moment.teamOpponent.flag}</span>
                  <span className="text-sm font-semibold text-dark-text-primary">{moment.teamOpponent.name}</span>
                  <span className="text-[10px] text-dark-text-muted">#{moment.teamOpponent.rank}</span>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h2 className="text-2xl font-bold text-dark-accent leading-tight">
                  {moment.headline}
                </h2>
                <p className="text-dark-text-muted text-xs mt-2">
                  You predicted the upset
                </p>
              </div>

              {/* Upset indicator */}
              <div className="bg-dark-accent/10 border border-dark-accent/20 rounded-xl px-4 py-3">
                <p className="text-dark-accent text-sm font-medium">
                  {moment.teamPicked.flag} #{moment.teamPicked.rank} beat #{moment.teamOpponent.rank} {moment.teamOpponent.flag}
                </p>
                <p className="text-dark-text-muted text-xs mt-0.5">
                  {Math.abs(moment.teamOpponent.rank - moment.teamPicked.rank)} places apart in FIFA rankings
                </p>
              </div>
            </div>

            {/* Footer branding */}
            <div className="mt-4 pb-2">
              <p className="text-dark-text-muted text-[10px] uppercase tracking-widest">
                Bring It Home · FIFA World Cup 2026
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons below card */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleShare}
            className="btn-primary flex-1 justify-center text-center"
          >
            {shared ? 'Shared!' : copying ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={handleDownloadImage}
            className="btn flex-1 justify-center text-center"
          >
            Save Image
          </button>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-dark-text-muted hover:text-dark-text-primary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
