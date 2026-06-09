'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PLAYERS } from '@/lib/data';
import PlayerCard from './PlayerCard';
import type { Player } from '@/types';

const ComparisonPanel = dynamic(() => import('./ComparisonPanel'), { ssr: false });

const CARD_HEIGHT = 80;
const OVERSCAN = 5;

const POS_GROUPS: { label: string; positions: string[] }[] = [
  { label: 'All', positions: [] },
  { label: 'FWD', positions: ['ST', 'CF', 'LW', 'RW'] },
  { label: 'MID', positions: ['CAM', 'CM', 'CDM'] },
  { label: 'DEF', positions: ['CB', 'LB', 'RB'] },
  { label: 'GK',  positions: ['GK'] },
];

function PlayerCardSkeleton() {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full skeleton" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-32 skeleton rounded" />
        <div className="h-2.5 w-20 skeleton rounded" />
      </div>
      <div className="w-8 h-4 skeleton rounded" />
    </div>
  );
}

export default function PlayerGrid() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [compared, setCompared] = useState<[Player | null, Player | null]>([null, null]);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    if (compared[0] && compared[1]) {
      setTimeout(() => {
        comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [compared]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    observer.observe(container);
    setContainerHeight(container.clientHeight);

    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) setScrollTop(container.scrollTop);
  }, []);

  const filtered = useMemo(() => {
    let result = PLAYERS;

    if (activeGroup !== 'All') {
      const group = POS_GROUPS.find(g => g.label === activeGroup);
      if (group) result = result.filter(p => group.positions.includes(p.pos));
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.flag.includes(q) ||
        (p.teamId && p.teamId.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => (b.apiId ? 1 : 0) - (a.apiId ? 1 : 0) || b.ovr - a.ovr);

    return result;
  }, [search, activeGroup]);

  const { startIndex, endIndex, totalHeight, offsetY } = useMemo(() => {
    const itemHeight = CARD_HEIGHT + 12;
    const total = filtered.length * itemHeight;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - OVERSCAN);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(filtered.length - 1, start + visibleCount + OVERSCAN * 2);
    return {
      startIndex: start,
      endIndex: end,
      totalHeight: total,
      offsetY: start * itemHeight,
    };
  }, [filtered.length, scrollTop, containerHeight]);

  const handleClear = useCallback(() => {
    setSearch('');
    setActiveGroup('All');
  }, []);

  const handleToggleCompare = useCallback((player: Player) => {
    setCompared(prev => {
      if (prev[0]?.id === player.id) return [prev[1], null];
      if (prev[1]?.id === player.id) return [prev[0], null];
      if (!prev[0]) return [player, prev[1]];
      if (!prev[1]) return [prev[0], player];
      return [prev[1], player];
    });
  }, []);

  const handleClearCompare = useCallback(() => {
    setCompared([null, null]);
  }, []);

  const compareIds = useMemo(
    () => new Set([compared[0]?.id, compared[1]?.id].filter(Boolean)),
    [compared],
  );

  const compareCount = (compared[0] ? 1 : 0) + (compared[1] ? 1 : 0);

  const visiblePlayers = useMemo(
    () => filtered.slice(startIndex, endIndex + 1),
    [filtered, startIndex, endIndex],
  );

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">Scouting report</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Player Cards</h1>
        <p className="text-xs text-dark-text-muted mt-0.5">
          {PLAYERS.length} players across {new Set(PLAYERS.map(p => p.teamId)).size} nations. Tap to expand.
        </p>
      </div>

      {compareCount > 0 && compareCount < 2 && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-dark-accent/10 border border-dark-accent/30 flex items-center justify-between">
          <p className="text-xs text-dark-accent">
            <span className="font-semibold">{compared[0]?.name}</span> selected. Pick one more to compare.
          </p>
          <button type="button" onClick={handleClearCompare} className="text-[10px] text-dark-accent font-medium">
            Cancel
          </button>
        </div>
      )}

      {compared[0] && compared[1] && (
        <div ref={comparisonRef} className="animate-compare-pop">
          <ComparisonPanel playerA={compared[0]} playerB={compared[1]} onClear={handleClearCompare} />
        </div>
      )}

      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, team, or nationality..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveGroup('All'); }}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-dark-border rounded-xl bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-dark-accent/30 focus:border-dark-accent/50 transition-all"
        />
      </div>

      <div className="flex gap-1.5 pb-1 mb-4">
        {POS_GROUPS.map((group) => (
          <button
            key={group.label}
            type="button"
            onClick={() => setActiveGroup(group.label)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95
              ${activeGroup === group.label
                ? 'bg-dark-accent text-dark-bg'
                : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
            `}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-dark-text-muted">
          {filtered.length} player{filtered.length !== 1 ? 's' : ''}
        </p>
        {(search || activeGroup !== 'All') && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-dark-accent font-medium active:text-amber-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
          </div>
          <p className="text-dark-text-muted text-sm mb-2">No players match your search.</p>
          <button type="button" onClick={handleClear} className="text-sm text-dark-accent font-medium">
            Reset filters
          </button>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-y-auto"
          style={{ height: 'calc(100vh - 320px)', minHeight: 400 }}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div style={{ transform: `translateY(${offsetY}px)` }} className="space-y-3">
              {visiblePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCompareSelected={compareIds.has(player.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
