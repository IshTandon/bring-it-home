'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TIMELINE_DAYS, TEAMS } from '@/lib/data';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { TimelineDay } from '@/types';

const TOURNAMENT_START = new Date('2026-06-12T00:00:00');
const BANNER_DISMISSED_KEY = 'timeline-banner-dismissed';

function teamIdByName(name: string): string | null {
  const t = TEAMS.find(t => t.name === name);
  return t ? t.id : null;
}

function TeamLink({ name, flag, className }: { name: string; flag?: string; className?: string }) {
  const id = teamIdByName(name);
  const content = flag ? <><span>{flag}</span> {name}</> : name;
  if (!id) return <span className={className}>{content}</span>;
  return <Link href={`/teams/${id}`} className={`${className} hover:text-dark-accent transition-colors`}>{content}</Link>;
}

function DummyDataBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(BANNER_DISMISSED_KEY);
    setDismissed(stored === 'true');
  }, []);

  if (dismissed || new Date() >= TOURNAMENT_START) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  };

  return (
    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-900/20 border border-dark-accent/50 mb-4">
      <span className="shrink-0 text-sm leading-none mt-0.5">⚠</span>
      <p className="flex-1 text-xs text-dark-accent font-medium leading-relaxed">
        Preview mode — showing illustrative data. Live content updates from June 12, 2026.
      </p>
      <button type="button" onClick={handleDismiss}
        className="shrink-0 text-dark-accent hover:text-amber-300 transition-colors ml-1"
        aria-label="Dismiss banner">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function FutureDayOverlay({ day }: { day: TimelineDay }) {
  const isFuture = day.future || new Date() < TOURNAMENT_START;
  if (!isFuture) return null;

  const label = day.date ? `Unlocks ${day.date}` : 'Unlocks June 12';

  return (
    <div className="absolute inset-0 z-10 rounded-xl flex items-center justify-center"
      style={{ backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', background: 'rgba(10,14,26,0.4)' }}>
      <div className="bg-dark-surface border border-dark-border rounded-full shadow-sm px-3 py-1.5 flex flex-col items-center gap-0.5">
        <span className="text-xs font-semibold text-dark-text-primary flex items-center gap-1">
          🔒 {label}
        </span>
        <span className="text-[10px] text-dark-text-muted">Dummy data — for illustration only</span>
      </div>
    </div>
  );
}

const VOTE_STORAGE_KEY = 'timeline-votes';

function getStoredVotes(): Record<string, Record<string, number>> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function setStoredVotes(votes: Record<string, Record<string, number>>) {
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
}

function DayRail({
  days,
  activeId,
  onSelect,
}: {
  days: TimelineDay[];
  activeId: number;
  onSelect: (id: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const btn = el.querySelector(`[data-day="${activeId}"]`) as HTMLElement | null;
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  return (
    <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
      {days.map((d) => {
        const isActive = d.id === activeId;
        const isFuture = d.future;
        const isUpset = d.upset;

        return (
          <button
            key={d.id}
            data-day={d.id}
            type="button"
            disabled={isFuture}
            onClick={() => !isFuture && onSelect(d.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap
              ${isFuture
                ? 'bg-dark-border/50 text-dark-text-muted/50 cursor-not-allowed'
                : isActive
                  ? isUpset
                    ? 'bg-red-600 text-white ring-2 ring-red-400/30'
                    : 'bg-dark-accent text-dark-bg ring-2 ring-dark-accent/30'
                  : isUpset
                    ? 'bg-red-900/30 text-red-400 border border-red-800/50'
                    : 'bg-dark-surface text-dark-text-muted border border-dark-border'}
            `}
          >
            {d.label}
            {isUpset && !isFuture && <span className="ml-1">🔴</span>}
            {isFuture && <span className="ml-1">🔒</span>}
          </button>
        );
      })}
    </div>
  );
}

function ChapterBanner({ day }: { day: TimelineDay }) {
  return (
    <div className={`rounded-xl p-5 ${day.upset ? 'bg-red-900/20 border border-red-800/50' : 'bg-dark-accent/10 border border-dark-accent/30'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${day.upset ? 'text-red-400' : 'text-dark-accent'}`}>
          {day.tag}
        </span>
        <span className="text-[10px] text-dark-text-muted">{day.date}</span>
      </div>
      <h2 className={`text-lg font-bold leading-snug ${day.upset ? 'text-red-300' : 'text-dark-text-primary'}`}>
        {day.headline}
      </h2>
      <p className="text-sm text-dark-text-muted leading-relaxed mt-3">
        {day.narrative}
      </p>
    </div>
  );
}

function MatchResults({ day }: { day: TimelineDay }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-dark-border bg-dark-border/30">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">Match Results</h3>
      </div>
      <div className="divide-y divide-dark-border/50">
        {day.matches.map((m, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <TeamLink name={m.homeTeam} flag={m.homeFlag} className="flex items-center gap-2 text-sm font-semibold text-dark-text-primary truncate" />
              </div>
              <div className="flex items-center gap-2 px-3 shrink-0">
                <span className={`text-lg font-bold tabular-nums ${!day.future ? (m.homeScore > m.awayScore ? 'text-green-400' : m.homeScore < m.awayScore ? 'text-red-400' : 'text-dark-text-primary') : 'text-dark-text-muted/30'}`}>
                  {day.future ? '-' : m.homeScore}
                </span>
                <span className="text-dark-text-muted text-sm">:</span>
                <span className={`text-lg font-bold tabular-nums ${!day.future ? (m.awayScore > m.homeScore ? 'text-green-400' : m.awayScore < m.homeScore ? 'text-red-400' : 'text-dark-text-primary') : 'text-dark-text-muted/30'}`}>
                  {day.future ? '-' : m.awayScore}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <TeamLink name={m.awayTeam} flag={m.awayFlag} className="flex items-center gap-2 text-sm font-semibold text-dark-text-primary truncate text-right" />
              </div>
            </div>
            <p className="text-[11px] text-dark-text-muted mt-1 text-center italic">{m.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayerOfDayCard({ day }: { day: TimelineDay }) {
  if (!day.playerOfDay || day.future) return null;
  const p = day.playerOfDay;
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Player of the Day</h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-dark-accent/10 border-2 border-dark-accent/50 flex items-center justify-center text-2xl shrink-0">
          {p.flag}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dark-text-primary">{p.name}</p>
          <TeamLink name={p.team} flag={p.flag} className="text-[11px] text-dark-text-muted" />
          <p className="text-xs font-semibold text-dark-accent mt-0.5">{p.stat}</p>
        </div>
        <div className="text-2xl">⭐</div>
      </div>
    </div>
  );
}

function TournamentContext({ day }: { day: TimelineDay }) {
  const s = day.stats;
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Tournament So Far</h3>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Goals', value: s.goals, emoji: '⚽' },
          { label: 'Upsets', value: s.upsets, emoji: '😱' },
          { label: 'Cards', value: s.cards, emoji: '🟨' },
          { label: 'Pens', value: s.penalties, emoji: '🥅' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl mb-1">{stat.emoji}</div>
            <div className="text-lg font-bold text-dark-text-primary tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-dark-text-muted font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityMood({ day }: { day: TimelineDay }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Community Mood</h3>
      <div className="space-y-3">
        {day.mood.map((m) => (
          <div key={m.team}>
            <div className="flex items-center justify-between mb-1">
              <TeamLink name={m.team} flag={m.flag} className="text-xs font-semibold text-dark-text-primary" />
              <span className="text-[10px] text-dark-text-muted tabular-nums">{m.positive}% positive</span>
            </div>
            <div className="h-2.5 rounded-full bg-dark-border overflow-hidden flex">
              <div
                className="h-full rounded-l-full transition-all duration-500"
                style={{
                  width: `${m.positive}%`,
                  background: m.positive >= 70 ? '#16a34a' : m.positive >= 40 ? '#eab308' : '#dc2626',
                }}
              />
              <div
                className="h-full rounded-r-full bg-red-900/50 transition-all duration-500"
                style={{ width: `${m.negative}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmojiVote({ day }: { day: TimelineDay }) {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const stored = getStoredVotes();
    const dayVotes = stored[String(day.id)];
    if (dayVotes) {
      setVotes(dayVotes);
      setVoted(true);
    } else {
      setVotes({});
      setVoted(false);
    }
  }, [day.id]);

  const handleVote = useCallback((emoji: string) => {
    if (voted || day.future) return;
    const stored = getStoredVotes();
    const dayKey = String(day.id);
    const current = stored[dayKey] || {};
    const updated = { ...current, [emoji]: (current[emoji] || 0) + 1 };
    stored[dayKey] = updated;
    setStoredVotes(stored);
    setVotes(updated);
    setVoted(true);
  }, [voted, day.id, day.future]);

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">
        {day.future ? 'Voting opens after matches' : voted ? 'You voted!' : 'How was today?'}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {day.voteOptions.map((opt) => {
          const localCount = votes[opt.emoji] || 0;
          const totalCount = opt.count + localCount;
          return (
            <button
              key={opt.emoji}
              type="button"
              disabled={voted || day.future}
              onClick={() => handleVote(opt.emoji)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all active:scale-95
                ${voted && localCount > 0
                  ? 'bg-dark-accent/10 border-2 border-dark-accent/50'
                  : day.future
                    ? 'bg-dark-border/30 border border-dark-border opacity-50'
                    : 'bg-dark-border/30 border border-dark-border hover:border-dark-text-muted'}
              `}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[10px] font-medium text-dark-text-muted">{opt.label}</span>
              {!day.future && (
                <span className="text-[10px] font-bold text-dark-text-muted tabular-nums">{totalCount.toLocaleString()}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StreakBar({ day }: { day: TimelineDay }) {
  if (day.future) return null;
  const allPlayed = TIMELINE_DAYS.filter(d => !d.future);
  const idx = allPlayed.findIndex(d => d.id === day.id);
  const progress = ((idx + 1) / TIMELINE_DAYS.length) * 100;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-2">Tournament Progress</h3>
      <div className="h-3 bg-dark-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-dark-accent to-green-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-dark-text-muted font-medium">Day {idx + 1} of {TIMELINE_DAYS.length}</span>
        <span className="text-[10px] text-dark-text-muted font-medium">{Math.round(progress)}% complete</span>
      </div>
    </div>
  );
}

export default function TournamentTimeline() {
  const firstPlayable = TIMELINE_DAYS.find(d => !d.future) || TIMELINE_DAYS[0];
  const lastPlayable = [...TIMELINE_DAYS].reverse().find(d => !d.future) || firstPlayable;
  const [activeId, setActiveId] = useState(lastPlayable.id);
  const { containerRef, getRevealProps } = useScrollReveal<HTMLDivElement>({ staggerDelay: 80 });

  const day = TIMELINE_DAYS.find(d => d.id === activeId) || TIMELINE_DAYS[0];
  const dayIndex = TIMELINE_DAYS.findIndex(d => d.id === activeId);
  const hasPrev = dayIndex > 0;
  const hasNext = dayIndex < TIMELINE_DAYS.length - 1 && !TIMELINE_DAYS[dayIndex + 1].future;

  const handleShare = useCallback(async () => {
    const text = `${day.headline}\n\n${day.narrative}\n\n🏆 Bring It Home — World Cup 2026`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `WC 2026 — ${day.label}`, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  }, [day]);

  return (
    <div>
      <div className="mb-4">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">The story so far</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Tournament Timeline</h1>
        <p className="text-xs text-dark-text-muted mt-0.5">Every day is a chapter. Tap through the story of the World Cup.</p>
      </div>

      <DummyDataBanner />
      <DayRail days={TIMELINE_DAYS} activeId={activeId} onSelect={setActiveId} />

      <div ref={containerRef} className="mt-4 space-y-3 relative">
        <FutureDayOverlay day={day} />
        <div {...getRevealProps(0)}><ChapterBanner day={day} /></div>
        <div {...getRevealProps(1)}><MatchResults day={day} /></div>
        <div {...getRevealProps(2)}><PlayerOfDayCard day={day} /></div>
        <div {...getRevealProps(3)}><TournamentContext day={day} /></div>
        <div {...getRevealProps(4)}><CommunityMood day={day} /></div>
        <div {...getRevealProps(5)}><EmojiVote day={day} /></div>
        <div {...getRevealProps(6)}><StreakBar day={day} /></div>
      </div>

      <div className="flex items-center gap-3 mt-4 pb-2">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => hasPrev && setActiveId(TIMELINE_DAYS[dayIndex - 1].id)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95
            ${hasPrev ? 'bg-dark-surface border border-dark-border text-dark-text-primary' : 'bg-dark-border/30 text-dark-text-muted/50 cursor-not-allowed'}
          `}
        >
          ← Prev
        </button>

        {!day.future && (
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-dark-accent text-dark-bg transition-all active:scale-95 shrink-0"
          >
            Share today&apos;s story
          </button>
        )}

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => hasNext && setActiveId(TIMELINE_DAYS[dayIndex + 1].id)}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95
            ${hasNext ? 'bg-dark-surface border border-dark-border text-dark-text-primary' : 'bg-dark-border/30 text-dark-text-muted/50 cursor-not-allowed'}
          `}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
