'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TEAMS } from '@/lib/data';

type Snapshot = 'pre' | 'md1' | 'md2';

const SNAPSHOT_LABELS: Record<Snapshot, string> = {
  pre: 'Pre-tournament',
  md1: 'After Matchday 1',
  md2: 'After Matchday 2',
};

interface GloryEntry {
  id: string;
  name: string;
  flag: string;
  score: number;
  movement: number;
}

const FORM_POINTS: Record<'W' | 'D' | 'L', number> = { W: 3, D: 1, L: 0 };

function calcFormScore(form: ('W' | 'D' | 'L')[]): number {
  const pts = form.slice(0, 5).reduce((sum, r) => sum + FORM_POINTS[r], 0);
  return (pts / 15) * 40;
}

function calcRankBonus(rank: number): number {
  return ((49 - rank) / 48) * 10;
}

function calcRawScore(rating: number, formScore: number, rankBonus: number): number {
  return (rating * 0.6) + (formScore * 0.3) + (rankBonus * 0.1);
}

const PRE_FORMS: Record<string, ('W' | 'D' | 'L')[]> = {
  BRA: ['W','W','W','D','W'], FRA: ['W','D','W','W','W'], ARG: ['W','W','W','D','W'],
  ENG: ['W','W','D','W','W'], ESP: ['W','W','W','W','D'], GER: ['W','W','D','W','W'],
  POR: ['W','W','W','D','W'], NED: ['W','W','W','D','W'], BEL: ['D','W','W','D','W'],
  CRO: ['W','W','D','W','W'], URU: ['W','W','W','D','W'], COL: ['W','W','D','W','W'],
  USA: ['W','D','W','W','W'], MEX: ['W','D','W','D','W'], JPN: ['W','W','D','W','W'],
  SEN: ['W','D','W','W','D'], SUI: ['W','W','D','W','W'], MAR: ['W','W','W','D','W'],
  DEN: ['D','W','W','W','D'], AUS: ['D','W','D','W','W'], KOR: ['W','W','D','W','W'],
  CAN: ['W','W','D','W','D'], NGA: ['W','D','W','W','D'], ECU: ['D','W','W','D','W'],
  POL: ['W','W','D','W','D'], SRB: ['D','W','W','W','D'], IRN: ['W','D','D','W','W'],
  GHA: ['W','D','W','D','W'], CMR: ['D','W','D','W','W'], TUN: ['D','W','D','W','D'],
  KSA: ['W','D','W','D','W'], CRC: ['D','W','D','D','W'],
  CHL: ['W','W','D','W','W'], PAR: ['W','D','W','D','W'], PER: ['D','W','D','W','W'],
  ALG: ['W','D','D','W','W'], WAL: ['D','W','D','D','W'], JAM: ['D','D','W','D','W'],
  SCO: ['W','D','W','D','D'], UKR: ['W','W','D','W','D'], UZB: ['W','D','D','W','D'],
  EGY: ['W','D','W','D','W'], CIV: ['W','W','D','W','D'], IDN: ['D','D','W','D','D'],
  BOL: ['D','W','D','D','W'], VEN: ['W','D','D','W','W'], NZL: ['D','W','D','D','W'],
  THA: ['D','D','W','D','D'],
};

const MD1_FORMS: Record<string, ('W' | 'D' | 'L')[]> = {
  BRA: ['W','W','D','W','W'], FRA: ['D','W','W','W','D'], ARG: ['L','W','W','D','W'],
  ENG: ['W','W','W','D','W'], ESP: ['W','W','W','W','W'], GER: ['L','W','D','W','W'],
  POR: ['W','W','W','D','W'], NED: ['W','W','W','D','W'], BEL: ['D','D','W','D','W'],
  CRO: ['D','W','D','W','W'], URU: ['W','W','W','D','W'], COL: ['W','W','D','W','W'],
  USA: ['D','D','W','W','W'], MEX: ['W','W','D','W','D'], JPN: ['W','W','W','D','W'],
  SEN: ['L','D','W','W','D'], SUI: ['D','W','D','W','W'], MAR: ['W','W','W','W','D'],
  DEN: ['W','D','W','W','D'], AUS: ['L','D','W','D','W'], KOR: ['W','W','W','D','W'],
  CAN: ['L','W','D','W','D'], NGA: ['W','W','D','W','D'], ECU: ['D','D','W','D','W'],
  POL: ['L','W','D','W','D'], SRB: ['L','D','W','W','D'], IRN: ['L','W','D','D','W'],
  GHA: ['L','D','W','D','W'], CMR: ['W','D','W','D','W'], TUN: ['W','D','W','D','D'],
  KSA: ['W','W','D','W','D'], CRC: ['L','D','W','D','D'],
  CHL: ['W','W','W','D','W'], PAR: ['D','W','D','D','W'], PER: ['L','D','W','D','W'],
  ALG: ['L','W','D','D','W'], WAL: ['D','D','W','D','D'], JAM: ['L','D','D','W','D'],
  SCO: ['D','W','D','D','D'], UKR: ['W','W','W','D','W'], UZB: ['L','D','D','W','D'],
  EGY: ['L','D','W','D','W'], CIV: ['W','W','W','D','W'], IDN: ['L','D','D','W','D'],
  BOL: ['L','D','W','D','D'], VEN: ['D','W','D','D','W'], NZL: ['L','D','W','D','D'],
  THA: ['L','D','D','W','D'],
};

const MD2_FORMS: Record<string, ('W' | 'D' | 'L')[]> = {
  BRA: ['W','W','W','D','W'], FRA: ['W','D','W','W','D'], ARG: ['W','L','W','W','D'],
  ENG: ['D','W','W','W','D'], ESP: ['W','W','W','W','W'], GER: ['W','L','W','D','W'],
  POR: ['W','W','W','D','W'], NED: ['D','W','W','D','W'], BEL: ['L','D','D','W','D'],
  CRO: ['W','D','W','D','W'], URU: ['W','W','W','W','D'], COL: ['D','W','W','D','W'],
  USA: ['W','D','D','W','W'], MEX: ['D','W','W','D','W'], JPN: ['W','W','W','W','D'],
  SEN: ['W','L','D','W','W'], SUI: ['W','D','W','D','W'], MAR: ['W','W','W','W','W'],
  DEN: ['D','W','D','W','W'], AUS: ['L','L','D','W','D'], KOR: ['D','W','W','W','D'],
  CAN: ['W','L','W','D','W'], NGA: ['D','W','W','D','W'], ECU: ['W','D','D','W','D'],
  POL: ['L','L','W','D','W'], SRB: ['L','L','D','W','W'], IRN: ['L','L','W','D','D'],
  GHA: ['W','L','D','W','D'], CMR: ['L','W','D','W','D'], TUN: ['D','W','D','W','D'],
  KSA: ['L','W','W','D','D'], CRC: ['L','L','D','W','D'],
  CHL: ['D','W','W','W','D'], PAR: ['L','D','W','D','D'], PER: ['D','L','D','W','W'],
  ALG: ['W','L','W','D','D'], WAL: ['L','D','D','W','D'], JAM: ['L','L','D','D','W'],
  SCO: ['L','D','W','D','D'], UKR: ['D','W','W','W','D'], UZB: ['L','L','D','D','W'],
  EGY: ['D','L','D','W','W'], CIV: ['D','W','W','W','D'], IDN: ['L','L','D','D','W'],
  BOL: ['L','L','D','W','D'], VEN: ['L','D','W','D','D'], NZL: ['D','L','D','W','D'],
  THA: ['L','L','D','D','W'],
};

const SNAPSHOT_FORMS: Record<Snapshot, Record<string, ('W' | 'D' | 'L')[]>> = {
  pre: PRE_FORMS, md1: MD1_FORMS, md2: MD2_FORMS,
};

function buildRanking(snapshot: Snapshot): GloryEntry[] {
  const rawEntries = TEAMS.map(t => {
    const form = SNAPSHOT_FORMS[snapshot][t.id] || ['D','D','D','D','D'];
    const formScore = calcFormScore(form);
    const rankBonus = calcRankBonus(t.rank);
    const rawScore = calcRawScore(t.rating, formScore, rankBonus);
    return { id: t.id, name: t.name, flag: t.flag, rawScore, movement: 0 };
  });

  const allRaw = rawEntries.map(e => e.rawScore);
  const maxRaw = Math.max(...allRaw);
  const minRaw = Math.min(...allRaw);
  const range = maxRaw - minRaw;

  return rawEntries.map(e => ({
    ...e,
    score: range === 0 ? 100 : Math.round(((e.rawScore - minRaw) / range) * 1000) / 10,
  })).sort((a, b) => b.score - a.score);
}

function computeMovement(current: GloryEntry[], previous: GloryEntry[]): GloryEntry[] {
  const prevRankMap: Record<string, number> = {};
  previous.forEach((e, i) => { prevRankMap[e.id] = i + 1; });
  return current.map((e, i) => ({
    ...e,
    movement: (prevRankMap[e.id] ?? i + 1) - (i + 1),
  }));
}

function scoreColor(score: number): string {
  if (score >= 90) return 'text-[#185FA5] font-bold';
  if (score >= 75) return 'text-[#3B6D11] font-bold';
  if (score >= 55) return 'text-[#854F0B] font-bold';
  return 'text-gray-500 font-semibold';
}

function getContextChip(score: number): { label: string; classes: string } {
  if (score >= 90) return { label: 'Elite', classes: 'bg-blue-50 text-[#185FA5] border-blue-200' };
  if (score >= 75) return { label: 'Contender', classes: 'bg-green-50 text-[#3B6D11] border-green-200' };
  if (score >= 55) return { label: 'Dark horse', classes: 'bg-amber-50 text-[#854F0B] border-amber-200' };
  if (score >= 35) return { label: 'Qualifier', classes: 'bg-gray-50 text-gray-500 border-gray-200' };
  return { label: 'Long shot', classes: 'bg-gray-50 text-gray-500 border-gray-200' };
}

function podiumBorder(rank: number): string {
  if (rank === 1) return 'border-l-4 border-l-amber-400';
  if (rank === 2) return 'border-l-4 border-l-gray-300';
  if (rank === 3) return 'border-l-4 border-l-amber-600';
  return 'border-l-4 border-l-transparent';
}

function MovementBadge({ movement }: { movement: number }) {
  if (movement > 0) {
    return (
      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-200">
        ↑{movement}
      </span>
    );
  }
  if (movement < 0) {
    return (
      <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-red-200">
        ↓{Math.abs(movement)}
      </span>
    );
  }
  return (
    <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-200">
      —
    </span>
  );
}

export default function GloryIndex() {
  const [snapshot, setSnapshot] = useState<Snapshot>('pre');
  const [infoOpen, setInfoOpen] = useState(false);

  const rankings = useMemo(() => {
    const preRanking = buildRanking('pre');
    if (snapshot === 'pre') return preRanking;

    const current = buildRanking(snapshot);
    const previous = snapshot === 'md1' ? preRanking : buildRanking('md1');
    return computeMovement(current, previous);
  }, [snapshot]);

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">Power rankings</p>
        <h1 className="text-xl font-semibold text-gray-900">Glory Index</h1>
        <p className="text-xs text-gray-400 mt-0.5">Who&apos;s closest to bringing it home.</p>
      </div>

      {/* Collapsible info section */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 mb-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setInfoOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left"
        >
          <span className="text-xs font-semibold text-blue-800">
            Glory Index — how it works ⓘ
          </span>
          <span className={`text-blue-400 text-xs transition-transform duration-200 ${infoOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ maxHeight: infoOpen ? '280px' : '0px' }}
        >
          <div className="px-3 pb-3 text-xs text-blue-800 leading-relaxed space-y-2">
            <p>
              The Glory Index ranks all 48 nations by their likelihood of winning the tournament.
            </p>
            <p>It combines three signals:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><span className="font-semibold">Squad strength (60%)</span> — based on player ratings and FIFA world ranking</li>
              <li><span className="font-semibold">Current form (30%)</span> — last 5 international results, weighted by result</li>
              <li><span className="font-semibold">Tournament momentum (10%)</span> — FIFA ranking trajectory</li>
            </ul>
            <p>
              The top-ranked team scores 100. Every other team is ranked relative to them. Updated after every match.
            </p>
          </div>
        </div>
      </div>

      {/* Filter dropdown */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-1 px-1">
        {(Object.keys(SNAPSHOT_LABELS) as Snapshot[]).map(s => (
          <button key={s} type="button" onClick={() => setSnapshot(s)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-all active:scale-95
              ${s === snapshot ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}
            `}>
            {SNAPSHOT_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Rankings list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">All 48 teams</h3>
          <span className="text-[10px] text-gray-300 tabular-nums">{SNAPSHOT_LABELS[snapshot]}</span>
        </div>
        <div className="divide-y divide-gray-50">
          {rankings.map((entry, idx) => {
            const rank = idx + 1;
            const chip = getContextChip(entry.score);
            return (
              <div key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${podiumBorder(rank)}
                  ${rank <= 3 ? 'bg-amber-50/20' : ''}
                `}>
                <span className="text-sm font-bold text-gray-400 tabular-nums w-7 text-center shrink-0">{rank}</span>
                <Link href={`/teams/${entry.id}`} className="text-lg shrink-0">{entry.flag}</Link>
                <Link href={`/teams/${entry.id}`} className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate hover:text-[#185FA5] transition-colors">
                  {entry.name}
                </Link>
                <MovementBadge movement={entry.movement} />
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${chip.classes}`}>
                  {chip.label}
                </span>
                <span className={`text-sm tabular-nums w-12 text-right shrink-0 ${scoreColor(entry.score)}`}>
                  {entry.score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
