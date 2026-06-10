'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_GROUPS } from '@/lib/data';
import QualificationCheck from '@/components/groups/QualificationCheck';
import type { MatchResult } from '@/lib/qualification-calc';

function GroupsSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <div className="h-3 w-28 skeleton rounded mb-1" />
        <div className="h-6 w-40 skeleton rounded mb-1" />
        <div className="h-3 w-52 skeleton rounded" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-9 w-10 skeleton rounded-full shrink-0" />
        ))}
      </div>
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-4 skeleton rounded" />
            <div className="w-6 h-6 rounded-full skeleton" />
            <div className="flex-1 h-3.5 skeleton rounded" />
            <div className="w-8 h-4 skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

const IfThisHappens = dynamic(() => import('@/components/groups/IfThisHappens'), {
  loading: () => <GroupsSkeleton />,
  ssr: false,
});

function QualificationPanel() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [selectedTeamId, setSelectedTeamId] = useState(MOCK_GROUPS[0].teams[0].id);

  const group = MOCK_GROUPS[groupIdx];

  const playedResults: MatchResult[] = useMemo(() => {
    return group.matches
      .filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN')
      .map(m => {
        const hs = m.homeScore ?? 0;
        const as = m.awayScore ?? 0;
        const result: 'home' | 'draw' | 'away' =
          hs > as ? 'home' : hs < as ? 'away' : 'draw';
        return { matchId: m.id, result, homeScore: hs, awayScore: as };
      });
  }, [group]);

  const remainingMatches = useMemo(() => {
    return group.matches.filter(m => m.status === 'NS');
  }, [group]);

  const handleGroupChange = (idx: number) => {
    setGroupIdx(idx);
    setSelectedTeamId(MOCK_GROUPS[idx].teams[0].id);
  };

  return (
    <div className="mb-6 space-y-3">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">
          Qualification check
        </p>
        <h2 className="text-lg font-semibold text-dark-text-primary">Can they make it?</h2>
      </div>

      {/* Group selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
        {MOCK_GROUPS.map((g, idx) => (
          <button
            key={g.id}
            type="button"
            onClick={() => handleGroupChange(idx)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 snap-start
              ${idx === groupIdx
                ? 'bg-dark-accent text-dark-bg shadow-sm'
                : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
            `}
          >
            {g.name.replace('Group ', '')}
          </button>
        ))}
      </div>

      {/* Team selector — flag chips */}
      <div className="flex gap-2 flex-wrap">
        {group.teams.map(team => (
          <button
            key={team.id}
            type="button"
            onClick={() => setSelectedTeamId(team.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95
              ${selectedTeamId === team.id
                ? 'bg-dark-accent/20 text-dark-accent border border-dark-accent/50'
                : 'bg-dark-surface text-dark-text-muted border border-dark-border hover:border-dark-accent/30'}
            `}
          >
            <span className="text-base leading-none">{team.flag}</span>
            <span className="sm:inline hidden">{team.name}</span>
          </button>
        ))}
      </div>

      <QualificationCheck
        teamId={selectedTeamId}
        group={group}
        playedResults={playedResults}
        remainingMatches={remainingMatches}
      />
    </div>
  );
}

export default function GroupsPage() {
  return (
    <div>
      <QualificationPanel />
      <IfThisHappens />
    </div>
  );
}
