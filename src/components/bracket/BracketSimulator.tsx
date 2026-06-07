'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useBracketStore } from '@/lib/store';
import { STADIUMS } from '@/lib/data';
import type { Team, BracketMatch, BracketState, Stadium } from '@/types';

const ROUND_LABELS: Record<keyof BracketState, string> = {
  r32: 'R32',
  r16: 'R16',
  qf: 'QF',
  sf: 'Semi',
  final: 'Final',
};

const ROUND_FULL: Record<keyof BracketState, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarterfinals',
  sf: 'Semifinals',
  final: 'Final',
};

const ROUNDS: (keyof BracketState)[] = ['r32', 'r16', 'qf', 'sf', 'final'];

/* ─── Match Card ────────────────────────────────────────────── */

const MatchCard = memo(function MatchCard({
  match,
  matchNum,
  round,
  onPick,
  onTeamInfo,
  onStadiumInfo,
}: {
  match: BracketMatch;
  matchNum: number;
  round: keyof BracketState;
  onPick: (team: Team) => void;
  onTeamInfo: (team: Team) => void;
  onStadiumInfo: (name: string) => void;
}) {
  const canPick = !!(match.teamA && match.teamB);
  const isFinal = round === 'final';

  function TeamRow({ team, isWinner }: { team: Team | null; isWinner: boolean }) {
    if (!team) {
      return (
        <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
          <span className="text-lg w-7 text-center">—</span>
          <span className="text-sm">Waiting for result</span>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center gap-3 px-4 py-3 transition-colors active:bg-gray-100
          ${isWinner ? 'bg-blue-50' : ''}
          ${canPick ? 'cursor-pointer' : ''}
        `}
        onClick={() => canPick && onPick(team)}
      >
        <button
          type="button"
          className="text-xl w-7 text-center shrink-0 active:scale-110 transition-transform"
          onClick={(e) => { e.stopPropagation(); onTeamInfo(team); }}
          aria-label={`Info about ${team.name}`}
        >
          {team.flag}
        </button>
        <span className={`flex-1 text-sm truncate ${isWinner ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {team.name}
        </span>
        {isWinner && (
          <span className="badge-blue text-[10px] px-1.5 py-0.5 rounded-full font-semibold">ADV</span>
        )}
        <span className="text-xs text-gray-400 tabular-nums font-medium">{team.rating}</span>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden shadow-sm
        ${match.winner ? 'border-blue-200' : 'border-gray-200'}
        ${isFinal ? 'ring-2 ring-amber-300' : ''}
      `}
    >
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-50 border-b border-gray-100">
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
          Match {matchNum}
        </span>
        <button
          type="button"
          className="text-[10px] text-gray-400 active:text-gray-600 transition-colors truncate max-w-[60%] text-right"
          onClick={() => onStadiumInfo(match.stadium)}
          aria-label={`About ${match.stadium}`}
        >
          {match.stadium}
        </button>
      </div>
      <TeamRow team={match.teamA} isWinner={match.winner?.id === match.teamA?.id} />
      <div className="border-t border-gray-100 mx-4" />
      <TeamRow team={match.teamB} isWinner={match.winner?.id === match.teamB?.id} />
    </div>
  );
});

/* ─── Round Pill Selector ───────────────────────────────────── */

function RoundPills({
  activeRound,
  bracket,
  onSelect,
}: {
  activeRound: keyof BracketState;
  bracket: BracketState;
  onSelect: (round: keyof BracketState) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
      {ROUNDS.map((round) => {
        const matches = bracket[round];
        const decided = matches.filter((m) => m.winner).length;
        const total = matches.length;
        const isActive = round === activeRound;
        const allDone = decided === total && total > 0;

        return (
          <button
            key={round}
            type="button"
            onClick={() => onSelect(round)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all active:scale-95
              ${isActive
                ? 'bg-gray-900 text-white shadow-sm'
                : allDone
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-white text-gray-500 border border-gray-200'}
            `}
            aria-label={`${ROUND_FULL[round]}: ${decided} of ${total} decided`}
          >
            {ROUND_LABELS[round]}
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
  );
}

/* ─── Progress Bar ──────────────────────────────────────────── */

function ProgressBar({ decided, total }: { decided: number; total: number }) {
  const pct = total > 0 ? (decided / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-600"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Bottom Sheet (mobile-native info panel) ───────────────── */

function BottomSheet({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Team Info Content ─────────────────────────────────────── */

function TeamInfoContent({ team }: { team: Team }) {
  return (
    <div className="px-5 pb-8">
      <div className="flex items-center gap-3 mb-4 pt-2">
        <span className="text-3xl">{team.flag}</span>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{team.name}</h2>
          <p className="text-xs text-gray-400">FIFA Ranking #{team.rank}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box">
          <div className="stat-num">{team.rating}</div>
          <div className="stat-lbl">Rating</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{team.titles}</div>
          <div className="stat-lbl">Titles</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{team.finals}</div>
          <div className="stat-lbl">Finals</div>
        </div>
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
                <span className="text-blue-400 font-bold shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Stadium Info Content ──────────────────────────────────── */

function StadiumInfoContent({ stadium }: { stadium: Stadium }) {
  return (
    <div className="px-5 pb-8">
      <div className="pt-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{stadium.name}</h2>
        <p className="text-xs text-gray-400">{stadium.city}, {stadium.country}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="stat-box">
          <div className="stat-num text-base">{(stadium.capacity / 1000).toFixed(0)}k</div>
          <div className="stat-lbl">Capacity</div>
        </div>
        <div className="stat-box">
          <div className="stat-num text-base">{stadium.opened}</div>
          <div className="stat-lbl">Opened</div>
        </div>
        <div className="stat-box">
          <div className="stat-num text-base">{stadium.cost.replace('$', '').split(' ')[0]}</div>
          <div className="stat-lbl">Cost</div>
        </div>
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
                <span className="text-green-500 font-bold shrink-0">•</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Champion Banner ───────────────────────────────────────── */

function ChampionBanner({ team }: { team: Team }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200 p-5 text-center mb-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-amber-600 mb-1">
        World Cup 2026 Champion
      </p>
      <div className="text-4xl mb-1">{team.flag}</div>
      <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
      <p className="text-sm text-amber-700 mt-0.5 italic">brings it home.</p>
    </div>
  );
}

/* ─── Next Round Prompt ─────────────────────────────────────── */

function NextRoundPrompt({ nextRound, onAdvance }: { nextRound: keyof BracketState; onAdvance: () => void }) {
  return (
    <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-center">
      <p className="text-sm font-medium text-green-800 mb-2">All matches decided.</p>
      <button
        type="button"
        onClick={onAdvance}
        className="btn-primary text-sm px-5 py-2"
      >
        Continue to {ROUND_FULL[nextRound]}
      </button>
    </div>
  );
}

/* ─── Main BracketSimulator ─────────────────────────────────── */

export default function BracketSimulator() {
  const { bracket, pickWinner, resetBracket, getBracketShareUrl, loadBracketFromUrl } = useBracketStore();
  const [activeRound, setActiveRound] = useState<keyof BracketState>('r32');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [shareMsg, setShareMsg] = useState('');
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
        setShareMsg('Copied!');
        setTimeout(() => setShareMsg(''), 2000);
      }
    } catch {
      try {
        const url = getBracketShareUrl();
        await navigator.clipboard.writeText(url);
        setShareMsg('Copied!');
      } catch {
        setShareMsg('Failed');
      }
      setTimeout(() => setShareMsg(''), 2000);
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const champion = bracket.final[0]?.winner;
  const totalMatches = ROUNDS.reduce((sum, r) => sum + bracket[r].length, 0);
  const decidedMatches = ROUNDS.reduce(
    (sum, r) => sum + bracket[r].filter((m) => m.winner).length,
    0,
  );

  const activeMatches = bracket[activeRound];
  const activeDecided = activeMatches.filter((m) => m.winner).length;
  const roundComplete = activeDecided === activeMatches.length && activeMatches.length > 0;
  const activeIdx = ROUNDS.indexOf(activeRound);
  const nextRound = activeIdx < ROUNDS.length - 1 ? ROUNDS[activeIdx + 1] : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">
            Knockout stage
          </p>
          <h1 className="text-xl font-semibold text-gray-900">Build your bracket</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="btn text-xs px-3 py-1.5"
            aria-label="Share bracket"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            {shareMsg || 'Share'}
          </button>
          <button
            type="button"
            onClick={resetBracket}
            className="btn text-xs px-3 py-1.5"
            aria-label="Reset bracket"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.016 4.66v4.993" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="flex items-center gap-2 mb-4">
        <ProgressBar decided={decidedMatches} total={totalMatches} />
        <span className="text-[10px] text-gray-400 tabular-nums shrink-0 font-medium">
          {decidedMatches}/{totalMatches}
        </span>
      </div>

      {/* Champion banner */}
      {champion && <ChampionBanner team={champion} />}

      {/* Round selector pills */}
      <div className="mb-4">
        <RoundPills activeRound={activeRound} bracket={bracket} onSelect={setActiveRound} />
      </div>

      {/* Active round heading */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">{ROUND_FULL[activeRound]}</h2>
        <span className="text-xs text-gray-400">
          {activeDecided} of {activeMatches.length} decided
        </span>
      </div>

      {/* Instruction */}
      <p className="text-xs text-gray-400 mb-3">
        Tap a team to advance them. Tap a flag for team info.
      </p>

      {/* Match cards for active round */}
      <div className="space-y-3">
        {activeMatches.map((match, idx) => (
          <MatchCard
            key={match.id}
            match={match}
            matchNum={idx + 1}
            round={activeRound}
            onPick={(team) => pickWinner(activeRound, idx, team)}
            onTeamInfo={setSelectedTeam}
            onStadiumInfo={handleStadiumClick}
          />
        ))}
      </div>

      {/* Next round prompt */}
      {roundComplete && nextRound && (
        <NextRoundPrompt nextRound={nextRound} onAdvance={() => setActiveRound(nextRound)} />
      )}

      {/* Info panels (bottom sheet) */}
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
