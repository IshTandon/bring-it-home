'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { useBracketStore } from '@/lib/store';
import { STADIUMS } from '@/lib/data';
import type { Team, BracketMatch, BracketState, Stadium } from '@/types';

/* ─── Constants ────────────────────────────────────────────── */

const ROUND_NAV = [
  { key: 'r32' as const, label: '1/16', full: 'Round of 32' },
  { key: 'r16' as const, label: '1/8', full: 'Round of 16' },
  { key: 'qf' as const, label: '1/4', full: 'Quarterfinals' },
  { key: 'sf' as const, label: 'Semis', full: 'Semifinals' },
  { key: 'final' as const, label: 'Final', full: 'Final' },
];
const ROUNDS = ROUND_NAV.map(r => r.key);

const ROUND_DATES: Record<keyof BracketState, string> = {
  r32: 'Jun 15–16', r16: 'Jun 20–21', qf: 'Jun 25', sf: 'Jun 28–29', final: 'Jul 4',
};

function getSlotLabel(round: keyof BracketState, matchIndex: number, slot: 'A' | 'B'): string {
  const ri = ROUNDS.indexOf(round);
  if (ri <= 0) return 'TBD';
  const prev = ROUND_NAV[ri - 1];
  const src = matchIndex * 2 + (slot === 'A' ? 0 : 1) + 1;
  return `W. ${prev.label} M${src}`;
}

/* ─── Toast ────────────────────────────────────────────────── */

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-slide-up">
      <div className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
        {message}
      </div>
    </div>
  );
}

/* ─── Mobile Match Card ────────────────────────────────────── */

function TeamSide({
  team, isWinner, isLoser, placeholder, align, onInfo, onPick, canPick,
}: {
  team: Team | null; isWinner: boolean; isLoser: boolean; placeholder: string;
  align: 'left' | 'right'; onInfo: (t: Team) => void; onPick: (t: Team) => void; canPick: boolean;
}) {
  if (!team) {
    return (
      <div className={`flex-1 flex items-center gap-2 min-w-0 ${align === 'right' ? 'justify-end text-right' : ''}`}>
        <span className="text-[11px] text-gray-300 italic truncate">{placeholder}</span>
      </div>
    );
  }

  const faded = isLoser ? 'opacity-40' : '';
  const isRight = align === 'right';

  return (
    <div className={`flex-1 flex items-center gap-2 min-w-0 ${isRight ? 'flex-row-reverse' : ''} ${faded}`}>
      <Link href={`/teams/${team.id}`}
        className="text-xl shrink-0 active:scale-110 transition-transform" aria-label={`Info about ${team.name}`}>
        {team.flag}
      </Link>
      <button type="button" onClick={() => canPick ? onPick(team) : onInfo(team)}
        className={`text-sm truncate transition-colors min-w-0
          ${isWinner ? 'font-bold text-[#185FA5]' : 'font-medium text-gray-800'}
          ${canPick ? 'active:text-[#185FA5]' : ''}
        `}>
        {team.name}
      </button>
      {isWinner && <span className="text-[#185FA5] text-xs shrink-0 font-bold">✓</span>}
    </div>
  );
}

const MobileMatchCard = memo(function MobileMatchCard({
  match, round, matchIndex, onPick, onTeamInfo, onStadiumInfo,
}: {
  match: BracketMatch; round: keyof BracketState; matchIndex: number;
  onPick: (t: Team) => void; onTeamInfo: (t: Team) => void; onStadiumInfo: (n: string) => void;
}) {
  const canPick = !!(match.teamA && match.teamB && !match.winner);
  const hasWinner = !!match.winner;
  const isFinal = round === 'final';

  return (
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm
      ${hasWinner ? 'border-[#185FA5]/30' : 'border-gray-200'}
      ${isFinal ? 'ring-2 ring-amber-300' : ''}
    `}>
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {ROUND_NAV.find(r => r.key === round)?.full} · M{matchIndex + 1}
        </span>
        <span className="text-[10px] text-gray-300 tabular-nums">{ROUND_DATES[round]}</span>
      </div>

      <div className="flex items-center px-4 py-4 gap-2">
        <TeamSide team={match.teamA} isWinner={match.winner?.id === match.teamA?.id}
          isLoser={!!match.winner && match.winner.id !== match.teamA?.id}
          placeholder={getSlotLabel(round, matchIndex, 'A')} align="left"
          onInfo={onTeamInfo} onPick={onPick} canPick={canPick} />

        <div className="flex flex-col items-center shrink-0 px-1">
          <span className="text-[10px] text-gray-300 font-medium">{match.time}</span>
        </div>

        <TeamSide team={match.teamB} isWinner={match.winner?.id === match.teamB?.id}
          isLoser={!!match.winner && match.winner.id !== match.teamB?.id}
          placeholder={getSlotLabel(round, matchIndex, 'B')} align="right"
          onInfo={onTeamInfo} onPick={onPick} canPick={canPick} />
      </div>

      <div className="border-t border-gray-100 px-4 py-1.5 text-center">
        <button type="button" onClick={() => onStadiumInfo(match.stadium)}
          className="text-[10px] text-gray-400 active:text-gray-600 transition-colors">
          📍 {match.stadium}
        </button>
      </div>

      {canPick && (
        <div className="px-4 py-2 bg-blue-50/50 border-t border-blue-100">
          <p className="text-[10px] text-[#185FA5] text-center font-medium">Tap a team to advance</p>
        </div>
      )}
    </div>
  );
});

/* ─── Compact Card (Horizontal Bracket) ───────────────────── */

const CompactCard = memo(function CompactCard({
  match, round, matchIndex, onPick, onTeamInfo,
}: {
  match: BracketMatch; round: keyof BracketState; matchIndex: number;
  onPick: (round: keyof BracketState, idx: number, team: Team) => void;
  onTeamInfo: (t: Team) => void;
}) {
  const canPick = !!(match.teamA && match.teamB && !match.winner);
  const isFinal = round === 'final';

  function Slot({ team, isWinner, isLoser, placeholder }: {
    team: Team | null; isWinner: boolean; isLoser: boolean; placeholder: string;
  }) {
    if (!team) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1.5 h-7">
          <span className="text-[9px] text-gray-300 italic truncate">{placeholder}</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1.5 w-full h-7 transition-colors
        ${isWinner ? 'bg-[#185FA5]/10' : ''} ${isLoser ? 'opacity-40' : ''}
      `}>
        <Link href={`/teams/${team.id}`} className="text-xs shrink-0">{team.flag}</Link>
        <button type="button"
          className={`text-[10px] truncate text-left flex-1 ${isWinner ? 'font-bold text-[#185FA5]' : 'text-gray-700'}
            ${canPick ? 'hover:text-[#185FA5] active:text-[#185FA5]' : ''}
          `}
          onClick={() => canPick ? onPick(round, matchIndex, team) : onTeamInfo(team)}>
          {team.name}
        </button>
        {isWinner && <span className="text-[9px] text-[#185FA5] ml-auto shrink-0 font-bold">✓</span>}
      </div>
    );
  }

  return (
    <div className={`w-[132px] bg-white border rounded-lg overflow-hidden shrink-0 shadow-sm
      ${isFinal ? 'ring-2 ring-amber-300 border-amber-200' : hasWinnerBorder(match)}
    `}>
      <Slot team={match.teamA} isWinner={match.winner?.id === match.teamA?.id}
        isLoser={!!match.winner && match.winner.id !== match.teamA?.id}
        placeholder={getSlotLabel(round, matchIndex, 'A')} />
      <div className="border-t border-gray-100" />
      <Slot team={match.teamB} isWinner={match.winner?.id === match.teamB?.id}
        isLoser={!!match.winner && match.winner.id !== match.teamB?.id}
        placeholder={getSlotLabel(round, matchIndex, 'B')} />
    </div>
  );
});

function hasWinnerBorder(match: BracketMatch): string {
  return match.winner ? 'border-[#185FA5]/30' : 'border-gray-200';
}

/* ─── Bracket Tree (Recursive Horizontal) ─────────────────── */

function BracketTree({
  round, matchIndex, bracket, onPick, onTeamInfo,
}: {
  round: keyof BracketState; matchIndex: number; bracket: BracketState;
  onPick: (round: keyof BracketState, idx: number, team: Team) => void;
  onTeamInfo: (t: Team) => void;
}) {
  const ri = ROUNDS.indexOf(round);

  if (round === 'r32') {
    return (
      <div className="flex items-center py-[2px]">
        <CompactCard match={bracket[round][matchIndex]} round={round}
          matchIndex={matchIndex} onPick={onPick} onTeamInfo={onTeamInfo} />
        <div className="w-3 border-t-2 border-gray-200 shrink-0" />
      </div>
    );
  }

  const prevRound = ROUNDS[ri - 1];
  return (
    <div className="flex items-stretch">
      <div className="flex flex-col justify-center">
        <BracketTree round={prevRound} matchIndex={matchIndex * 2}
          bracket={bracket} onPick={onPick} onTeamInfo={onTeamInfo} />
        <BracketTree round={prevRound} matchIndex={matchIndex * 2 + 1}
          bracket={bracket} onPick={onPick} onTeamInfo={onTeamInfo} />
      </div>
      {/* Connector: vertical bar on left, horizontal center line */}
      <div className="self-stretch w-5 shrink-0 border-l-2 border-gray-200 relative">
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-gray-200 -translate-y-px" />
      </div>
      <div className="self-center flex items-center">
        <CompactCard match={bracket[round][matchIndex]} round={round}
          matchIndex={matchIndex} onPick={onPick} onTeamInfo={onTeamInfo} />
        {round !== 'final' && <div className="w-3 border-t-2 border-gray-200 shrink-0" />}
      </div>
    </div>
  );
}

/* ─── Bottom Sheet ─────────────────────────────────────────── */

function BottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Team Info ─────────────────────────────────────────────── */

function TeamInfoContent({ team }: { team: Team }) {
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-4 pt-2">
        <Link href={`/teams/${team.id}`} className="text-3xl">{team.flag}</Link>
        <div>
          <Link href={`/teams/${team.id}`} className="text-lg font-semibold text-gray-900 hover:text-[#185FA5] transition-colors">{team.name}</Link>
          <p className="text-xs text-gray-400">FIFA Ranking #{team.rank}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box"><div className="stat-num">{team.rating}</div><div className="stat-lbl">Rating</div></div>
        <div className="stat-box"><div className="stat-num">{team.titles}</div><div className="stat-lbl">Titles</div></div>
        <div className="stat-box"><div className="stat-num">{team.finals}</div><div className="stat-lbl">Finals</div></div>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 mb-5">
        <p><span className="font-medium text-gray-900">Coach:</span> {team.coach}</p>
        <p><span className="font-medium text-gray-900">Style:</span> {team.style}</p>
        <p><span className="font-medium text-gray-900">Best result:</span> {team.bestResult}</p>
      </div>
      {team.facts.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">Did you know?</h3>
          <ul className="space-y-2">
            {team.facts.map((fact, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                <span className="text-blue-400 font-bold shrink-0">•</span>{fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Stadium Info ──────────────────────────────────────────── */

function StadiumInfoContent({ stadium }: { stadium: Stadium }) {
  return (
    <div className="px-5 pb-8">
      <div className="pt-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{stadium.name}</h2>
        <p className="text-xs text-gray-400">{stadium.city}, {stadium.country}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box"><div className="stat-num text-base">{(stadium.capacity / 1000).toFixed(0)}k</div><div className="stat-lbl">Capacity</div></div>
        <div className="stat-box"><div className="stat-num text-base">{stadium.opened}</div><div className="stat-lbl">Opened</div></div>
        <div className="stat-box"><div className="stat-num text-base">{stadium.cost.replace('$', '').split(' ')[0]}</div><div className="stat-lbl">Cost</div></div>
      </div>
      <div className="space-y-1.5 text-sm text-gray-600 mb-5">
        <p><span className="font-medium text-gray-900">Surface:</span> {stadium.surface}</p>
        <p><span className="font-medium text-gray-900">Hosting:</span> {stadium.host}</p>
      </div>
      {stadium.facts.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">Did you know?</h3>
          <ul className="space-y-2">
            {stadium.facts.map((fact, i) => (
              <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                <span className="text-green-500 font-bold shrink-0">•</span>{fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Champion Banner ──────────────────────────────────────── */

function ChampionBanner({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.id}`} className="block rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 p-5 text-center mb-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-amber-600 mb-1">World Cup 2026 Champion</p>
      <div className="text-4xl mb-1">{team.flag}</div>
      <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
      <p className="text-sm text-amber-700 mt-0.5 italic">brings it home.</p>
    </Link>
  );
}

/* ─── Main Component ───────────────────────────────────────── */

export default function BracketSimulator() {
  const { bracket, pickWinner, resetBracket, getBracketShareUrl, loadBracketFromUrl } = useBracketStore();
  const [activeRound, setActiveRound] = useState<keyof BracketState>('r32');
  const [viewMode, setViewMode] = useState<'list' | 'bracket'>('list');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('b');
    if (encoded) {
      loadBracketFromUrl(encoded);
      window.history.replaceState({}, '', '/bracket');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = useCallback(async () => {
    try {
      const url = getBracketShareUrl();
      if (navigator.share) {
        await navigator.share({ title: 'My WC 2026 Bracket', url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied to clipboard!');
        setTimeout(() => setToast(''), 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(getBracketShareUrl());
        setToast('Link copied!');
      } catch {
        setToast('Could not copy link');
      }
      setTimeout(() => setToast(''), 2500);
    }
  }, [getBracketShareUrl]);

  const handleStadiumClick = useCallback((name: string) => {
    const stadium = STADIUMS[name];
    if (stadium) setSelectedStadium(stadium);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-36 bg-gray-100 rounded animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const champion = bracket.final[0]?.winner;
  const totalMatches = ROUNDS.reduce((sum, r) => sum + bracket[r].length, 0);
  const decidedMatches = ROUNDS.reduce((sum, r) => sum + bracket[r].filter(m => m.winner).length, 0);
  const pct = totalMatches > 0 ? (decidedMatches / totalMatches) * 100 : 0;

  const activeMatches = bracket[activeRound];
  const activeDecided = activeMatches.filter(m => m.winner).length;
  const roundComplete = activeDecided === activeMatches.length && activeMatches.length > 0;
  const activeIdx = ROUNDS.indexOf(activeRound);
  const nextRound = activeIdx < ROUNDS.length - 1 ? ROUNDS[activeIdx + 1] : null;

  return (
    <div>
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">Knockout stage</p>
          <h1 className="text-xl font-semibold text-gray-900">Build your bracket</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={() => setViewMode(v => v === 'list' ? 'bracket' : 'list')}
            className="btn text-xs px-2 py-1.5" title={viewMode === 'list' ? 'Full bracket view' : 'List view'}>
            {viewMode === 'list' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            )}
          </button>
          <button type="button" onClick={handleShare} className="btn text-xs px-3 py-1.5">Share</button>
          <button type="button" onClick={resetBracket} className="btn text-xs px-3 py-1.5">Reset</button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#185FA5] to-blue-500 transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-gray-400 tabular-nums shrink-0 font-medium">{decidedMatches}/{totalMatches}</span>
      </div>

      {champion && <ChampionBanner team={champion} />}

      {viewMode === 'list' ? (
        <>
          {/* Pill nav */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none mb-4">
            {ROUND_NAV.map(r => {
              const matches = bracket[r.key];
              const decided = matches.filter(m => m.winner).length;
              const total = matches.length;
              const isActive = r.key === activeRound;
              const allDone = decided === total && total > 0;

              return (
                <button key={r.key} type="button" onClick={() => setActiveRound(r.key)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95
                    ${isActive ? 'bg-gray-900 text-white shadow-sm'
                      : allDone ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-white text-gray-500 border border-gray-200'}
                  `}>
                  {r.label}
                  <span className={`text-[10px] tabular-nums ${isActive ? 'text-gray-300' : allDone ? 'text-green-500' : 'text-gray-400'}`}>
                    {decided}/{total}
                  </span>
                  {allDone && !isActive && (
                    <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Round heading */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{ROUND_NAV.find(r => r.key === activeRound)?.full}</h2>
            <span className="text-xs text-gray-400">{activeDecided} of {activeMatches.length} decided</span>
          </div>

          <p className="text-xs text-gray-400 mb-3">Tap a team name to advance them. Tap a flag for info.</p>

          <div className="space-y-3">
            {activeMatches.map((match, idx) => (
              <MobileMatchCard key={match.id} match={match} round={activeRound} matchIndex={idx}
                onPick={(team) => pickWinner(activeRound, idx, team)}
                onTeamInfo={setSelectedTeam} onStadiumInfo={handleStadiumClick} />
            ))}
          </div>

          {roundComplete && nextRound && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-center">
              <p className="text-sm font-medium text-green-800 mb-2">All matches decided.</p>
              <button type="button" onClick={() => setActiveRound(nextRound)} className="btn-primary text-sm px-5 py-2">
                Continue to {ROUND_NAV.find(r => r.key === nextRound)?.full}
              </button>
            </div>
          )}
        </>
      ) : (
        /* ─── Horizontal Bracket View ──────────────────────── */
        <div className="overflow-auto -mx-4 px-4 pb-4">
          <div className="min-w-[800px]">
            <BracketTree round="final" matchIndex={0} bracket={bracket}
              onPick={pickWinner} onTeamInfo={setSelectedTeam} />
          </div>
        </div>
      )}

      {/* Bottom sheets */}
      {selectedTeam && (
        <BottomSheet onClose={() => setSelectedTeam(null)}>
          <TeamInfoContent team={selectedTeam} />
        </BottomSheet>
      )}
      {selectedStadium && (
        <BottomSheet onClose={() => setSelectedStadium(null)}>
          <StadiumInfoContent stadium={selectedStadium} />
        </BottomSheet>
      )}
    </div>
  );
}
