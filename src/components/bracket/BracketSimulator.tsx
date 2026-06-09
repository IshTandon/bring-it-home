'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef, Component, type ReactNode } from 'react';
import Link from 'next/link';
import { useBracketStore, useBracketActions } from '@/lib/store';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { STADIUMS } from '@/lib/data';
import { isMatchLive, isMatchFinished, formatMatchMinute } from '@/lib/matchUtils';
import { detectCalledIt, saveCalledItMoment } from '@/lib/called-it';
import MatchMinuteBadge from '@/components/ui/MatchMinuteBadge';
import MyMoments from '@/components/bracket/MyMoments';
import ICalledItCard from '@/components/bracket/ICalledItCard';
import type { Team, BracketMatch, BracketState, Stadium, Match, MatchStatus } from '@/types';

interface LiveScore {
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  winnerId?: string;
}

/* ─── Error Boundary ──────────────────────────────────────── */

interface ErrorBoundaryState { hasError: boolean; error: Error | null }

class BracketErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wc2026-bracket');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-dark-text-primary mb-1">Something went wrong</h2>
          <p className="text-sm text-dark-text-muted mb-6 max-w-xs">
            The bracket ran into an issue. Reset to start fresh — your picks will be cleared.
          </p>
          <button type="button" onClick={this.handleReset}
            className="btn-primary text-sm px-6 py-2.5">
            Reset bracket
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Skeleton Loader ─────────────────────────────────────── */

function BracketSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="h-3 w-20 bg-dark-border rounded animate-pulse mb-2" />
          <div className="h-6 w-40 bg-dark-border rounded animate-pulse" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-8 w-16 bg-dark-border rounded-lg animate-pulse" />
          <div className="h-8 w-16 bg-dark-border rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="h-1.5 bg-dark-border rounded-full animate-pulse" />
      <div className="flex gap-1.5 overflow-hidden pb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-9 w-20 bg-dark-border rounded-full animate-pulse shrink-0" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-dark-border/30 border-b border-dark-border">
              <div className="h-3 w-32 skeleton rounded animate-pulse" />
            </div>
            <div className="flex items-center px-4 py-4 gap-2">
              <div className="flex-1 flex items-center gap-2">
                <div className="w-6 h-6 skeleton rounded animate-pulse" />
                <div className="h-4 w-20 skeleton rounded animate-pulse" />
              </div>
              <div className="h-3 w-10 bg-dark-border rounded animate-pulse" />
              <div className="flex-1 flex items-center gap-2 justify-end">
                <div className="h-4 w-20 skeleton rounded animate-pulse" />
                <div className="w-6 h-6 skeleton rounded animate-pulse" />
              </div>
            </div>
            <div className="border-t border-dark-border px-4 py-2">
              <div className="h-3 w-28 bg-dark-border rounded animate-pulse mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

const ROUND_LABEL_CENTERS = [66, 230, 394, 558, 722];

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

/* ─── Confetti Burst ──────────────────────────────────────── */

const CONFETTI_COLORS = ['#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F97316'];

function ConfettiBurst() {
  const pieces = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 500,
      y: -(Math.random() * 400 + 80),
      r: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.4,
      round: Math.random() > 0.5,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <div className="absolute left-1/2 top-1/3">
        {pieces.map(p => (
          <div key={p.id} className="confetti-piece"
            style={{
              width: p.size,
              height: p.size * (p.round ? 1 : 0.6),
              backgroundColor: p.color,
              borderRadius: p.round ? '50%' : '2px',
              '--tx': `${p.x}px`,
              '--ty': `${p.y}px`,
              '--tr': `${p.r}deg`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Team Side (memoized) ─────────────────────────────────── */

const TeamSide = memo(function TeamSide({
  team, isWinner, isLoser, hasWinnerSelected, placeholder, align, onInfo, onPick, canPick,
}: {
  team: Team | null; isWinner: boolean; isLoser: boolean; hasWinnerSelected: boolean;
  placeholder: string; align: 'left' | 'right';
  onInfo: (t: Team) => void; onPick: (t: Team) => void; canPick: boolean;
}) {
  const [flashing, setFlashing] = useState(false);

  const handlePick = useCallback((t: Team) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 300);
    onPick(t);
  }, [onPick]);

  if (!team) {
    return (
      <div className={`flex-1 flex items-center gap-2 min-w-0 ${align === 'right' ? 'justify-end flex-row-reverse' : ''}`}>
        <div className="w-5 h-5 rounded-full bg-dark-border shrink-0" />
        <span className="text-[11px] text-dark-text-muted/50 font-medium">TBD</span>
      </div>
    );
  }

  const isRight = align === 'right';

  return (
    <div className={`flex-1 flex items-center gap-2 min-w-0 animate-team-slide-in ${isRight ? 'flex-row-reverse' : ''} ${isLoser ? 'opacity-40' : ''}`}>
      <Link href={`/teams/${team.id}`}
        className="text-xl shrink-0 active:scale-110 transition-transform will-change-transform" aria-label={`Info about ${team.name}`}>
        {team.flag}
      </Link>
      <div className="flex flex-col min-w-0">
        <button type="button" onClick={() => canPick ? handlePick(team) : onInfo(team)}
          className={`text-sm truncate transition-colors duration-150 min-w-0 text-left min-h-[44px] flex items-center rounded-md px-1
            ${flashing ? 'bg-dark-accent/25' : ''}
            ${isWinner ? 'font-bold text-dark-accent' : 'font-medium text-dark-text-primary'}
            ${canPick ? 'active:bg-dark-accent/20' : ''}
          `}>
          {team.name}
        </button>
        {isLoser && canPick && (
          <span className="text-[10px] text-dark-text-muted">← change</span>
        )}
      </div>
      {isWinner && <span className="text-dark-accent text-xs shrink-0 font-bold">✓</span>}
    </div>
  );
});

/* ─── Mobile Match Card (memoized) ────────────────────────── */

const MobileMatchCard = memo(function MobileMatchCard({
  match, round, matchIndex, onPick, onTeamInfo, onStadiumInfo, liveScore,
}: {
  match: BracketMatch; round: keyof BracketState; matchIndex: number;
  onPick: (t: Team) => void; onTeamInfo: (t: Team) => void; onStadiumInfo: (n: string) => void;
  liveScore?: LiveScore;
}) {
  const hasRealScore = !!liveScore;
  const realLive = hasRealScore && isMatchLive(liveScore.status);
  const realFinished = hasRealScore && isMatchFinished(liveScore.status);
  const canPick = !hasRealScore && !!(match.teamA && match.teamB);
  const hasWinner = !!match.winner || (realFinished && !!liveScore.winnerId);
  const isFinal = round === 'final';

  const winnerId = liveScore?.winnerId ?? match.winner?.id;

  return (
    <div className={`bg-dark-surface border rounded-xl overflow-hidden shadow-sm transition-[border-color,box-shadow] duration-200 will-change-transform
      ${realLive ? 'border-red-800/50 ring-1 ring-red-100' : hasWinner ? 'border-[#185FA5]/30' : 'border-dark-border'}
      ${isFinal ? 'ring-2 ring-amber-300' : ''}
    `}>
      <div className="flex items-center justify-between px-4 py-1.5 bg-dark-border/30 border-b border-dark-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">
          {ROUND_NAV.find(r => r.key === round)?.full} · M{matchIndex + 1}
        </span>
        {hasRealScore ? (
          <MatchMinuteBadge status={liveScore.status} minute={liveScore.minute} time={match.time} />
        ) : (
          <span className="text-[10px] text-dark-text-muted/50 tabular-nums">{ROUND_DATES[round]}</span>
        )}
      </div>

      <div className="flex items-center px-4 py-4 gap-2">
        <TeamSide team={match.teamA} isWinner={winnerId === match.teamA?.id}
          isLoser={!!winnerId && winnerId !== match.teamA?.id}
          hasWinnerSelected={!!winnerId}
          placeholder={getSlotLabel(round, matchIndex, 'A')} align="left"
          onInfo={onTeamInfo} onPick={onPick} canPick={canPick} />

        <div className="flex flex-col items-center shrink-0 px-2">
          {hasRealScore ? (
            <>
              <span className={`text-lg font-bold tabular-nums ${realLive ? 'text-dark-text-primary' : 'text-dark-accent'}`}>
                {liveScore.homeScore} – {liveScore.awayScore}
              </span>
              {realLive && liveScore.minute && (
                <span className="text-[10px] text-red-500 font-semibold tabular-nums">
                  {formatMatchMinute(liveScore.minute, liveScore.status)}
                </span>
              )}
            </>
          ) : (
            <span className="text-[10px] text-dark-text-muted/50 font-medium">{match.time}</span>
          )}
        </div>

        <TeamSide team={match.teamB} isWinner={winnerId === match.teamB?.id}
          isLoser={!!winnerId && winnerId !== match.teamB?.id}
          hasWinnerSelected={!!winnerId}
          placeholder={getSlotLabel(round, matchIndex, 'B')} align="right"
          onInfo={onTeamInfo} onPick={onPick} canPick={canPick} />
      </div>

      <div className="border-t border-dark-border px-4 py-1.5 text-center">
        <button type="button" onClick={() => onStadiumInfo(match.stadium)}
          className="text-[10px] text-dark-text-muted active:text-dark-text-muted transition-colors">
          📍 {match.stadium}
        </button>
      </div>

      {hasRealScore && (
        <div className="px-4 py-1.5 bg-blue-900/20/50 border-t border-blue-100">
          <p className="text-[10px] text-dark-accent text-center font-medium">
            {realLive ? 'Live result · auto-updating' : 'Final result'}
          </p>
        </div>
      )}

      {canPick && !hasRealScore && (
        <div className="px-4 py-2 bg-blue-900/20/50 border-t border-blue-100">
          <p className="text-[10px] text-dark-accent text-center font-medium">
            {hasWinner ? 'Tap the other team to change your pick' : 'Tap a team to advance'}
          </p>
        </div>
      )}
    </div>
  );
});

/* ─── Compact Card (Horizontal Bracket, memoized) ──────────── */

const ROUND_CARD_WIDTHS: Record<keyof BracketState, string> = {
  r32: 'w-[140px]', r16: 'w-[150px]', qf: 'w-[160px]', sf: 'w-[160px]', final: 'w-[168px]',
};

const CompactCard = memo(function CompactCard({
  match, round, matchIndex, onPick, onTeamInfo,
}: {
  match: BracketMatch; round: keyof BracketState; matchIndex: number;
  onPick: (round: keyof BracketState, idx: number, team: Team) => void;
  onTeamInfo: (t: Team) => void;
}) {
  const canPick = !!(match.teamA && match.teamB);
  const isFinal = round === 'final';
  const [flashId, setFlashId] = useState<string | null>(null);

  const handlePick = useCallback((team: Team) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    setFlashId(team.id);
    setTimeout(() => setFlashId(null), 300);
    onPick(round, matchIndex, team);
  }, [onPick, round, matchIndex]);

  function Slot({ team, isWinner, isLoser, placeholder }: {
    team: Team | null; isWinner: boolean; isLoser: boolean; placeholder: string;
  }) {
    if (!team) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px]">
          <div className="w-4 h-4 rounded-full bg-dark-border shrink-0" />
          <span className="text-[10px] text-dark-text-muted/50 font-medium">TBD</span>
        </div>
      );
    }
    const isFlashing = flashId === team.id;
    return (
      <button type="button"
        onClick={() => canPick ? handlePick(team) : onTeamInfo(team)}
        className={`flex items-center gap-1.5 px-3 py-2.5 w-full min-h-[44px] transition-colors duration-150 text-left
          ${isFlashing ? 'bg-dark-accent/25' : isWinner ? 'bg-dark-accent/10' : ''}
          ${isLoser ? 'opacity-40' : ''}
          ${canPick ? 'active:bg-dark-accent/20' : ''}
        `}
      >
        <span className="text-sm shrink-0">{team.flag}</span>
        <span className={`text-[13px] truncate flex-1 ${isWinner ? 'font-bold text-dark-accent' : 'text-dark-text-primary'}`}>
          {team.name}
        </span>
        {isWinner && <span className="text-[10px] text-dark-accent shrink-0 font-bold">✓</span>}
      </button>
    );
  }

  return (
    <div className={`${ROUND_CARD_WIDTHS[round]} bg-dark-surface border rounded-lg overflow-hidden shrink-0 shadow-sm will-change-transform
      ${isFinal ? 'ring-2 ring-amber-300 border-amber-800/50' : hasWinnerBorder(match)}
    `}>
      <Slot team={match.teamA} isWinner={match.winner?.id === match.teamA?.id}
        isLoser={!!match.winner && match.winner.id !== match.teamA?.id}
        placeholder={getSlotLabel(round, matchIndex, 'A')} />
      <div className="relative border-t border-dark-border">
        {round === 'r32' && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-surface px-1 text-[7px] font-bold uppercase tracking-wider text-dark-text-muted/50 leading-none">
            VS
          </span>
        )}
      </div>
      <Slot team={match.teamB} isWinner={match.winner?.id === match.teamB?.id}
        isLoser={!!match.winner && match.winner.id !== match.teamB?.id}
        placeholder={getSlotLabel(round, matchIndex, 'B')} />
    </div>
  );
});

function hasWinnerBorder(match: BracketMatch): string {
  return match.winner ? 'border-[#185FA5]/30' : 'border-dark-border';
}

/* ─── Bracket Tree (Recursive Horizontal) ─────────────────── */

const BracketTree = memo(function BracketTree({
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
        <div className="w-3 border-t-2 border-dark-border shrink-0" />
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
      <div className="self-stretch w-5 shrink-0 border-l-2 border-dark-border relative">
        <div className="absolute top-1/2 left-0 w-full border-t-2 border-dark-border -translate-y-px" />
      </div>
      <div className="self-center flex items-center">
        <CompactCard match={bracket[round][matchIndex]} round={round}
          matchIndex={matchIndex} onPick={onPick} onTeamInfo={onTeamInfo} />
        {round !== 'final' && <div className="w-3 border-t-2 border-dark-border shrink-0" />}
      </div>
    </div>
  );
});

/* ─── Lazy-loaded rounds (QF, SF, Final are off-screen initially) ─ */

const LazyRoundMatches = memo(function LazyRoundMatches({
  matches, round, onPick, onTeamInfo, onStadiumInfo, getLiveScore,
}: {
  matches: BracketMatch[]; round: keyof BracketState;
  onPick: (team: Team, idx: number) => void;
  onTeamInfo: (t: Team) => void; onStadiumInfo: (n: string) => void;
  getLiveScore: (match: BracketMatch) => LiveScore | undefined;
}) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!visible) {
    return (
      <div ref={sentinelRef} className="space-y-3">
        {matches.map((_, idx) => (
          <div key={idx} className="h-32 bg-dark-border/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match, idx) => (
        <MobileMatchCard key={match.id} match={match} round={round} matchIndex={idx}
          onPick={(team) => onPick(team, idx)}
          onTeamInfo={onTeamInfo} onStadiumInfo={onStadiumInfo}
          liveScore={getLiveScore(match)} />
      ))}
    </div>
  );
});

/* ─── Bottom Sheet ─────────────────────────────────────────── */

function BottomSheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-0 left-0 right-0 bg-dark-surface rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-slide-up"
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
          <Link href={`/teams/${team.id}`} className="text-lg font-semibold text-dark-text-primary hover:text-dark-accent transition-colors">{team.name}</Link>
          <p className="text-xs text-dark-text-muted">FIFA Ranking #{team.rank}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box"><div className="stat-num">{team.rating}</div><div className="stat-lbl">Rating</div></div>
        <div className="stat-box"><div className="stat-num">{team.titles}</div><div className="stat-lbl">Titles</div></div>
        <div className="stat-box"><div className="stat-num">{team.finals}</div><div className="stat-lbl">Finals</div></div>
      </div>
      <div className="space-y-1.5 text-sm text-dark-text-muted mb-5">
        <p><span className="font-medium text-dark-text-primary">Coach:</span> {team.coach}</p>
        <p><span className="font-medium text-dark-text-primary">Style:</span> {team.style}</p>
        <p><span className="font-medium text-dark-text-primary">Best result:</span> {team.bestResult}</p>
      </div>
      {team.facts.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-dark-text-muted mb-2">Did you know?</h3>
          <ul className="space-y-2">
            {team.facts.map((fact, i) => (
              <li key={i} className="text-sm text-dark-text-muted leading-relaxed flex gap-2">
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
        <h2 className="text-lg font-semibold text-dark-text-primary">{stadium.name}</h2>
        <p className="text-xs text-dark-text-muted">{stadium.city}, {stadium.country}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box"><div className="stat-num text-base">{(stadium.capacity / 1000).toFixed(0)}k</div><div className="stat-lbl">Capacity</div></div>
        <div className="stat-box"><div className="stat-num text-base">{stadium.opened}</div><div className="stat-lbl">Opened</div></div>
        <div className="stat-box"><div className="stat-num text-base">{stadium.cost.replace('$', '').split(' ')[0]}</div><div className="stat-lbl">Cost</div></div>
      </div>
      <div className="space-y-1.5 text-sm text-dark-text-muted mb-5">
        <p><span className="font-medium text-dark-text-primary">Surface:</span> {stadium.surface}</p>
        <p><span className="font-medium text-dark-text-primary">Hosting:</span> {stadium.host}</p>
      </div>
      {stadium.facts.length > 0 && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-widest text-dark-text-muted mb-2">Did you know?</h3>
          <ul className="space-y-2">
            {stadium.facts.map((fact, i) => (
              <li key={i} className="text-sm text-dark-text-muted leading-relaxed flex gap-2">
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
    <Link href={`/teams/${team.id}`} className="block rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-800/50 p-5 text-center mb-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-amber-600 mb-1">World Cup 2026 Champion</p>
      <div className="text-4xl mb-1">{team.flag}</div>
      <h2 className="text-xl font-semibold text-dark-text-primary">{team.name}</h2>
      <p className="text-sm text-amber-700 mt-0.5 italic">brings it home.</p>
    </Link>
  );
}

/* ─── Enlarged View Wrapper ────────────────────────────────── */

const EnlargedBracketView = memo(function EnlargedBracketView({
  bracket, onPick, onTeamInfo,
}: {
  bracket: BracketState;
  onPick: (round: keyof BracketState, idx: number, team: Team) => void;
  onTeamInfo: (t: Team) => void;
}) {
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [activeTab, setActiveTab] = useState<keyof BracketState>('r32');
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollPosRef.current = el.scrollLeft;
      if (el.scrollLeft > 150) setShowScrollHint(false);
      const positions = ROUND_LABEL_CENTERS;
      let closestIdx = 0;
      let closestDist = Infinity;
      for (let i = 0; i < positions.length; i++) {
        const dist = Math.abs(el.scrollLeft + el.clientWidth / 2 - positions[i]);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      }
      setActiveTab(ROUNDS[closestIdx]);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = useCallback((round: keyof BracketState) => {
    const idx = ROUNDS.indexOf(round);
    const el = scrollRef.current;
    if (!el || idx < 0) return;
    const targetX = Math.max(0, ROUND_LABEL_CENTERS[idx] - el.clientWidth / 2);
    el.scrollTo({ left: targetX, behavior: 'smooth' });
    setActiveTab(round);
  }, []);

  const handlePick = useCallback((round: keyof BracketState, idx: number, team: Team) => {
    const savedPos = scrollRef.current?.scrollLeft ?? 0;
    onPick(round, idx, team);
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollLeft = savedPos;
    });
  }, [onPick]);

  return (
    <div className="relative -mx-4">
      {/* Round selector tab bar */}
      <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-none">
        {ROUND_NAV.map(r => {
          const isActive = r.key === activeTab;
          const matches = bracket[r.key];
          const decided = matches.filter(m => m.winner).length;
          const allDone = decided === matches.length && matches.length > 0;
          return (
            <button key={r.key} type="button" onClick={() => handleTabClick(r.key)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95
                ${isActive ? 'bg-dark-accent text-dark-bg shadow-sm'
                  : allDone ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                  : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
              `}>
              {r.label}
              {allDone && !isActive && (
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Bracket horizontal scroll — page scroll passes through vertically */}
      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-visible px-4 pb-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
          overscrollBehaviorX: 'contain',
        }}
      >
        <div
          className={`min-w-[900px] will-change-transform ${isTransitioning ? '[&_*:not(button):not(a)]:pointer-events-none' : ''}`}
        >
          <div className="sticky top-0 z-10 bg-dark-surface/90 backdrop-blur-sm border-b border-dark-border mb-3 py-2">
            <div className="relative h-5">
              {ROUND_NAV.map((r, i) => (
                <span key={r.key}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest text-dark-text-muted whitespace-nowrap"
                  style={{ left: ROUND_LABEL_CENTERS[i] }}>
                  {r.full}
                </span>
              ))}
            </div>
          </div>
          <BracketTree round="final" matchIndex={0} bracket={bracket}
            onPick={handlePick} onTeamInfo={onTeamInfo} />
        </div>
      </div>
      {showScrollHint && (
        <div className="absolute top-12 right-0 bottom-0 w-16 pointer-events-none flex items-center justify-end pr-2"
          style={{ background: 'linear-gradient(to right, transparent, rgba(10,14,26,0.6))' }}>
          <span className="text-white/70 text-xs font-medium animate-pulse">→</span>
        </div>
      )}
    </div>
  );
});

/* ─── Inner Bracket (hydration-aware) ─────────────────────── */

function BracketInner() {
  const bracket = useBracketStore(state => state.bracket);
  const { pickWinner, resetBracket, getBracketShareUrl, loadBracketFromUrl } = useBracketActions();
  const { matches: liveMatches, hasLiveMatches, isMock } = useLiveMatches();
  const [activeRound, setActiveRound] = useState<keyof BracketState>('r32');
  const [viewMode, setViewMode] = useState<'list' | 'bracket'>('list');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [toast, setToast] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [milestoneMsg, setMilestoneMsg] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const prevDecidedRef = useRef<number | null>(null);

  const liveScoreMap = useMemo(() => {
    const map = new Map<string, LiveScore>();
    for (const m of liveMatches) {
      const homeId = (m as Match & { homeTeam: { id: string } }).homeTeam?.id;
      const awayId = (m as Match & { awayTeam: { id: string } }).awayTeam?.id;
      if (!homeId || !awayId) continue;

      const finished = isMatchFinished(m.status);
      let winnerId: string | undefined;
      if (finished && m.homeScore !== null && m.awayScore !== null) {
        if (m.homeScore > m.awayScore) winnerId = homeId;
        else if (m.awayScore > m.homeScore) winnerId = awayId;
      }

      const key = `${homeId}-${awayId}`;
      map.set(key, {
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        status: m.status as MatchStatus,
        minute: m.minute,
        winnerId,
      });
    }
    return map;
  }, [liveMatches]);

  const getLiveScore = useCallback((match: BracketMatch): LiveScore | undefined => {
    if (!match.teamA || !match.teamB) return undefined;
    return liveScoreMap.get(`${match.teamA.id}-${match.teamB.id}`)
      ?? liveScoreMap.get(`${match.teamB.id}-${match.teamA.id}`);
  }, [liveScoreMap]);

  const totalMatches = ROUNDS.reduce((sum, r) => sum + bracket[r].length, 0);
  const decidedMatches = ROUNDS.reduce((sum, r) => sum + bracket[r].filter(m => m.winner).length, 0);
  const pct = totalMatches > 0 ? (decidedMatches / totalMatches) * 100 : 0;

  useEffect(() => {
    useBracketStore.persist.rehydrate();
    setHydrated(true);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('b');
      if (encoded) {
        loadBracketFromUrl(encoded);
        window.history.replaceState({}, '', '/bracket');
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return;
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

  useEffect(() => {
    if (!hydrated || prevDecidedRef.current === null) {
      prevDecidedRef.current = decidedMatches;
      return;
    }
    const prev = prevDecidedRef.current;
    prevDecidedRef.current = decidedMatches;
    if (decidedMatches >= 16 && prev < 16) {
      setMilestoneMsg('Round of 16 complete \u{1F525}');
      setTimeout(() => setMilestoneMsg(''), 3500);
    } else if (decidedMatches >= 24 && prev < 24) {
      setMilestoneMsg('Quarter-finals locked in');
      setTimeout(() => setMilestoneMsg(''), 3500);
    } else if (decidedMatches >= totalMatches && prev < totalMatches && totalMatches > 0) {
      setMilestoneMsg('Your champion is chosen \u{1F3C6}');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setMilestoneMsg(''), 4000);
    }
  }, [hydrated, decidedMatches, totalMatches]);

  // "I Called It" detection: check bracket picks against finished live matches
  const [calledItMoment, setCalledItMoment] = useState<import('@/types').CalledItMoment | null>(null);
  const detectedMomentsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;
    const ROUNDS_TO_CHECK: (keyof BracketState)[] = ['r32', 'r16', 'qf', 'sf', 'final'];

    for (const round of ROUNDS_TO_CHECK) {
      for (const match of bracket[round]) {
        if (!match.winner || !match.teamA || !match.teamB) continue;
        if (detectedMomentsRef.current.has(match.id)) continue;

        const liveScore = getLiveScore(match);
        if (!liveScore?.winnerId) continue;

        const moment = detectCalledIt(match, liveScore.winnerId);
        if (moment) {
          detectedMomentsRef.current.add(match.id);
          saveCalledItMoment(moment);
          setCalledItMoment(moment);
        }
      }
    }
  }, [hydrated, liveScoreMap, bracket, getLiveScore]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('list');
    }
  }, []);

  const handleTeamInfo = useCallback((team: Team) => {
    setSelectedTeam(team);
  }, []);

  const handlePickForRound = useCallback((team: Team, idx: number) => {
    pickWinner(activeRound, idx, team);
  }, [pickWinner, activeRound]);

  const handlePickDirect = useCallback((round: keyof BracketState, idx: number, team: Team) => {
    pickWinner(round, idx, team);
  }, [pickWinner]);

  const handleToggleView = useCallback(() => {
    setViewMode(v => v === 'list' ? 'bracket' : 'list');
  }, []);

  if (!hydrated) {
    return <BracketSkeleton />;
  }

  const champion = bracket.final[0]?.winner;

  const activeMatches = bracket[activeRound];
  const activeDecided = activeMatches.filter(m => m.winner).length;
  const roundComplete = activeDecided === activeMatches.length && activeMatches.length > 0;
  const activeIdx = ROUNDS.indexOf(activeRound);
  const nextRound = activeIdx < ROUNDS.length - 1 ? ROUNDS[activeIdx + 1] : null;

  const isLateRound = activeRound === 'qf' || activeRound === 'sf' || activeRound === 'final';

  return (
    <div>
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">Knockout stage</p>
          <h1 className="text-xl font-semibold text-dark-text-primary">Build your bracket</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={handleToggleView}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-dark-border rounded-full bg-dark-surface text-dark-text-muted transition-all hover:bg-dark-border/30 hover:border-gray-300 active:scale-95">
            {viewMode === 'list' ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Expand bracket
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
                List view
              </>
            )}
          </button>
          <button type="button" onClick={handleShare} className="btn text-xs px-3 py-1.5">Share</button>
          <button type="button" onClick={resetBracket} className="btn text-xs px-3 py-1.5">Reset</button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-dark-text-muted tabular-nums">
            {decidedMatches} of {totalMatches} matches predicted
          </span>
          {milestoneMsg && (
            <span className="text-xs font-semibold text-amber-600 animate-milestone-pop">{milestoneMsg}</span>
          )}
        </div>
        <div className="w-full h-2.5 bg-dark-border rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }} />
        </div>
      </div>
      {showConfetti && <ConfettiBurst />}

      {champion && <ChampionBanner team={champion} />}

      {/* Live results banner */}
      {hasLiveMatches && !isMock && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-900/20 border border-blue-800/50 mb-4">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-dark-accent" />
          </span>
          <p className="text-xs text-dark-accent font-medium">
            Real results auto-update · Tap a future match to predict
          </p>
        </div>
      )}

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
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95 will-change-transform
                    ${isActive ? 'bg-gray-900 text-white shadow-sm'
                      : allDone ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                      : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
                  `}>
                  {r.label}
                  <span className={`text-[10px] tabular-nums ${isActive ? 'text-dark-text-muted/50' : allDone ? 'text-green-500' : 'text-dark-text-muted'}`}>
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
            <h2 className="text-sm font-semibold text-dark-text-primary">{ROUND_NAV.find(r => r.key === activeRound)?.full}</h2>
            <span className="text-xs text-dark-text-muted">{activeDecided} of {activeMatches.length} decided</span>
          </div>

          <p className="text-xs text-dark-text-muted mb-3">Tap a team name to advance them. Tap a flag for info.</p>

          {isLateRound ? (
            <LazyRoundMatches
              matches={activeMatches}
              round={activeRound}
              onPick={handlePickForRound}
              onTeamInfo={handleTeamInfo}
              onStadiumInfo={handleStadiumClick}
              getLiveScore={getLiveScore}
            />
          ) : (
            <div className="space-y-3">
              {activeMatches.map((match, idx) => (
                <MobileMatchCard key={match.id} match={match} round={activeRound} matchIndex={idx}
                  onPick={(team) => pickWinner(activeRound, idx, team)}
                  onTeamInfo={handleTeamInfo} onStadiumInfo={handleStadiumClick}
                  liveScore={getLiveScore(match)} />
              ))}
            </div>
          )}

          {roundComplete && nextRound && (
            <div className="mt-4 p-4 rounded-xl bg-green-900/20 border border-green-800/50 text-center">
              <p className="text-sm font-medium text-green-400 mb-2">All matches decided.</p>
              <button type="button" onClick={() => setActiveRound(nextRound)} className="btn-primary text-sm px-5 py-2">
                Continue to {ROUND_NAV.find(r => r.key === nextRound)?.full}
              </button>
            </div>
          )}
        </>
      ) : (
        <EnlargedBracketView
          bracket={bracket}
          onPick={handlePickDirect}
          onTeamInfo={handleTeamInfo}
        />
      )}

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
      {calledItMoment && (
        <ICalledItCard moment={calledItMoment} onClose={() => setCalledItMoment(null)} />
      )}
    </div>
  );
}

/* ─── Main Export (wrapped in error boundary) ─────────────── */

export default function BracketSimulator() {
  return (
    <BracketErrorBoundary>
      <MyMoments />
      <BracketInner />
    </BracketErrorBoundary>
  );
}
