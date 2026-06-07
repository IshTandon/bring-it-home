'use client';

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { PLAYERS } from '@/lib/data';
import PlayerCard from './PlayerCard';
import type { Player } from '@/types';

const ComparisonPanel = dynamic(() => import('./ComparisonPanel'), { ssr: false });

const POS_GROUPS: { label: string; positions: string[] }[] = [
  { label: 'All', positions: [] },
  { label: 'FWD', positions: ['ST', 'CF', 'LW', 'RW'] },
  { label: 'MID', positions: ['CAM', 'CM', 'CDM'] },
  { label: 'DEF', positions: ['CB', 'LB', 'RB'] },
  { label: 'GK',  positions: ['GK'] },
];

export default function PlayerGrid() {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [compared, setCompared] = useState<[Player | null, Player | null]>([null, null]);

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

    return result;
  }, [search, activeGroup]);

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

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">Scouting report</p>
        <h1 className="text-xl font-semibold text-gray-900">Player Cards</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {PLAYERS.length} players across {new Set(PLAYERS.map(p => p.teamId)).size} nations. Tap to expand.
        </p>
      </div>

      {/* Compare hint */}
      {compareCount > 0 && compareCount < 2 && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
          <p className="text-xs text-blue-700">
            <span className="font-semibold">{compared[0]?.name}</span> selected. Pick one more to compare.
          </p>
          <button type="button" onClick={handleClearCompare} className="text-[10px] text-blue-500 font-medium">
            Cancel
          </button>
        </div>
      )}

      {/* Comparison panel */}
      {compared[0] && compared[1] && (
        <ComparisonPanel playerA={compared[0]} playerB={compared[1]} onClear={handleClearCompare} />
      )}

      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, team, or nationality..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); if (e.target.value) setActiveGroup('All'); }}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
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
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200'}
            `}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {filtered.length} player{filtered.length !== 1 ? 's' : ''}
        </p>
        {(search || activeGroup !== 'All') && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-blue-500 font-medium active:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No players match your search.</p>
          <button type="button" onClick={handleClear} className="text-sm text-blue-500 mt-2 font-medium">
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCompareSelected={compareIds.has(player.id)}
              onToggleCompare={handleToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}
