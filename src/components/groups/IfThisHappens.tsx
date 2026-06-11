'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { MOCK_GROUPS } from '@/lib/data';
import { computeStandings, defaultResults } from '@/lib/qualification-calc';
import type { MatchResult, Result } from '@/lib/qualification-calc';
import type { Match, StandingRow, Group } from '@/types';
import { useUserPreferencesStore, useGroupSimulationStore } from '@/lib/store';
import FeatureExplainer from '@/components/ui/FeatureExplainer';
import ChaosMode from './ChaosMode';

type StandingsMode = 'short' | 'full';

const STORAGE_KEY = 'standings-mode';

const RESULT_OPTIONS: { value: Result; label: string; short: string }[] = [
  { value: 'home', label: 'Home win', short: 'H' },
  { value: 'draw', label: 'Draw', short: 'D' },
  { value: 'away', label: 'Away win', short: 'A' },
];

function generateInsight(standings: StandingRow[], decidedCount: number, totalMatches: number): string {
  if (decidedCount === 0) return 'Toggle results above to simulate the group.';

  const [first, second, third, fourth] = standings;

  if (decidedCount === totalMatches) {
    return `${first.team.flag} ${first.team.name} qualifies in 1st place. ${second.team.flag} ${second.team.name} qualifies in 2nd. ${third.team.name} ${fourth ? `and ${fourth.team.name} are` : 'is'} eliminated.`;
  }

  const maxRemainingPts = (totalMatches - decidedCount) * 3;

  if (first.points - third.points > maxRemainingPts) {
    return `${first.team.flag} ${first.team.name} qualifies in 1st place with these results.`;
  }

  if (second.points - third.points > maxRemainingPts) {
    return `${first.team.flag} ${first.team.name} and ${second.team.flag} ${second.team.name} qualify with these results. ${third.team.name} ${fourth ? `and ${fourth.team.name} are` : 'is'} eliminated.`;
  }

  if (fourth && first.points - fourth.points > maxRemainingPts && third.points - fourth.points > maxRemainingPts) {
    return `${fourth.team.flag} ${fourth.team.name} is eliminated with these results.`;
  }

  const teamsInContention = standings.filter(s => first.points - s.points <= maxRemainingPts).length;
  if (teamsInContention >= 3) {
    return `${teamsInContention} teams still in contention for 2 spots.`;
  }

  if (first.points === second.points) {
    return `${first.team.flag} ${first.team.name} and ${second.team.flag} ${second.team.name} are level on ${first.points} points. Everything still to play for.`;
  }

  return `${first.team.flag} ${first.team.name} lead with ${first.points} pts. ${second.team.flag} ${second.team.name} are ${first.points - second.points} point${first.points - second.points !== 1 ? 's' : ''} behind.`;
}

function qualBarColor(prob: number) {
  if (prob >= 80) return 'bg-green-500';
  if (prob >= 50) return 'bg-lime-500';
  if (prob >= 25) return 'bg-amber-400';
  return 'bg-red-400';
}

function rowBorderClass(rank: number): string {
  if (rank <= 2) return 'border-l-4 border-l-dark-accent';
  if (rank === 3) return 'border-l-4 border-l-amber-700';
  return 'border-l-4 border-l-transparent';
}

const MatchToggle = memo(function MatchToggle({
  match, result, onChange,
}: {
  match: Match; result: Result | null; onChange: (result: Result | null) => void;
}) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center gap-2 flex-1 min-w-0 hover:text-dark-accent transition-colors">
          <span className="text-lg">{match.homeTeam.flag}</span>
          <span className="text-xs font-medium text-dark-text-primary truncate">{match.homeTeam.name}</span>
        </Link>
        <span className="text-[10px] text-dark-text-muted font-medium px-2">vs</span>
        <Link href={`/teams/${match.awayTeam.id}`} className="flex items-center gap-2 flex-1 min-w-0 justify-end hover:text-dark-accent transition-colors">
          <span className="text-xs font-medium text-dark-text-primary truncate">{match.awayTeam.name}</span>
          <span className="text-lg">{match.awayTeam.flag}</span>
        </Link>
      </div>
      <div className="flex gap-1.5">
        {RESULT_OPTIONS.map((opt) => (
          <button key={opt.value} type="button"
            onClick={() => onChange(result === opt.value ? null : opt.value)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all active:scale-95
              ${result === opt.value
                ? opt.value === 'home' ? 'bg-blue-600 text-white'
                  : opt.value === 'draw' ? 'bg-dark-text-muted text-white'
                  : 'bg-red-600 text-white'
                : 'bg-dark-border text-dark-text-muted hover:bg-dark-border/70'}
            `}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
});

function ModeToggle({ mode, onChange }: { mode: StandingsMode; onChange: (m: StandingsMode) => void }) {
  return (
    <div className="flex bg-dark-border rounded-full p-0.5">
      {(['short', 'full'] as const).map((m) => (
        <button key={m} type="button" onClick={() => onChange(m)}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all
            ${mode === m ? 'bg-dark-surface text-dark-text-primary shadow-sm' : 'text-dark-text-muted'}
          `}>
          {m === 'short' ? 'Short' : 'Full'}
        </button>
      ))}
    </div>
  );
}

function StandingsTable({ standings, mode }: { standings: StandingRow[]; mode: StandingsMode }) {
  const isShort = mode === 'short';

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-dark-border/30 border-b border-dark-border">
            <th className="text-left pl-3 pr-1 py-2 font-medium text-dark-text-muted w-5">#</th>
            <th className="text-left px-2 py-2 font-medium text-dark-text-muted">Team</th>
            <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">{isShort ? 'PL' : 'P'}</th>
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">W</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">D</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">L</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">GF</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-7">GA</th>}
            <th className="text-center px-1.5 py-2 font-medium text-dark-text-muted w-8">GD</th>
            <th className="text-center px-2 py-2 font-medium text-dark-text-primary w-8">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id}
              className={`border-b border-dark-border/50 transition-colors ${rowBorderClass(row.rank)}
                ${row.rank <= 2 ? 'bg-dark-accent/5' : row.rank === 3 ? 'bg-amber-900/10' : ''}
              `}>
              <td className="pl-3 pr-1 py-2.5 font-semibold text-dark-text-muted">{row.rank}</td>
              <td className="px-2 py-2.5">
                <Link href={`/teams/${row.team.id}`} className="flex items-center gap-2 hover:text-dark-accent transition-colors">
                  <span className="text-base">{row.team.flag}</span>
                  <span className="font-medium text-dark-text-primary truncate">{row.team.name}</span>
                </Link>
              </td>
              <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.played}</td>
              {!isShort && <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.won}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.drawn}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.lost}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.goalsFor}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-dark-text-muted tabular-nums">{row.goalsAgainst}</td>}
              <td className="text-center px-1.5 py-2.5 font-medium tabular-nums text-dark-text-primary">
                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
              </td>
              <td className="text-center px-2 py-2.5 font-bold tabular-nums text-dark-accent">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-dark-border px-3 py-3 space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-1">Qualification probability</p>
        {standings.map((row) => (
          <div key={row.team.id} className="flex items-center gap-2">
            <Link href={`/teams/${row.team.id}`} className="text-xs w-5 text-center">{row.team.flag}</Link>
            <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${qualBarColor(row.qualProb)}`}
                style={{ width: `${row.qualProb}%` }} />
            </div>
            <span className="text-[10px] text-dark-text-muted tabular-nums w-7 text-right font-medium">{Math.round(row.qualProb)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupSection({ group, mode, onModeChange }: { group: Group; mode: StandingsMode; onModeChange: (m: StandingsMode) => void }) {
  const [results, setResults] = useState<MatchResult[]>(() => defaultResults(group.matches));
  const setGroupResults = useGroupSimulationStore(s => s.setGroupResults);

  useEffect(() => {
    setGroupResults(group.id, results);
  }, [group.id, results, setGroupResults]);

  const handleChange = useCallback((matchIdx: number, result: Result | null) => {
    setResults(prev => {
      const next = [...prev];
      if (result === null) {
        next[matchIdx] = { ...next[matchIdx], result: null, homeScore: 0, awayScore: 0 };
      } else {
        next[matchIdx] = {
          ...next[matchIdx], result,
          homeScore: result === 'home' ? 2 : result === 'draw' ? 1 : 0,
          awayScore: result === 'away' ? 2 : result === 'draw' ? 1 : 0,
        };
      }
      return next;
    });
  }, []);

  const standings = useMemo(() => computeStandings(group, results), [group, results]);
  const decidedCount = results.filter(r => r.result !== null).length;
  const insight = useMemo(
    () => generateInsight(standings, decidedCount, group.matches.length),
    [standings, decidedCount, group.matches.length],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-dark-text-primary">{group.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-dark-text-muted tabular-nums">{decidedCount}/{group.matches.length} set</span>
          <ModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>

      <StandingsTable standings={standings} mode={mode} />

      <div className="rounded-xl bg-dark-accent/10 border border-dark-accent/30 p-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent mb-1">What this means</p>
        <p className="text-sm text-dark-text-primary leading-relaxed">{insight}</p>
      </div>

      <div className="space-y-2">
        {group.matches.map((match, idx) => (
          <MatchToggle key={match.id} match={match} result={results[idx]?.result ?? null}
            onChange={(r) => handleChange(idx, r)} />
        ))}
      </div>
    </div>
  );
}

export default function IfThisHappens() {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const fanMode = useUserPreferencesStore(s => s.fanMode);

  const defaultGroupIdx = useMemo(() => {
    if (favoriteTeamId && favoriteTeamId !== 'skipped') {
      const idx = MOCK_GROUPS.findIndex(g => g.teams.some(t => t.id === favoriteTeamId));
      if (idx !== -1) return idx;
    }
    return 0;
  }, [favoriteTeamId]);

  const [activeGroupIdx, setActiveGroupIdx] = useState(defaultGroupIdx);
  const [mode, setMode] = useState<StandingsMode>('short');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useUserPreferencesStore.persist.rehydrate();
    const saved = localStorage.getItem(STORAGE_KEY) as StandingsMode | null;
    if (saved === 'short' || saved === 'full') {
      setMode(saved);
    } else {
      setMode(window.innerWidth < 480 ? 'short' : 'full');
    }
  }, []);

  const handleModeChange = useCallback((m: StandingsMode) => {
    setMode(m);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-48 skeleton rounded" />
        <div className="h-10 skeleton rounded-full" />
        <div className="h-48 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">Group stage simulator</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">If This Happens...</h1>
        <p className="text-xs text-dark-text-muted mt-1">Set your own results for each match and watch the standings update live</p>
        {fanMode === 'new' && (
          <p className="text-[11px] text-dark-accent/80 mt-1">
            Tap a result for each match to see how the group table changes.
          </p>
        )}
      </div>

      <FeatureExplainer
        featureId="groups-if-this-happens"
        text="Tap Home win, Draw, or Away win for each match. The table updates instantly — try different combinations!"
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
        {MOCK_GROUPS.map((group, idx) => (
          <button key={group.id} type="button" onClick={() => setActiveGroupIdx(idx)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 snap-start
              ${idx === activeGroupIdx
                ? 'bg-dark-accent text-dark-bg shadow-sm'
                : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
            `}>
            {group.name.replace('Group ', '')}
          </button>
        ))}
      </div>

      <GroupSection key={MOCK_GROUPS[activeGroupIdx].id} group={MOCK_GROUPS[activeGroupIdx]}
        mode={mode} onModeChange={handleModeChange} />

      <div id="chaos" className="border-t border-dark-border py-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-dark-text-primary">Chaos Mode</h2>
          <p className="text-xs text-dark-text-muted mt-1">Let the app generate a random future — who survives?</p>
        </div>
        <FeatureExplainer
          featureId="groups-chaos-mode"
          text="This generates random realistic results. Tap Randomize over and over to see different futures for the group."
        />
        <ChaosMode key={`chaos-${MOCK_GROUPS[activeGroupIdx].id}`} group={MOCK_GROUPS[activeGroupIdx]} />
      </div>
    </div>
  );
}
