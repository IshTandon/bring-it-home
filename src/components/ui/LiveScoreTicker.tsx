'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { isMatchLive, isMatchFinished } from '@/lib/matchUtils';
import type { Match } from '@/types';

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
        el.scrollBy({ left: 200, behavior: 'smooth' });
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

  const hasLiveMatch = matches.some(m => isMatchLive(m.status));

  if (isLoading) {
    return (
      <div className="mb-6 rounded-2xl px-5 py-3" style={{ background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-gray-700 animate-pulse" />
          <div className="flex gap-6 overflow-hidden flex-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 w-32 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return null;
  }

  return (
    <div className="mb-6 rounded-2xl px-4 py-3" style={{ background: 'rgba(17, 24, 39, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3">
        {/* LIVE indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-2.5 h-2.5 rounded-full ${hasLiveMatch ? 'bg-red-500 animate-live-pulse' : 'bg-gray-600'}`}
          />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${hasLiveMatch ? 'text-red-400' : 'text-gray-500'}`}>
            {hasLiveMatch ? 'Live' : 'Today'}
          </span>
        </div>

        <div className="w-px h-5 bg-white/10 shrink-0" />

        {/* Scrolling matches */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-none flex-1"
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
                className="shrink-0 flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-base">{m.homeTeam.flag}</span>
                <span className="text-xs text-white/60 font-medium truncate max-w-[40px]">{m.homeTeam.name}</span>
                {hasScore ? (
                  <span className={`text-sm font-bold tabular-nums ${live ? 'text-white' : 'text-white/70'}`}>
                    {m.homeScore ?? 0}-{m.awayScore ?? 0}
                  </span>
                ) : (
                  <span className="text-xs text-white/30 font-medium">vs</span>
                )}
                <span className="text-xs text-white/60 font-medium truncate max-w-[40px]">{m.awayTeam.name}</span>
                <span className="text-base">{m.awayTeam.flag}</span>
                {live && (
                  <span className="text-[9px] font-bold text-red-400 ml-1">
                    {m.minute}&apos;
                  </span>
                )}
                {finished && (
                  <span className="text-[9px] font-medium text-white/30 ml-1">FT</span>
                )}
                {!live && !finished && m.time && (
                  <span className="text-[9px] font-medium text-white/30 ml-1">{m.time}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {isMock && (
        <div className="flex items-center gap-1.5 mt-2 ml-8">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400 text-[10px] font-semibold">
            Demo data
          </span>
        </div>
      )}
    </div>
  );
}
