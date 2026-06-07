'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import { MOCK_GROUPS } from '@/lib/data';
import type { Match, Team, StandingRow, Group } from '@/types';

type Result = 'home' | 'draw' | 'away';
type StandingsMode = 'short' | 'full';

const STORAGE_KEY = 'standings-mode';

interface MatchResult {
  matchId: string;
  result: Result | null;
  homeScore: number;
  awayScore: number;
}

const RESULT_OPTIONS: { value: Result; label: string; short: string }[] = [
  { value: 'home', label: 'Home win', short: 'H' },
  { value: 'draw', label: 'Draw', short: 'D' },
  { value: 'away', label: 'Away win', short: 'A' },
];

function defaultResults(matches: Match[]): MatchResult[] {
  return matches.map(m => ({
    matchId: m.id,
    result: null,
    homeScore: 0,
    awayScore: 0,
  }));
}

function computeStandings(group: Group, results: MatchResult[]): StandingRow[] {
  const stats: Record<string, StandingRow> = {};

  group.teams.forEach((team, idx) => {
    stats[team.id] = {
      rank: idx + 1, team, played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, qualProb: 0,
    };
  });

  group.matches.forEach((match, idx) => {
    const r = results[idx];
    if (!r || r.result === null) return;

    const home = stats[match.homeTeam.id];
    const away = stats[match.awayTeam.id];
    if (!home || !away) return;

    let hGoals: number, aGoals: number;
    if (r.result === 'home') {
      hGoals = 2; aGoals = 0;
      home.won++; away.lost++;
      home.points += 3;
    } else if (r.result === 'draw') {
      hGoals = 1; aGoals = 1;
      home.drawn++; away.drawn++;
      home.points += 1; away.points += 1;
    } else {
      hGoals = 0; aGoals = 2;
      away.won++; home.lost++;
      away.points += 3;
    }

    home.played++; away.played++;
    home.goalsFor += hGoals; home.goalsAgainst += aGoals;
    away.goalsFor += aGoals; away.goalsAgainst += hGoals;
    home.goalDiff = home.goalsFor - home.goalsAgainst;
    away.goalDiff = away.goalsFor - away.goalsAgainst;
  });

  const rows = Object.values(stats).sort((a, b) =>
    b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor
  );

  const decidedCount = results.filter(r => r.result !== null).length;
  const totalMatches = group.matches.length;

  rows.forEach((row, idx) => {
    row.rank = idx + 1;
    if (decidedCount === 0) {
      row.qualProb = 50;
    } else if (decidedCount === totalMatches) {
      row.qualProb = idx < 2 ? 100 : 0;
    } else {
      const maxRemainingPts = (totalMatches - decidedCount) * 3;
      const leader = rows[0]?.points ?? 0;
      const gap = leader - row.points;
      const canCatch = maxRemainingPts >= gap;
      if (idx < 2) {
        row.qualProb = Math.min(98, 50 + row.points * 8 - idx * 5);
      } else {
        row.qualProb = canCatch ? Math.max(2, 50 - gap * 10) : 0;
      }
      row.qualProb = Math.max(0, Math.min(100, row.qualProb));
    }
  });

  return rows;
}

function generateInsight(standings: StandingRow[], decidedCount: number, totalMatches: number): string {
  if (decidedCount === 0) return 'Toggle match results to see how the group unfolds.';

  const [first, second, third] = standings;

  if (decidedCount === totalMatches) {
    return `${first.team.flag} ${first.team.name} and ${second.team.flag} ${second.team.name} qualify. ${third.team.name} are eliminated.`;
  }

  if (first.points === second.points) {
    return `${first.team.flag} ${first.team.name} and ${second.team.flag} ${second.team.name} are level on ${first.points} points. Everything still to play for.`;
  }

  if (first.points - standings[standings.length - 1].points >= 6) {
    return `${first.team.flag} ${first.team.name} are pulling away. ${standings[standings.length - 1].team.name} need a miracle.`;
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
  if (rank <= 2) return 'border-l-4 border-l-[#185FA5]';
  if (rank === 3) return 'border-l-4 border-l-amber-400';
  return 'border-l-4 border-l-transparent';
}

/* ─── Match Toggle ────────────────────────────────────────── */

const MatchToggle = memo(function MatchToggle({
  match, result, onChange,
}: {
  match: Match; result: Result | null; onChange: (result: Result | null) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center gap-2 flex-1 min-w-0 hover:text-[#185FA5] transition-colors">
          <span className="text-lg">{match.homeTeam.flag}</span>
          <span className="text-xs font-medium text-gray-700 truncate">{match.homeTeam.name}</span>
        </Link>
        <span className="text-[10px] text-gray-400 font-medium px-2">vs</span>
        <Link href={`/teams/${match.awayTeam.id}`} className="flex items-center gap-2 flex-1 min-w-0 justify-end hover:text-[#185FA5] transition-colors">
          <span className="text-xs font-medium text-gray-700 truncate">{match.awayTeam.name}</span>
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
                  : opt.value === 'draw' ? 'bg-gray-700 text-white'
                  : 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
            `}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
});

/* ─── Mode Toggle ─────────────────────────────────────────── */

function ModeToggle({ mode, onChange }: { mode: StandingsMode; onChange: (m: StandingsMode) => void }) {
  return (
    <div className="flex bg-gray-100 rounded-full p-0.5">
      {(['short', 'full'] as const).map((m) => (
        <button key={m} type="button" onClick={() => onChange(m)}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all
            ${mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}
          `}>
          {m === 'short' ? 'Short' : 'Full'}
        </button>
      ))}
    </div>
  );
}

/* ─── Standings Table ────────────────────────────────────── */

function StandingsTable({ standings, mode }: { standings: StandingRow[]; mode: StandingsMode }) {
  const isShort = mode === 'short';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left pl-3 pr-1 py-2 font-medium text-gray-400 w-5">#</th>
            <th className="text-left px-2 py-2 font-medium text-gray-400">Team</th>
            <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">{isShort ? 'PL' : 'P'}</th>
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">W</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">D</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">L</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">GF</th>}
            {!isShort && <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-7">GA</th>}
            <th className="text-center px-1.5 py-2 font-medium text-gray-400 w-8">GD</th>
            <th className="text-center px-2 py-2 font-medium text-gray-900 w-8">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id}
              className={`border-b border-gray-50 transition-colors ${rowBorderClass(row.rank)}
                ${row.rank <= 2 ? 'bg-blue-50/30' : row.rank === 3 ? 'bg-amber-50/30' : ''}
              `}>
              <td className="pl-3 pr-1 py-2.5 font-semibold text-gray-400">{row.rank}</td>
              <td className="px-2 py-2.5">
                <Link href={`/teams/${row.team.id}`} className="flex items-center gap-2 hover:text-[#185FA5] transition-colors">
                  <span className="text-base">{row.team.flag}</span>
                  <span className="font-medium text-gray-800 truncate">{row.team.name}</span>
                </Link>
              </td>
              <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.played}</td>
              {!isShort && <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.won}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.drawn}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.lost}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.goalsFor}</td>}
              {!isShort && <td className="text-center px-1.5 py-2.5 text-gray-500 tabular-nums">{row.goalsAgainst}</td>}
              <td className="text-center px-1.5 py-2.5 font-medium tabular-nums text-gray-700">
                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
              </td>
              <td className="text-center px-2 py-2.5 font-bold tabular-nums text-gray-900">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Qualification probability bars — always visible */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-1">Qualification probability</p>
        {standings.map((row) => (
          <div key={row.team.id} className="flex items-center gap-2">
            <Link href={`/teams/${row.team.id}`} className="text-xs w-5 text-center">{row.team.flag}</Link>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${qualBarColor(row.qualProb)}`}
                style={{ width: `${row.qualProb}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 tabular-nums w-7 text-right font-medium">{Math.round(row.qualProb)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Group Section ──────────────────────────────────────── */

function GroupSection({ group, mode, onModeChange }: { group: Group; mode: StandingsMode; onModeChange: (m: StandingsMode) => void }) {
  const [results, setResults] = useState<MatchResult[]>(() => defaultResults(group.matches));

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
        <h2 className="text-sm font-semibold text-gray-900">{group.name}</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 tabular-nums">{decidedCount}/{group.matches.length} set</span>
          <ModeToggle mode={mode} onChange={onModeChange} />
        </div>
      </div>

      <StandingsTable standings={standings} mode={mode} />

      <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400 mb-1">What this means</p>
        <p className="text-sm text-blue-800 leading-relaxed">{insight}</p>
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

/* ─── Main IfThisHappens ─────────────────────────────────── */

export default function IfThisHappens() {
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);
  const [mode, setMode] = useState<StandingsMode>('short');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <div className="h-7 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">Group stage simulator</p>
        <h1 className="text-xl font-semibold text-gray-900">If This Happens...</h1>
        <p className="text-xs text-gray-400 mt-1">Toggle match results. Watch the table change.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-4 px-4 snap-x snap-mandatory">
        {MOCK_GROUPS.map((group, idx) => (
          <button key={group.id} type="button" onClick={() => setActiveGroupIdx(idx)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 snap-start
              ${idx === activeGroupIdx
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200'}
            `}>
            {group.name.replace('Group ', '')}
          </button>
        ))}
      </div>

      <GroupSection key={MOCK_GROUPS[activeGroupIdx].id} group={MOCK_GROUPS[activeGroupIdx]}
        mode={mode} onModeChange={handleModeChange} />
    </div>
  );
}
