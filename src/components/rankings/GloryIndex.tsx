'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TEAMS } from '@/lib/data';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import type { Match, Team } from '@/types';

const KNOCKOUT_ROUNDS = ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

const TOURNAMENT_START = new Date('2026-06-12');
const MATCHDAY_DATES = [
  { label: 'Matchday 1', date: '2026-06-12' },
  { label: 'Matchday 2', date: '2026-06-16' },
  { label: 'Matchday 3', date: '2026-06-20' },
  { label: 'Round of 32', date: '2026-06-25' },
  { label: 'Round of 16', date: '2026-07-01' },
  { label: 'Quarterfinals', date: '2026-07-04' },
  { label: 'Semifinals', date: '2026-07-08' },
  { label: 'Final', date: '2026-07-15' },
];

function getCurrentPhaseLabel(): string {
  const now = new Date();
  if (now < TOURNAMENT_START) return 'Pre-tournament';
  const passed = MATCHDAY_DATES.filter(m => new Date(m.date) <= now);
  if (passed.length === 0) return 'Pre-tournament';
  return `After ${passed[passed.length - 1].label}`;
}

interface GloryEntry {
  id: string;
  name: string;
  flag: string;
  score: number;
  eliminated: boolean;
  eliminatedRound?: string;
  movement: number;
  flash: boolean;
}

const FORM_POINTS: Record<'W' | 'D' | 'L', number> = { W: 3, D: 1, L: 0 };

const INITIAL_FORMS: Record<string, ('W' | 'D' | 'L')[]> = {
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

function deriveFormFromMatches(
  teamId: string,
  finishedMatches: Match[],
  baseForms: Record<string, ('W' | 'D' | 'L')[]>,
): ('W' | 'D' | 'L')[] {
  const teamMatches = finishedMatches
    .filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN')
    .filter(m => m.homeTeam.id === teamId || m.awayTeam.id === teamId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const results: ('W' | 'D' | 'L')[] = teamMatches.map(m => {
    const isHome = m.homeTeam.id === teamId;
    const hs = m.homeScore ?? 0;
    const as = m.awayScore ?? 0;
    if (hs === as) return 'D';
    return (isHome ? hs > as : as > hs) ? 'W' : 'L';
  });

  const base = baseForms[teamId] ?? ['D','D','D','D','D'];
  const combined = [...results, ...base];
  return combined.slice(0, 5);
}

function deriveEliminations(
  finishedMatches: Match[],
): Record<string, string> {
  const eliminated: Record<string, string> = {};
  finishedMatches
    .filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN')
    .filter(m => KNOCKOUT_ROUNDS.includes(m.round))
    .forEach(m => {
      const hs = m.homeScore ?? 0;
      const as = m.awayScore ?? 0;
      if (hs === as) return;
      const loserId = hs > as ? m.awayTeam.id : m.homeTeam.id;
      if (!eliminated[loserId]) {
        eliminated[loserId] = m.round;
      }
    });
  return eliminated;
}

function buildRanking(
  teams: Team[],
  forms: Record<string, ('W' | 'D' | 'L')[]>,
  eliminations: Record<string, string>,
  previousScores: Record<string, number>,
  flashIds: Set<string>,
): GloryEntry[] {
  const activeTeams = teams.filter(t => !eliminations[t.id]);
  const eliminatedTeams = teams.filter(t => !!eliminations[t.id]);

  const activeRaw = activeTeams.map(t => {
    const form = forms[t.id] ?? ['D','D','D','D','D'];
    const formScore = calcFormScore(form);
    const rankBonus = calcRankBonus(t.rank);
    return { team: t, rawScore: calcRawScore(t.rating, formScore, rankBonus) };
  });

  const allRaw = activeRaw.map(e => e.rawScore);
  const maxRaw = Math.max(...allRaw);
  const minRaw = Math.min(...allRaw);
  const range = maxRaw - minRaw;

  const activeEntries: GloryEntry[] = activeRaw.map(({ team, rawScore }) => {
    const score = range === 0
      ? 100
      : Math.round((0.1 + ((rawScore - minRaw) / range) * 99.9) * 10) / 10;
    const prev = previousScores[team.id];
    const movement = prev !== undefined ? Math.round((score - prev) * 10) / 10 : 0;
    return {
      id: team.id,
      name: team.name,
      flag: team.flag,
      score,
      eliminated: false,
      movement,
      flash: flashIds.has(team.id),
    };
  }).sort((a, b) => b.score - a.score);

  const eliminatedEntries: GloryEntry[] = eliminatedTeams
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(t => ({
      id: t.id,
      name: t.name,
      flag: t.flag,
      score: 0,
      eliminated: true,
      eliminatedRound: eliminations[t.id],
      movement: 0,
      flash: false,
    }));

  return [...activeEntries, ...eliminatedEntries];
}

function getStatusChip(score: number, eliminated: boolean): { label: string; bg: string; text: string } {
  if (eliminated) return { label: 'Eliminated', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' };
  if (score >= 90) return { label: 'Favourite', bg: 'bg-[#1E40AF]', text: 'text-white' };
  if (score >= 75) return { label: 'Contender', bg: 'bg-[#185FA5]', text: 'text-white' };
  if (score >= 55) return { label: 'Dark horse', bg: 'bg-[#92400E]', text: 'text-white' };
  if (score >= 35) return { label: 'Qualifier', bg: 'bg-[#6B7280]', text: 'text-white' };
  return { label: 'Long shot', bg: 'bg-[#D1D5DB]', text: 'text-gray-800' };
}

function scoreTextColor(score: number): string {
  if (score >= 90) return 'text-[#1E40AF]';
  if (score >= 75) return 'text-[#185FA5]';
  if (score >= 55) return 'text-[#92400E]';
  if (score >= 35) return 'text-[#6B7280]';
  return 'text-gray-400';
}

function podiumBorder(rank: number): string {
  if (rank === 1) return 'border-l-[3px] border-l-[#C9A840]';
  if (rank === 2) return 'border-l-[3px] border-l-[#9CA3AF]';
  if (rank === 3) return 'border-l-[3px] border-l-[#CD7F32]';
  return 'border-l-[3px] border-l-transparent';
}

function MovementBadge({ movement, eliminated, eliminatedRound }: {
  movement: number;
  eliminated: boolean;
  eliminatedRound?: string;
}) {
  if (eliminated && eliminatedRound) {
    return (
      <span className="text-[10px] font-medium text-red-400 shrink-0 whitespace-nowrap">
        Out · {eliminatedRound}
      </span>
    );
  }
  if (movement > 0) {
    return (
      <span className="bg-green-50 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-200">
        ↑{Math.abs(movement)}
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

const STORAGE_KEY = 'glory-index-previous';

function loadPreviousScores(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePreviousScores(scores: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch { /* quota exceeded, ignore */ }
}

export default function GloryIndex() {
  const [infoOpen, setInfoOpen] = useState(false);
  const [previousScores, setPreviousScores] = useState<Record<string, number>>({});
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());
  const processedMatchIds = useRef<Set<string>>(new Set());

  const { matches } = useLiveMatches();

  useEffect(() => {
    setPreviousScores(loadPreviousScores());
  }, []);

  const phaseLabel = useMemo(() => getCurrentPhaseLabel(), []);

  const finishedMatches = useMemo(
    () => matches.filter(m => m.status === 'FT' || m.status === 'AET' || m.status === 'PEN'),
    [matches],
  );

  const forms = useMemo(() => {
    const f: Record<string, ('W' | 'D' | 'L')[]> = {};
    for (const t of TEAMS) {
      f[t.id] = deriveFormFromMatches(t.id, finishedMatches, INITIAL_FORMS);
    }
    return f;
  }, [finishedMatches]);

  const eliminations = useMemo(() => deriveEliminations(finishedMatches), [finishedMatches]);

  const rankings = useMemo(
    () => buildRanking(TEAMS, forms, eliminations, previousScores, flashIds),
    [forms, eliminations, previousScores, flashIds],
  );

  const handleNewResults = useCallback(() => {
    const newFinished = finishedMatches.filter(m => !processedMatchIds.current.has(m.id));
    if (newFinished.length === 0) return;

    newFinished.forEach(m => processedMatchIds.current.add(m.id));

    const currentScores: Record<string, number> = {};
    rankings.forEach(e => { currentScores[e.id] = e.score; });

    const changedIds = new Set<string>();
    for (const entry of rankings) {
      const prev = previousScores[entry.id];
      if (prev !== undefined && prev !== entry.score) {
        changedIds.add(entry.id);
      }
    }

    if (changedIds.size > 0) {
      setFlashIds(changedIds);
      setTimeout(() => setFlashIds(new Set()), 600);
    }

    savePreviousScores(currentScores);
    setPreviousScores(currentScores);
  }, [finishedMatches, rankings, previousScores]);

  useEffect(() => {
    handleNewResults();
  }, [handleNewResults]);

  const activeRankings = rankings.filter(e => !e.eliminated);
  const eliminatedRankings = rankings.filter(e => e.eliminated);

  return (
    <div>
      {/* Dynamic header */}
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">
          FIFA World Cup 2026 · Glory Index
        </p>
        <h1 className="text-xl font-semibold text-gray-900">Glory Index</h1>
        <span className="text-sm text-gray-500">
          {phaseLabel} · Updates after every match
        </span>
      </div>

      {/* Collapsible info section */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 mb-4 overflow-hidden">
        <button
          type="button"
          onClick={() => setInfoOpen(o => !o)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-left"
        >
          <span className="text-xs font-semibold text-blue-800">
            How is this calculated? ⓘ
          </span>
          <span className={`text-blue-400 text-xs transition-transform duration-200 ${infoOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        <div
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ maxHeight: infoOpen ? '300px' : '0px' }}
        >
          <div className="px-3 pb-3 text-xs text-blue-800 leading-relaxed space-y-2">
            <p>
              The Glory Index measures each nation&apos;s likelihood of winning the tournament right now.
            </p>
            <p>Three factors decide your score:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li><span className="font-semibold">Squad strength (60%)</span> — player ratings and FIFA ranking</li>
              <li><span className="font-semibold">Recent form (30%)</span> — last 5 results, wins weighted higher</li>
              <li><span className="font-semibold">Ranking momentum (10%)</span> — FIFA ranking trajectory</li>
            </ul>
            <p>
              The leading team always scores 100. Every other nation is ranked relative to them.
              Eliminated teams score zero. The Index updates automatically after every match result.
            </p>
          </div>
        </div>
      </div>

      {/* Rankings list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">All 48 teams</h3>
          <span className="text-[10px] text-gray-300 tabular-nums">{phaseLabel}</span>
        </div>

        {/* Active teams */}
        <div className="divide-y divide-gray-50">
          <AnimatePresence mode="popLayout">
            {activeRankings.map((entry, idx) => {
              const rank = idx + 1;
              const chip = getStatusChip(entry.score, false);
              return (
                <motion.div
                  key={entry.id}
                  layout
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/teams/${entry.id}`}
                    className={`flex items-center gap-3 px-4 h-[52px] transition-colors hover:bg-gray-50 ${podiumBorder(rank)}
                      ${rank <= 3 ? 'bg-amber-50/20' : ''}
                    `}
                    style={entry.flash ? { animation: 'gloryFlash 0.6s ease-out' } : undefined}
                  >
                    <span className={`text-sm font-bold tabular-nums w-8 text-center shrink-0 ${rank <= 10 ? 'text-gray-900' : 'text-gray-400'}`}>
                      {rank}
                    </span>
                    <span className="text-xl shrink-0 w-5 text-center">{entry.flag}</span>
                    <span className="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate">
                      {entry.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${chip.bg} ${chip.text}`}>
                      {chip.label}
                    </span>
                    <MovementBadge movement={entry.movement} eliminated={false} />
                    <span className={`text-sm font-semibold tabular-nums w-12 text-right shrink-0 ${scoreTextColor(entry.score)}`}>
                      {entry.score.toFixed(1)}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Eliminated divider + teams */}
        {eliminatedRankings.length > 0 && (
          <>
            <div className="text-xs text-gray-400 uppercase tracking-widest py-2 px-4 border-t border-b border-gray-100">
              Eliminated
            </div>
            <div className="divide-y divide-gray-50">
              {eliminatedRankings.map(entry => {
                const chip = getStatusChip(0, true);
                return (
                  <Link
                    key={entry.id}
                    href={`/teams/${entry.id}`}
                    className="flex items-center gap-3 px-4 h-[52px] opacity-50 hover:opacity-70 transition-opacity border-l-[3px] border-l-transparent"
                  >
                    <span className="w-8 shrink-0" />
                    <span className="text-xl shrink-0 w-5 text-center">{entry.flag}</span>
                    <span className="flex-1 min-w-0 text-sm font-medium text-gray-400 line-through truncate">
                      {entry.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${chip.bg} ${chip.text}`}>
                      {chip.label}
                    </span>
                    <MovementBadge movement={0} eliminated eliminatedRound={entry.eliminatedRound} />
                    <span className="text-sm font-semibold tabular-nums w-12 text-right shrink-0 text-gray-300">
                      —
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Flash animation keyframes */}
      <style jsx global>{`
        @keyframes gloryFlash {
          0% { background-color: #FEF9C3; }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
}
