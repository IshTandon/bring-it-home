'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TOURNAMENT_HISTORY } from '@/lib/data';
import type { TournamentHistoryEntry, TournamentHistoryTeam } from '@/lib/data';

type SortKey = 'goals' | 'assists' | 'rating';

const YEARS = ['All-time', '2022', '2018', '2014', '2010', '2006', '2002'] as const;

function WinnerCard({ entry }: { entry: TournamentHistoryEntry }) {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
          {entry.year} World Cup
        </span>
        <span className="text-[10px] text-gray-400">{entry.hostFlag} {entry.host}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link href={`/teams/${entry.winner.id}`} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-4xl">{entry.winner.flag}</span>
          <span className="text-sm font-bold text-gray-900">{entry.winner.name}</span>
          <span className="text-[10px] text-amber-600 font-bold uppercase">Champion</span>
        </Link>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-lg font-bold text-gray-900 tabular-nums">{entry.finalScore}</span>
          <span className="text-[10px] text-gray-400 font-medium">Final</span>
        </div>
        <Link href={`/teams/${entry.runnerUp.id}`} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-4xl">{entry.runnerUp.flag}</span>
          <span className="text-sm font-bold text-gray-900">{entry.runnerUp.name}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase">Runner-up</span>
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
    if (key === 'goals') return 'bg-[#185FA5] text-white';
    if (key === 'assists') return 'bg-[#3B6D11] text-white';
    return 'bg-[#854F0B] text-white';
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Top Players</h3>
        <div className="flex gap-1">
          {(['goals', 'assists', 'rating'] as const).map(k => (
            <button key={k} type="button" onClick={() => onSortChange(k)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all
                ${k === sortKey ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}
              `}>
              {k === 'goals' ? 'Goals' : k === 'assists' ? 'Assists' : 'Rating'}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {sorted.map((p, idx) => (
          <div key={p.name} className="flex items-center gap-3 px-4 py-3">
            <span className="text-sm font-bold text-gray-300 tabular-nums w-5 text-center shrink-0">{idx + 1}</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <span className="text-lg">{p.flag}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
              <p className="text-[11px] text-gray-400">{p.flag} {p.team}</p>
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
  if (a > b) return ['bg-[#185FA5]/10 text-[#185FA5] font-bold', 'text-gray-500'];
  if (b > a) return ['text-gray-500', 'bg-[#185FA5]/10 text-[#185FA5] font-bold'];
  return ['text-gray-700', 'text-gray-700'];
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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Compare</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <select value={teamAId} onChange={e => setTeamAId(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
            <option value="">Select team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
          <select value={teamBId} onChange={e => setTeamBId(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
            <option value="">Select team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.flag} {t.name}</option>)}
          </select>
        </div>

        {teamA && teamB && stats && (
          <div className="space-y-2">
            {/* Team headers */}
            <div className="grid grid-cols-3 gap-2 text-center mb-2">
              <Link href={`/teams/${teamA.id}`} className="text-sm font-semibold text-gray-900 truncate hover:text-[#185FA5] transition-colors">
                {teamA.flag} {teamA.name}
              </Link>
              <span className="text-[10px] text-gray-400 font-medium self-center">VS</span>
              <Link href={`/teams/${teamB.id}`} className="text-sm font-semibold text-gray-900 truncate hover:text-[#185FA5] transition-colors">
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
                  <div className="text-center text-[10px] text-gray-400 font-medium">{s.label}</div>
                  <div className={`text-center py-1.5 px-2 rounded-lg text-sm tabular-nums ${clsB}`}>{s.b}</div>
                </div>
              );
            })}
          </div>
        )}

        {(!teamA || !teamB) && (
          <p className="text-xs text-gray-400 text-center py-4">Select two teams to compare their tournament stats.</p>
        )}
      </div>
    </div>
  );
}

function YearContent({ entry }: { entry: TournamentHistoryEntry }) {
  const [sortKey, setSortKey] = useState<SortKey>('goals');

  return (
    <div className="space-y-3">
      <WinnerCard entry={entry} />
      <TopPlayersTable entry={entry} sortKey={sortKey} onSortChange={setSortKey} />
      <CompareSection teams={entry.topTeams} />
    </div>
  );
}

function AllTimeContent() {
  const [sortKey, setSortKey] = useState<SortKey>('goals');

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
    if (key === 'goals') return 'bg-[#185FA5] text-white';
    if (key === 'assists') return 'bg-[#3B6D11] text-white';
    return 'bg-[#854F0B] text-white';
  }

  return (
    <div className="space-y-3">
      {/* Winners timeline */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Champions Roll</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {TOURNAMENT_HISTORY.map(entry => (
            <div key={entry.year} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-gray-400 tabular-nums w-10 shrink-0">{entry.year}</span>
              <Link href={`/teams/${entry.winner.id}`} className="text-lg shrink-0">{entry.winner.flag}</Link>
              <Link href={`/teams/${entry.winner.id}`} className="flex-1 text-sm font-medium text-gray-900 truncate hover:text-[#185FA5] transition-colors">
                {entry.winner.name}
              </Link>
              <span className="text-xs text-gray-400 tabular-nums shrink-0">{entry.finalScore}</span>
              <Link href={`/teams/${entry.runnerUp.id}`} className="text-lg shrink-0">{entry.runnerUp.flag}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* All-time top players */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">All-Time Top Players</h3>
          <div className="flex gap-1">
            {(['goals', 'assists', 'rating'] as const).map(k => (
              <button key={k} type="button" onClick={() => setSortKey(k)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all
                  ${k === sortKey ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}
                `}>
                {k === 'goals' ? 'Goals' : k === 'assists' ? 'Assists' : 'Rating'}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {allPlayers.map((p, idx) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-sm font-bold text-gray-300 tabular-nums w-5 text-center shrink-0">{idx + 1}</span>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <span className="text-lg">{p.flag}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                <p className="text-[11px] text-gray-400">{p.flag} {p.team}</p>
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
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">The record books</p>
        <h1 className="text-xl font-semibold text-gray-900">World Cup History</h1>
        <p className="text-xs text-gray-400 mt-0.5">Champions, legends, and numbers that shaped the game.</p>
      </div>

      {/* Year filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-1 px-1">
        {YEARS.map(y => (
          <button key={y} type="button" onClick={() => setActiveYear(y)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95
              ${y === activeYear ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}
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
