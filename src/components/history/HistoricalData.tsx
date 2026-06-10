'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOURNAMENT_HISTORY, ALL_TIME_TOP_SCORERS } from '@/lib/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { TournamentHistoryEntry, TournamentHistoryTeam } from '@/lib/data';

type SortKey = 'goals' | 'assists' | 'rating';

const YEARS = ['All-time', '2022', '2018', '2014', '2010', '2006', '2002'] as const;

function WinnerCard({ entry }: { entry: TournamentHistoryEntry }) {
  return (
    <div className="bg-gradient-to-r from-amber-900/30 via-dark-accent/10 to-amber-900/30 border border-dark-accent/30 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dark-accent">
          {entry.year} World Cup
        </span>
        <span className="text-[10px] text-dark-text-muted">{entry.hostFlag} {entry.host}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link href={`/teams/${entry.winner.id}`} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-4xl">{entry.winner.flag}</span>
          <span className="text-sm font-bold text-dark-text-primary">{entry.winner.name}</span>
          <span className="text-[10px] text-dark-accent font-bold uppercase">Champion</span>
        </Link>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-lg font-bold text-dark-text-primary tabular-nums">{entry.finalScore}</span>
          <span className="text-[10px] text-dark-text-muted font-medium">Final</span>
        </div>
        <Link href={`/teams/${entry.runnerUp.id}`} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-4xl">{entry.runnerUp.flag}</span>
          <span className="text-sm font-bold text-dark-text-primary">{entry.runnerUp.name}</span>
          <span className="text-[10px] text-dark-text-muted font-medium uppercase">Runner-up</span>
        </Link>
      </div>
    </div>
  );
}

function TopPlayersTable({ entry, sortKey, onSortChange }: {
  entry: TournamentHistoryEntry; sortKey: SortKey; onSortChange: (k: SortKey) => void;
}) {
  const sorted = useMemo(() =>
    [...entry.topPlayers].sort((a, b) => b[sortKey] - a[sortKey]),
    [entry.topPlayers, sortKey],
  );

  function badgeColor(key: SortKey): string {
    if (key === 'goals') return 'bg-blue-600 text-white';
    if (key === 'assists') return 'bg-green-700 text-white';
    return 'bg-amber-700 text-white';
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Top Players</h3>
        <div className="flex gap-1">
          {(['goals', 'assists', 'rating'] as const).map(k => (
            <button key={k} type="button" onClick={() => onSortChange(k)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all
                ${k === sortKey ? 'bg-dark-accent text-dark-bg' : 'text-dark-text-muted hover:text-dark-text-primary'}
              `}>
              {k === 'goals' ? 'Goals' : k === 'assists' ? 'Assists' : 'Rating'}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-dark-border/50">
        {sorted.map((p, idx) => (
          <div key={p.name} className="flex items-center gap-3 px-4 py-3">
            <span className="text-sm font-bold text-dark-text-muted tabular-nums w-5 text-center shrink-0">{idx + 1}</span>
            <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center shrink-0">
              <span className="text-lg">{p.flag}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-text-primary truncate">{p.name}</p>
              <p className="text-[11px] text-dark-text-muted">{p.flag} {p.team}</p>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-md tabular-nums ${badgeColor(sortKey)}`}>
              {sortKey === 'rating' ? p[sortKey].toFixed(1) : p[sortKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function statWinClass(a: number, b: number): [string, string] {
  if (a > b) return ['bg-dark-accent/10 text-dark-accent font-bold', 'text-dark-text-muted'];
  if (b > a) return ['text-dark-text-muted', 'bg-dark-accent/10 text-dark-accent font-bold'];
  return ['text-dark-text-primary', 'text-dark-text-primary'];
}

function CompareSection({ teams }: { teams: TournamentHistoryTeam[] }) {
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');

  const teamA = teams.find(t => t.id === teamAId);
  const teamB = teams.find(t => t.id === teamBId);

  const stats = useMemo(() => {
    if (!teamA || !teamB) return null;
    return [
      { label: 'Avg Rating', a: teamA.avgRating, b: teamB.avgRating },
      { label: 'Goals Scored', a: teamA.goalsScored, b: teamB.goalsScored },
      { label: 'Goals Conceded', a: teamA.goalsConceded, b: teamB.goalsConceded, invert: true },
      { label: 'Big Chances', a: teamA.bigChances, b: teamB.bigChances },
    ];
  }, [teamA, teamB]);

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Compare</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select value={teamAId} onChange={e => setTeamAId(e.target.value)}
            className="w-full text-sm border border-dark-border rounded-lg px-3 py-2 bg-dark-bg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/30 focus:border-dark-accent/50">
            <option value="">Select team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
          <select value={teamBId} onChange={e => setTeamBId(e.target.value)}
            className="w-full text-sm border border-dark-border rounded-lg px-3 py-2 bg-dark-bg text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-dark-accent/30 focus:border-dark-accent/50">
            <option value="">Select team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
        </div>

        {teamA && teamB && stats && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 text-center mb-2">
              <Link href={`/teams/${teamA.id}`} className="text-sm font-semibold text-dark-text-primary truncate hover:text-dark-accent transition-colors">
                {teamA.flag} {teamA.name}
              </Link>
              <span className="text-[10px] text-dark-text-muted font-medium self-center">VS</span>
              <Link href={`/teams/${teamB.id}`} className="text-sm font-semibold text-dark-text-primary truncate hover:text-dark-accent transition-colors">
                {teamB.flag} {teamB.name}
              </Link>
            </div>
            {stats.map(s => {
              const [clsA, clsB] = s.invert
                ? statWinClass(s.b, s.a)
                : statWinClass(s.a, s.b);
              return (
                <div key={s.label} className="grid grid-cols-3 gap-2 items-center">
                  <div className={`text-center py-1.5 px-2 rounded-lg text-sm tabular-nums ${clsA}`}>{s.a}</div>
                  <div className="text-center text-[10px] text-dark-text-muted font-medium">{s.label}</div>
                  <div className={`text-center py-1.5 px-2 rounded-lg text-sm tabular-nums ${clsB}`}>{s.b}</div>
                </div>
              );
            })}
          </div>
        )}

        {(!teamA || !teamB) && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-dark-border flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <p className="text-xs text-dark-text-muted">Select two teams to compare their tournament stats.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function YearContent({ entry }: { entry: TournamentHistoryEntry }) {
  const [sortKey, setSortKey] = useState<SortKey>('goals');
  const { containerRef, getRevealProps } = useScrollReveal<HTMLDivElement>({ staggerDelay: 100 });

  return (
    <div ref={containerRef} className="space-y-3">
      <div {...getRevealProps(0)}><WinnerCard entry={entry} /></div>
      <div {...getRevealProps(1)}><TopPlayersTable entry={entry} sortKey={sortKey} onSortChange={setSortKey} /></div>
      <div {...getRevealProps(2)}><CompareSection teams={entry.topTeams} /></div>
    </div>
  );
}

const TEAM_FLAGS: Record<string, string> = {
  GER: '🇩🇪', BRA: '🇧🇷', FRA: '🇫🇷', ARG: '🇦🇷', HUN: '🇭🇺',
};

const RECORDS = [
  { label: 'Most titles', value: 'Brazil (5)', icon: '🏆' },
  { label: 'Most goals (nation)', value: 'Brazil — 237', icon: '⚽' },
  { label: 'Most goals (single WC)', value: 'Fontaine — 13 in 1958', icon: '🔥' },
  { label: 'Biggest final win', value: 'Brazil 5–2 Sweden 1958', icon: '💥' },
  { label: 'Most WC appearances', value: 'Brazil (22, every tournament)', icon: '🌍' },
  { label: 'Fastest goal', value: 'Hakan Şükür — 10.8s (2002)', icon: '⚡' },
];

function RecordsStrip() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
      {RECORDS.map(r => (
        <div key={r.label} className="shrink-0 w-44 bg-dark-surface border border-dark-border rounded-xl p-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">{r.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">{r.label}</span>
          </div>
          <span className="text-sm font-semibold text-dark-text-primary leading-tight">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function AllTimeContent() {
  const [sortKey, setSortKey] = useState<SortKey>('goals');
  const { containerRef, getRevealProps } = useScrollReveal<HTMLDivElement>({ staggerDelay: 100 });

  const allPlayers = useMemo(() => {
    const map: Record<string, { name: string; flag: string; team: string; goals: number; assists: number; rating: number; appearances: number }> = {};
    TOURNAMENT_HISTORY.forEach(entry => {
      entry.topPlayers.forEach(p => {
        const key = p.name;
        if (!map[key]) {
          map[key] = { name: p.name, flag: p.flag, team: p.team, goals: 0, assists: 0, rating: 0, appearances: 0 };
        }
        map[key].goals += p.goals;
        map[key].assists += p.assists;
        map[key].rating += p.rating;
        map[key].appearances += 1;
      });
    });
    return Object.values(map).map(p => ({
      ...p,
      rating: Math.round((p.rating / p.appearances) * 10) / 10,
    })).sort((a, b) => b[sortKey] - a[sortKey]).slice(0, 5);
  }, [sortKey]);

  function badgeColor(key: SortKey): string {
    if (key === 'goals') return 'bg-blue-600 text-white';
    if (key === 'assists') return 'bg-green-700 text-white';
    return 'bg-amber-700 text-white';
  }

  return (
    <div ref={containerRef} className="space-y-3">
      <div {...getRevealProps(0)}>
        <RecordsStrip />
      </div>

      <div {...getRevealProps(1)} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Champions Roll</h3>
        </div>
        <div className="divide-y divide-dark-border/50">
          {TOURNAMENT_HISTORY.map(entry => (
            <div key={entry.year} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-dark-text-muted tabular-nums w-10 shrink-0">{entry.year}</span>
              <Link href={`/teams/${entry.winner.id}`} className="text-lg shrink-0">{entry.winner.flag}</Link>
              <Link href={`/teams/${entry.winner.id}`} className="flex-1 text-sm font-medium text-dark-text-primary truncate hover:text-dark-accent transition-colors">
                {entry.winner.name}
              </Link>
              <span className="text-xs text-dark-text-muted tabular-nums shrink-0">{entry.finalScore}</span>
              <Link href={`/teams/${entry.runnerUp.id}`} className="text-lg shrink-0">{entry.runnerUp.flag}</Link>
            </div>
          ))}
        </div>
      </div>

      <div {...getRevealProps(2)} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">All-Time Top Scorers</h3>
          <p className="text-[10px] text-dark-text-muted mt-0.5">Since 1930</p>
        </div>
        <div className="divide-y divide-dark-border/50">
          {ALL_TIME_TOP_SCORERS.map((p, idx) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-dark-text-muted tabular-nums w-5 text-center shrink-0">{idx + 1}</span>
              <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center shrink-0">
                <span className="text-lg">{TEAM_FLAGS[p.team] ?? '🏳️'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-text-primary truncate">{p.name}</p>
                <p className="text-[11px] text-dark-text-muted">{p.team} · {p.tournaments}</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-md tabular-nums bg-blue-600 text-white">
                {p.goals}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div {...getRevealProps(3)} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-dark-border/30 border-b border-dark-border flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Top Performers 2002–2022</h3>
            <p className="text-[10px] text-dark-text-muted mt-0.5">From the last 6 tournaments</p>
          </div>
          <div className="flex gap-1">
            {(['goals', 'assists', 'rating'] as const).map(k => (
              <button key={k} type="button" onClick={() => setSortKey(k)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all
                  ${k === sortKey ? 'bg-dark-accent text-dark-bg' : 'text-dark-text-muted hover:text-dark-text-primary'}
                `}>
                {k === 'goals' ? 'Goals' : k === 'assists' ? 'Assists' : 'Rating'}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-dark-border/50">
          {allPlayers.map((p, idx) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-dark-text-muted tabular-nums w-5 text-center shrink-0">{idx + 1}</span>
              <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center shrink-0">
                <span className="text-lg">{p.flag}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-text-primary truncate">{p.name}</p>
                <p className="text-[11px] text-dark-text-muted">{p.flag} {p.team}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md tabular-nums ${badgeColor(sortKey)}`}>
                {sortKey === 'rating' ? p[sortKey].toFixed(1) : p[sortKey]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HistoricalData() {
  const [activeYear, setActiveYear] = useState<string>('All-time');

  const entry = activeYear !== 'All-time'
    ? TOURNAMENT_HISTORY.find(e => String(e.year) === activeYear)
    : null;

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">The record books</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">World Cup History</h1>
        <p className="text-xs text-dark-text-muted mt-0.5">Champions, legends, and numbers that shaped the game.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-1 px-1">
        {YEARS.map(y => (
          <button key={y} type="button" onClick={() => setActiveYear(y)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95
              ${y === activeYear ? 'bg-dark-accent text-dark-bg shadow-sm' : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
            `}>
            {y}
          </button>
        ))}
      </div>

      {activeYear === 'All-time' && <AllTimeContent />}
      {entry && <YearContent entry={entry} />}
    </div>
  );
}
