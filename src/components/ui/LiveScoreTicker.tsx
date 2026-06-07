'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { isMatchLive, isMatchFinished } from '@/lib/matchUtils';
import MatchMinuteBadge from './MatchMinuteBadge';
import type { Match, MatchStatus } from '@/types';

interface TickerMatch extends Match {
  isLive?: boolean;
}

export default function LiveScoreTicker() {
  const { matches, isMock, isLoading } = useLiveMatches();
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!scrollRef.current || matches.length <= 2) return;

    intervalRef.current = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 160, behavior: 'smooth' });
      }
    }, 4000);
  }, [matches.length]);

  useEffect(() => {
    startAutoScroll();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoScroll]);

  const handleInteraction = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(startAutoScroll, 8000);
  }, [startAutoScroll]);

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map(i => (
            <div key={i} className="shrink-0 w-40 h-[76px] bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="mb-6 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
        <p className="text-sm text-gray-500">No matches today. The tournament continues soon.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {isMock && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-semibold">
            Demo data
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4"
        onTouchStart={handleInteraction}
        onMouseDown={handleInteraction}
      >
        {(matches as TickerMatch[]).map(m => {
          const live = isMatchLive(m.status);
          const finished = isMatchFinished(m.status);
          const hasScore = live || finished;

          return (
            <Link
              key={m.id}
              href="/bracket"
              className={`shrink-0 w-40 rounded-xl border p-3 transition-all active:scale-95
                ${live
                  ? 'bg-red-50 border-red-200 shadow-sm'
                  : finished
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <MatchMinuteBadge
                  status={m.status as MatchStatus}
                  minute={m.minute}
                  time={m.time}
                />
                {live && !isMock && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">Live</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-1">
                <span className="text-lg">{m.homeTeam.flag}</span>
                {hasScore ? (
                  <span className="text-base font-bold text-gray-900 tabular-nums">
                    {m.homeScore ?? 0} – {m.awayScore ?? 0}
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 font-medium">vs</span>
                  </div>
                )}
                <span className="text-lg">{m.awayTeam.flag}</span>
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-gray-500 truncate max-w-[60px]">{m.homeTeam.name}</span>
                <span className="text-[10px] text-gray-500 truncate max-w-[60px] text-right">{m.awayTeam.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
