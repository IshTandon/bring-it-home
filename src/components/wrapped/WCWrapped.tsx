'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePredictionStore } from '@/lib/store';
import { useBracketStore } from '@/lib/store';

/* ─── Phase logic ─────────────────────────────────────────── */

const TOURNAMENT_START = new Date('2026-06-12T00:00:00');
const TOURNAMENT_END = new Date('2026-07-19T23:59:59');

type Phase = 'pre' | 'live' | 'post';

function getPhase(): Phase {
  const now = new Date();
  if (now < TOURNAMENT_START) return 'pre';
  if (now <= TOURNAMENT_END) return 'live';
  return 'post';
}

function getMatchday(): number {
  const now = new Date();
  const diff = now.getTime() - TOURNAMENT_START.getTime();
  return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}

function getDaysUntil(): number {
  const now = new Date();
  return Math.max(0, Math.ceil((TOURNAMENT_START.getTime() - now.getTime()) / 86_400_000));
}

/* ─── Historical moments data ─────────────────────────────── */

const MOMENTS = [
  {
    year: 1986, host: 'Mexico', headline: 'The Hand of God',
    story: 'Maradona punched the ball in with his fist, then scored the Goal of the Century four minutes later. England never forgave him.',
    gradient: 'from-sky-400 to-blue-600', flag: '🇦🇷', teams: ['🇦🇷', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'],
  },
  {
    year: 1950, host: 'Brazil', headline: 'The Maracanazo',
    story: 'Uruguay beat Brazil 2-1 in front of 200,000 fans in Rio. Brazil had already printed the trophy. Uruguay had other ideas.',
    gradient: 'from-yellow-400 to-green-600', flag: '🇺🇾', teams: ['🇺🇾', '🇧🇷'],
  },
  {
    year: 2022, host: 'Qatar', headline: 'The Final that had everything',
    story: 'Argentina 3-3 France after extra time. Mbappé hat-trick. Messi\'s redemption. The most watched sporting event in human history.',
    gradient: 'from-sky-300 to-blue-700', flag: '🇦🇷', teams: ['🇦🇷', '🇫🇷'],
  },
  {
    year: 1966, host: 'England', headline: 'It\'s coming home (for the only time)',
    story: 'England beat West Germany 4-2. Geoff Hurst\'s controversial third goal. The only time England have won it.',
    gradient: 'from-red-500 to-blue-700', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', teams: ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🇩🇪'],
  },
  {
    year: 2002, host: 'Korea/Japan', headline: 'Ronaldo\'s redemption',
    story: 'R9 scored twice in the final after his mysterious collapse in 1998. Brazil\'s fifth title. The greatest striker of his generation, vindicated.',
    gradient: 'from-yellow-400 to-green-500', flag: '🇧🇷', teams: ['🇧🇷', '🇩🇪'],
  },
  {
    year: 2014, host: 'Brazil', headline: 'The Mineirazo',
    story: 'Germany 7-1 Brazil. On home soil. In a semi-final. The most shocking result in World Cup history.',
    gradient: 'from-yellow-300 to-green-600', flag: '🇩🇪', teams: ['🇩🇪', '🇧🇷'],
  },
  {
    year: 1970, host: 'Mexico', headline: 'The Beautiful Game',
    story: 'Brazil vs Italy final. Pelé, Jairzinho, Tostão. Considered the greatest team to ever play the game.',
    gradient: 'from-yellow-400 to-green-500', flag: '🇧🇷', teams: ['🇧🇷', '🇮🇹'],
  },
  {
    year: 2010, host: 'South Africa', headline: 'Iniesta\'s moment',
    story: 'Spain vs Netherlands. 116th minute. Andrés Iniesta. The only Spaniard to score a World Cup winning goal — in the last minute of extra time.',
    gradient: 'from-red-500 to-yellow-500', flag: '🇪🇸', teams: ['🇪🇸', '🇳🇱'],
  },
];

/* ─── Winners timeline data ───────────────────────────────── */

const WINNERS = [
  { year: 2022, flag: '🇦🇷', winner: 'Argentina', opponent: 'France', score: '4-2 (pens)', badge: 'Defending champions' },
  { year: 2018, flag: '🇫🇷', winner: 'France', opponent: 'Croatia', score: '4-2', badge: null },
  { year: 2014, flag: '🇩🇪', winner: 'Germany', opponent: 'Argentina', score: '1-0 (AET)', badge: null },
  { year: 2010, flag: '🇪🇸', winner: 'Spain', opponent: 'Netherlands', score: '1-0 (AET)', badge: null },
  { year: 2006, flag: '🇮🇹', winner: 'Italy', opponent: 'France', score: '5-3 (pens)', badge: null },
  { year: 2002, flag: '🇧🇷', winner: 'Brazil', opponent: 'Germany', score: '2-0', badge: null },
  { year: 1998, flag: '🇫🇷', winner: 'France', opponent: 'Brazil', score: '3-0', badge: null },
  { year: 1994, flag: '🇧🇷', winner: 'Brazil', opponent: 'Italy', score: '3-2 (pens)', badge: null },
  { year: 1990, flag: '🇩🇪', winner: 'Germany', opponent: 'Argentina', score: '1-0', badge: null },
  { year: 1986, flag: '🇦🇷', winner: 'Argentina', opponent: 'Germany', score: '3-2', badge: null },
];

/* ─── Countdown timer ─────────────────────────────────────── */

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, TOURNAMENT_START.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A1628] px-4 py-10 mb-8">
      {/* Animated concentric circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[120, 200, 280, 360].map((size, i) => (
          <div key={i}
            className="absolute rounded-full border border-white/5 animate-pulse"
            style={{ width: size, height: size, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 text-center mb-6">
          Kickoff countdown
        </p>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6">
          {blocks.map(b => (
            <div key={b.label} className="text-center">
              <span className="block text-4xl sm:text-5xl font-semibold text-white tabular-nums leading-none">
                {String(b.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 mt-2 block">
                {b.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/30 text-center">
          USA · Canada · Mexico · 48 teams · 104 matches
        </p>
      </div>
    </div>
  );
}

/* ─── Moments carousel ────────────────────────────────────── */

function MomentsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % MOMENTS.length;
        scrollRef.current?.children[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        return next;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAuto]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.children[0]?.clientWidth ?? 300;
    const idx = Math.round(el.scrollLeft / (cardWidth + 12));
    setActiveIdx(Math.min(idx, MOMENTS.length - 1));
  }, []);

  const handleTouch = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(startAuto, 10000);
  }, [startAuto]);

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-dark-text-primary mb-1">While you wait</h2>
      <p className="text-xs text-dark-text-muted mb-4">The moments that made the tournament.</p>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
        onScroll={handleScroll}
        onTouchStart={handleTouch}
      >
        {MOMENTS.map((m, i) => (
          <div key={i} className="snap-center shrink-0 w-[90vw] max-w-[380px] rounded-xl overflow-hidden border border-dark-border shadow-sm bg-dark-surface">
            <div className={`bg-gradient-to-br ${m.gradient} h-36 flex items-center justify-center relative`}>
              <span className="text-7xl">{m.flag}</span>
              <span className="absolute bottom-2 right-3 text-white/30 text-xs font-bold">{m.year}</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-dark-text-muted font-medium">{m.year} · {m.host}</span>
              </div>
              <h3 className="text-sm font-bold text-dark-text-primary mb-1.5">{m.headline}</h3>
              <p className="text-xs text-dark-text-muted leading-relaxed mb-3">{m.story}</p>
              <div className="flex gap-1.5">
                {m.teams.map((t, j) => (
                  <span key={j} className="text-base">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {MOMENTS.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'w-4 bg-dark-accent' : 'w-1.5 skeleton'}`} />
        ))}
      </div>
    </div>
  );
}

/* ─── Fast facts grid ─────────────────────────────────────── */

const FACTS = [
  { big: '48', label: 'teams', detail: 'First WC with 48 nations. 16 more than 2022.' },
  { big: '104', label: 'matches', detail: 'Across 3 nations and 16 stadiums.' },
  { big: '3', label: 'host nations', detail: 'USA, Canada, Mexico. A first in WC history.' },
  { big: '16', label: 'stadiums', detail: 'From Vancouver to Mexico City.' },
  { big: '39', label: 'days', detail: 'Longest WC tournament ever.' },
  { big: '🏟️ 87,523', label: 'Estadio Azteca', detail: 'Largest venue. Has hosted 2 WC finals.' },
];

function FastFacts() {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-dark-text-primary mb-1">Know before you go</h2>
      <p className="text-xs text-dark-text-muted mb-4">WC 2026 in numbers.</p>
      <div className="grid grid-cols-2 gap-3">
        {FACTS.map((f, i) => (
          <div key={i} className="bg-dark-surface border border-dark-border rounded-xl p-3.5">
            <span className="text-2xl font-bold text-dark-text-primary block leading-none mb-1">{f.big}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-dark-accent block mb-1">{f.label}</span>
            <p className="text-[11px] text-dark-text-muted leading-relaxed">{f.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Winners timeline ────────────────────────────────────── */

function WinnersTimeline() {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-dark-text-primary mb-1">Who brought it home before</h2>
      <p className="text-xs text-dark-text-muted mb-4">The last ten champions.</p>
      <div className="space-y-0">
        {WINNERS.map((w, i) => (
          <div key={i} className="flex gap-3 relative">
            {/* Timeline line */}
            {i < WINNERS.length - 1 && (
              <div className="absolute left-[27px] top-8 w-0.5 h-full bg-dark-border" />
            )}

            {/* Year chip */}
            <div className="shrink-0 w-14 pt-1.5">
              <span className="inline-flex items-center justify-center w-14 h-7 rounded-full bg-dark-border text-[11px] font-bold text-dark-text-muted tabular-nums relative z-10">
                {w.year}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">{w.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark-text-primary">{w.winner}</p>
                  <p className="text-xs text-dark-text-muted">
                    beat {w.opponent} {w.score}
                  </p>
                  {w.badge && (
                    <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-900/20 text-amber-600">
                      {w.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Prediction CTA ──────────────────────────────────────── */

function PredictionPreview() {
  const daysLeft = getDaysUntil();

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#185FA5] to-blue-700 p-5 text-center mb-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2">
        Your tournament starts here
      </p>
      <p className="text-xl font-semibold text-white mb-1">
        {daysLeft} day{daysLeft !== 1 ? 's' : ''} to lock in your prediction
      </p>
      <p className="text-xs text-white/50 mb-5">
        Predictions lock when the tournament begins.
      </p>
      <Link href="/bracket" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-dark-surface text-dark-accent text-sm font-semibold transition-all active:scale-95">
        Build your bracket →
      </Link>
    </div>
  );
}

/* ─── Phase 1: Pre-tournament ─────────────────────────────── */

function PreTournament() {
  const { containerRef, getRevealProps } = useScrollReveal<HTMLDivElement>({ staggerDelay: 100 });

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">WC Wrapped</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">The wait is almost over</h1>
      </div>

      <div ref={containerRef} className="space-y-4">
        <div {...getRevealProps(0)}><Countdown /></div>
        <div {...getRevealProps(1)}><MomentsCarousel /></div>
        <div {...getRevealProps(2)}><FastFacts /></div>
        <div {...getRevealProps(3)}><WinnersTimeline /></div>
        <div {...getRevealProps(4)}><PredictionPreview /></div>
      </div>
    </div>
  );
}

/* ─── Phase 2: Live tournament ────────────────────────────── */

function LiveTournament() {
  const { userStats, predictions } = usePredictionStore();
  const { bracket } = useBracketStore();
  const [narrative, setNarrative] = useState('');
  const [narrativeLoading, setNarrativeLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  const matchday = getMatchday();
  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

  useEffect(() => {
    usePredictionStore.persist.rehydrate();
    useBracketStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    fetch('/api/wrapped/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: matchday, date: dateStr, matches: [] }),
    })
      .then(r => r.json())
      .then(d => setNarrative(d.narrative))
      .catch(() => setNarrative('The tournament writes another chapter. Every match changes everything.'))
      .finally(() => setNarrativeLoading(false));
  }, [matchday, dateStr]);

  const handleShare = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.share({
        title: `Bring It Home — My Day ${matchday} Wrapped`,
        text: narrative || 'My World Cup 2026 journey continues.',
        url: 'https://bring-it-home.vercel.app/wrapped',
      });
    } catch {
      try {
        await navigator.clipboard.writeText(`My WC 2026 Day ${matchday}: ${narrative}\nhttps://bring-it-home.vercel.app/wrapped`);
      } catch { /* silent */ }
    }
  }, [matchday, narrative]);

  if (!hydrated) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-dark-border rounded" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-dark-border rounded-xl" />)}
        </div>
      </div>
    );
  }

  const accuracy = userStats.totalPredictions > 0
    ? Math.round((userStats.correctPredictions / userStats.totalPredictions) * 100)
    : 0;

  const champion = bracket.final[0]?.winner;

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">WC Wrapped</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Your World Cup, Day {matchday}</h1>
        <p className="text-xs text-dark-text-muted mt-0.5">{dateStr}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center">
          <span className="text-3xl font-bold text-dark-text-primary block tabular-nums">
            {userStats.correctPredictions}/{userStats.totalPredictions}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-dark-text-muted mt-1 block">Correct picks</span>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center">
          <span className="text-3xl font-bold text-dark-accent block tabular-nums">{accuracy}%</span>
          <span className="text-[10px] uppercase tracking-widest text-dark-text-muted mt-1 block">Accuracy</span>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center">
          <span className="text-3xl font-bold text-dark-text-primary block tabular-nums">
            {userStats.streak} 🔥
          </span>
          <span className="text-[10px] uppercase tracking-widest text-dark-text-muted mt-1 block">Streak</span>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center">
          <span className="text-lg font-bold text-dark-text-primary block leading-tight">{userStats.fanIQLevel}</span>
          <span className="text-[10px] uppercase tracking-widest text-dark-text-muted mt-1 block">Fan IQ</span>
        </div>
      </div>

      {/* Narrative card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">Today&apos;s story</p>
        {narrativeLoading ? (
          <div className="h-12 bg-dark-surface/10 rounded animate-pulse" />
        ) : (
          <p className="text-sm text-white/90 leading-relaxed mb-4">{narrative}</p>
        )}
        <button type="button" onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-surface/10 text-white text-xs font-medium active:bg-dark-surface/20 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share today
        </button>
      </div>

      {/* Champion progress */}
      {champion && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted mb-3">Your champion pick</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{champion.flag}</span>
            <div>
              <p className="text-sm font-semibold text-dark-text-primary">{champion.name}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-900/30 text-green-400 border border-green-800/50 mt-0.5">
                Still alive
              </span>
            </div>
          </div>
        </div>
      )}

      {!champion && (
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 text-center mb-6">
          <p className="text-sm text-dark-accent font-medium mb-2">You haven&apos;t picked a champion yet.</p>
          <Link href="/bracket" className="btn-primary text-xs px-5 py-2">
            Build your bracket →
          </Link>
        </div>
      )}

      {predictions.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-dark-text-muted mb-2">No predictions yet. Start picking winners.</p>
          <Link href="/bracket" className="text-sm text-dark-accent font-medium">Go to bracket →</Link>
        </div>
      )}
    </div>
  );
}

/* ─── Phase 3: Post-tournament ────────────────────────────── */

function PostTournament() {
  const { userStats } = usePredictionStore();
  const { bracket } = useBracketStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    usePredictionStore.persist.rehydrate();
    useBracketStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-dark-border rounded" />
        <div className="h-64 bg-dark-border rounded-xl" />
      </div>
    );
  }

  const accuracy = userStats.totalPredictions > 0
    ? Math.round((userStats.correctPredictions / userStats.totalPredictions) * 100)
    : 0;

  const champion = bracket.final[0]?.winner;

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const text = champion
      ? `I picked ${champion.name} to bring it home. My WC 2026 accuracy: ${accuracy}%. Fan IQ: ${userStats.fanIQLevel}.`
      : `My WC 2026 accuracy: ${accuracy}%. Fan IQ: ${userStats.fanIQLevel}.`;
    try {
      await navigator.share({
        title: 'Bring It Home — My 2026 WC Story',
        text,
        url: 'https://bring-it-home.vercel.app/wrapped',
      });
    } catch {
      try { await navigator.clipboard.writeText(text); } catch { /* silent */ }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-0.5">WC Wrapped</p>
        <h1 className="text-xl font-semibold text-dark-text-primary">Your 2026 World Cup Story</h1>
      </div>

      {/* Recap card */}
      <div className="bg-gradient-to-br from-[#0A1628] to-gray-900 rounded-2xl p-6 text-center mb-6">
        {champion && (
          <div className="mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
              Your champion pick
            </p>
            <span className="text-5xl block mb-2">{champion.flag}</span>
            <p className="text-lg font-semibold text-white">{champion.name}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-dark-surface/10 rounded-xl p-3">
            <span className="text-2xl font-bold text-white block tabular-nums">{accuracy}%</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5 block">Accuracy</span>
          </div>
          <div className="bg-dark-surface/10 rounded-xl p-3">
            <span className="text-2xl font-bold text-white block tabular-nums">{userStats.longestStreak}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5 block">Best streak</span>
          </div>
          <div className="bg-dark-surface/10 rounded-xl p-3">
            <span className="text-2xl font-bold text-white block tabular-nums">
              {userStats.correctPredictions}/{userStats.totalPredictions}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5 block">Correct</span>
          </div>
          <div className="bg-dark-surface/10 rounded-xl p-3">
            <span className="text-base font-bold text-white block leading-tight">{userStats.fanIQLevel}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5 block">Fan IQ</span>
          </div>
        </div>

        <button type="button" onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-dark-surface text-[#0A1628] text-sm font-semibold active:scale-95 transition-transform">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share your story
        </button>
      </div>

      <WinnersTimeline />
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */

export default function WCWrapped() {
  const phase = getPhase();

  if (phase === 'pre') return <PreTournament />;
  if (phase === 'live') return <LiveTournament />;
  return <PostTournament />;
}
