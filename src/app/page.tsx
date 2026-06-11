'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import LiveScoreTicker from '@/components/ui/LiveScoreTicker';
import DailyPredictionWidget from '@/components/ui/DailyPredictionWidget';
import StreakNudgeBanner from '@/components/ui/StreakNudgeBanner';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { useBracketStore, useUserPreferencesStore } from '@/lib/store';
import { TEAMS, MOCK_GROUPS } from '@/lib/data';
import { getNextFixture, getNextFixtureForTeam, getStadiumById, FIXTURES } from '@/lib/fixtures';
import type { Fixture } from '@/lib/fixtures';
import type { BracketState } from '@/types';

function getFixtureDisplay(f: Fixture) {
  const home = TEAMS.find(t => t.id === f.homeTeamId);
  const away = TEAMS.find(t => t.id === f.awayTeamId);
  const stadium = getStadiumById(f.stadiumId);
  return {
    homeTeamFlag: home?.flag ?? '🏳️',
    homeTeamName: home?.name ?? f.label?.split(' vs ')[0] ?? 'TBD',
    awayTeamFlag: away?.flag ?? '🏳️',
    awayTeamName: away?.name ?? f.label?.split(' vs ')[1] ?? 'TBD',
    stadium: stadium?.name ?? f.stadiumId,
  };
}

/* ─── Last Updated ──────────────────────────────────────── */

function LastUpdated() {
  const { lastUpdated } = useLiveMatches();
  const [ago, setAgo] = useState('');

  useEffect(() => {
    if (!lastUpdated) return;
    const update = () => {
      const secs = Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000);
      if (secs < 5) setAgo('just now');
      else if (secs < 60) setAgo(`${secs}s ago`);
      else setAgo(`${Math.floor(secs / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  if (!lastUpdated || !ago) return null;

  return (
    <p className="text-[10px] text-dark-text-muted mb-6 -mt-4 tabular-nums">
      Last updated {ago}
    </p>
  );
}

/* ─── Next Match Countdown ──────────────────────────────── */

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

type CountdownDisplay =
  | { type: 'countdown'; fixture: Fixture; label: string; h: number; m: number; s: number }
  | { type: 'live'; fixture: Fixture }
  | { type: 'complete' };

function kickoffOf(f: Fixture) {
  return new Date(`${f.date}T${f.time}:00Z`).getTime();
}

function NextMatchCountdown() {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const champion = useBracketStore(s => s.bracket.final[0]?.winner);
  const [mounted, setMounted] = useState(false);
  const [display, setDisplay] = useState<CountdownDisplay>({ type: 'complete' });

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    function tick() {
      const now = Date.now();
      const hasFav = favoriteTeamId != null && favoriteTeamId !== 'skipped';

      const liveMatches = FIXTURES
        .filter(f => {
          const elapsed = now - kickoffOf(f);
          return elapsed >= 0 && elapsed < TWO_HOURS_MS;
        })
        .sort((a, b) => kickoffOf(b) - kickoffOf(a));

      let liveFixture: Fixture | undefined;
      if (hasFav) {
        liveFixture = liveMatches.find(
          f => f.homeTeamId === favoriteTeamId || f.awayTeamId === favoriteTeamId
        );
      }
      if (!liveFixture) liveFixture = liveMatches[0];

      if (liveFixture) {
        setDisplay({ type: 'live', fixture: liveFixture });
        return;
      }

      let nextFixture: Fixture | undefined;
      let label = 'Next up';

      if (hasFav) {
        const teamNext = getNextFixtureForTeam(favoriteTeamId!, new Date(now));
        if (teamNext && kickoffOf(teamNext) - now <= THREE_DAYS_MS) {
          nextFixture = teamNext;
          label = 'Your next match';
        }
      }
      if (!nextFixture) {
        nextFixture = getNextFixture(new Date(now));
      }

      if (nextFixture) {
        const diff = kickoffOf(nextFixture) - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setDisplay({ type: 'countdown', fixture: nextFixture, label, h, m, s });
        return;
      }

      setDisplay({ type: 'complete' });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [mounted, favoriteTeamId]);

  if (!mounted) return null;

  if (display.type === 'complete') {
    return (
      <Link href="/schedule" className="block">
        <div className="mb-6 bg-dark-surface border border-dark-border rounded-xl p-6 text-center space-y-2 transition-colors hover:border-dark-accent/30">
          <p className="text-2xl">🏆</p>
          <p className="text-lg font-bold text-dark-text-primary">Tournament complete</p>
          {champion && (
            <p className="text-sm text-dark-accent font-medium">
              {champion.flag} {champion.name} brought it home.
            </p>
          )}
          <p className="text-xs text-dark-text-muted mt-3">
            FIFA World Cup 2026 · USA · Canada · Mexico · 48 teams · 104 matches
          </p>
        </div>
      </Link>
    );
  }

  if (display.type === 'live') {
    const info = getFixtureDisplay(display.fixture);
    return (
      <Link href="/schedule" className="block">
        <div className="mb-6 bg-dark-surface border border-red-500/30 rounded-xl p-5 text-center space-y-3 transition-colors hover:border-red-500/50">
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">Live</span>
          </div>
          <p className="text-lg font-bold text-dark-text-primary">
            {info.homeTeamFlag} {info.homeTeamName} vs {info.awayTeamName} {info.awayTeamFlag}
          </p>
          <p className="text-xs text-dark-text-muted">
            {display.fixture.group && `${display.fixture.group} · `}{info.stadium}
          </p>
        </div>
      </Link>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const info = getFixtureDisplay(display.fixture);

  return (
    <Link href="/schedule" className="block">
      <div className="mb-6 bg-dark-surface border border-dark-border rounded-xl p-5 text-center space-y-3 transition-colors hover:border-dark-accent/30">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent/70">
          {display.label}
        </p>
        <p className="text-lg font-bold text-dark-text-primary">
          {info.homeTeamFlag} {info.homeTeamName} vs {info.awayTeamName} {info.awayTeamFlag}
        </p>
        <p className="text-xs text-dark-text-muted">
          {display.fixture.group && `${display.fixture.group} · `}{info.stadium}
        </p>
        <div className="flex items-center justify-center gap-1 tabular-nums">
          <span className="bg-dark-bg text-dark-text-primary text-xl font-bold px-3 py-1.5 rounded-lg">
            {pad(display.h)}
          </span>
          <span className="text-dark-text-muted font-bold text-lg">:</span>
          <span className="bg-dark-bg text-dark-text-primary text-xl font-bold px-3 py-1.5 rounded-lg">
            {pad(display.m)}
          </span>
          <span className="text-dark-text-muted font-bold text-lg">:</span>
          <span className="bg-dark-bg text-dark-text-primary text-xl font-bold px-3 py-1.5 rounded-lg">
            {pad(display.s)}
          </span>
        </div>
        <p className="text-[10px] text-dark-text-muted pt-1">
          FIFA World Cup 2026 · USA · Canada · Mexico · 48 teams · 104 matches
        </p>
      </div>
    </Link>
  );
}

/* ─── Your Team ─────────────────────────────────────────── */

function YourTeamCard() {
  const favoriteTeamId = useUserPreferencesStore(s => s.favoriteTeamId);
  const champion = useBracketStore(s => s.bracket.final[0]?.winner);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useUserPreferencesStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hasFavTeam = favoriteTeamId && favoriteTeamId !== 'skipped';
  const team = hasFavTeam ? TEAMS.find(t => t.id === favoriteTeamId) : null;
  const group = team ? MOCK_GROUPS.find(g => g.teams.some(t => t.id === team.id)) : null;
  const nextFixture = group
    ? group.matches.find(m => m.status === 'NS' && (m.homeTeam.id === team!.id || m.awayTeam.id === team!.id))
    : null;

  if (team && group) {
    return (
      <div className="mb-4 bg-dark-surface border border-dark-accent/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{team.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent/70 mb-0.5">
              Your team
            </p>
            <p className="text-base font-bold text-dark-text-primary truncate">{team.name}</p>
          </div>
          <Link
            href={`/teams/${team.id}`}
            className="shrink-0 text-xs text-dark-accent font-medium hover:text-dark-accent-hover transition-colors"
          >
            Profile →
          </Link>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="bg-dark-bg text-dark-text-muted text-[11px] font-medium px-2.5 py-1 rounded-lg">
            Group {group.id}
          </span>
          <span className="bg-dark-bg text-dark-text-muted text-[11px] font-medium px-2.5 py-1 rounded-lg">
            Rank #{team.rank}
          </span>
        </div>

        {nextFixture && (
          <div className="bg-dark-bg rounded-lg p-3 flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted">Next:</span>
            <span className="text-sm text-dark-text-primary font-medium">
              {nextFixture.homeTeam.flag} {nextFixture.homeTeam.name} vs {nextFixture.awayTeam.name} {nextFixture.awayTeam.flag}
            </span>
          </div>
        )}

        <Link
          href={`/groups?team=${team.id}`}
          className="block text-center text-xs text-dark-accent font-medium hover:text-dark-accent-hover transition-colors py-1"
        >
          Check qualification scenarios →
        </Link>
      </div>
    );
  }

  if (!champion) return null;

  return (
    <div className="mb-4 bg-dark-surface border border-dark-accent/30 rounded-xl p-4 flex items-center gap-4">
      <span className="text-4xl">{champion.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest text-dark-accent/70 mb-0.5">
          Your pick to bring it home
        </p>
        <p className="text-base font-bold text-dark-text-primary truncate">
          {champion.name}
        </p>
      </div>
      <Link
        href="/bracket"
        className="shrink-0 text-xs text-dark-accent font-medium hover:text-dark-accent-hover transition-colors"
      >
        View picks →
      </Link>
    </div>
  );
}

/* ─── Bracket Snapshot ──────────────────────────────────── */

function BracketSnapshot() {
  const bracket = useBracketStore(s => s.bracket);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const allPicks: { flag: string; name: string; round: string }[] = [];
  const roundLabels: Record<keyof BracketState, string> = {
    r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', final: 'Final',
  };
  const rounds: (keyof BracketState)[] = ['final', 'sf', 'qf', 'r16', 'r32'];

  for (const round of rounds) {
    for (const match of bracket[round]) {
      if (match.winner) {
        allPicks.push({ flag: match.winner.flag, name: match.winner.name, round: roundLabels[round] });
      }
    }
    if (allPicks.length >= 3) break;
  }

  const last3 = allPicks.slice(0, 3);

  if (last3.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🏆</span>
          <h3 className="text-sm font-semibold text-dark-text-primary">My Picks</h3>
        </div>
        <p className="text-sm text-dark-text-muted mb-3">You haven&apos;t made any picks yet.</p>
        <Link href="/bracket" className="btn-primary text-xs py-2 px-4">
          Start picking →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <h3 className="text-sm font-semibold text-dark-text-primary">My Picks</h3>
        </div>
        <Link href="/bracket" className="text-xs text-dark-accent font-medium">
          Continue →
        </Link>
      </div>
      <div className="space-y-1.5">
        {last3.map((pick, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1.5 bg-dark-bg rounded-lg">
            <span className="text-base">{pick.flag}</span>
            <span className="text-xs font-medium text-dark-text-primary flex-1">{pick.name}</span>
            <span className="text-[10px] text-dark-accent font-medium bg-dark-accent/10 px-1.5 py-0.5 rounded">{pick.round}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Glory Index Preview ───────────────────────────────── */

function GloryIndexPreview() {
  const TOP_TEAMS = [
    { flag: '🇫🇷', name: 'France', score: '100.0' },
    { flag: '🇪🇸', name: 'Spain', score: '96.2' },
    { flag: '🇦🇷', name: 'Argentina', score: '93.9' },
  ];

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <h3 className="text-sm font-semibold text-dark-text-primary">Glory Index</h3>
        </div>
        <Link href="/rankings" className="text-xs text-dark-accent font-medium">
          Full ranking →
        </Link>
      </div>
      <div className="space-y-1.5">
        {TOP_TEAMS.map((team, i) => (
          <div key={team.name} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 0 ? 'bg-dark-accent/10 border border-dark-accent/20' : 'bg-dark-bg'}`}>
            <span className={`text-xs font-bold w-5 text-center ${i === 0 ? 'text-dark-accent' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
              {i + 1}
            </span>
            <span className="text-base">{team.flag}</span>
            <span className="text-xs font-medium text-dark-text-primary flex-1">{team.name}</span>
            <span className={`text-xs font-bold tabular-nums ${i === 0 ? 'text-dark-accent' : 'text-dark-text-muted'}`}>{team.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── History Teaser ────────────────────────────────────── */

const HISTORY_FACTS = [
  'Brazil has won the World Cup 5 times — more than any nation.',
  'The highest-scoring WC final was 1958: Brazil 5–2 Sweden.',
  'Only 8 nations have ever won the World Cup.',
  'The 2022 final (Argentina vs France) is considered the greatest WC final of all time.',
  'Brazil hold the record for most World Cup goals scored with 237 goals across all tournaments, the most by any nation in history.',
  'The first World Cup was held in Uruguay in 1930 with just 13 teams.',
  'Italy has won back-to-back World Cups (1934, 1938) — one of only two teams to do so.',
  'Miroslav Klose holds the all-time WC scoring record with 16 goals.',
];

function HistoryTeaser() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    const idx = Math.floor(Math.random() * HISTORY_FACTS.length);
    setFact(HISTORY_FACTS[idx]);
  }, []);

  if (!fact) return null;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <h3 className="text-sm font-semibold text-dark-text-primary">Did you know?</h3>
        </div>
        <Link href="/history" className="text-xs text-dark-accent font-medium">
          Explore history →
        </Link>
      </div>
      <p className="text-sm text-dark-text-muted leading-relaxed">{fact}</p>
    </div>
  );
}

/* ─── Latest News ───────────────────────────────────────── */

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const newsFetcher = (url: string) => fetch(url).then(r => r.json());

function LatestNews() {
  const { data, isLoading } = useSWR<{ articles: NewsArticle[] }>(
    '/api/news',
    newsFetcher,
    { revalidateOnFocus: false, refreshInterval: 900000 }
  );

  const articles = data?.articles ?? [];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Latest News</h2>
        <span className="text-gray-500 text-xs">From Google News</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-5 rounded-full bg-gray-800 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
              <div className="flex-1 space-y-2">
                <div className="w-full h-4 rounded bg-gray-800 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
                <div className="w-3/4 h-4 rounded bg-gray-800 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-gray-500 text-center text-sm py-8">
          No news right now — check back soon
        </p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 transition-colors hover:bg-gray-800 hover:border-gray-600 group ${
                i < articles.length - 1 ? 'border-b border-gray-800' : ''
              }`}
            >
              <span className="shrink-0 bg-gray-800 text-amber-400 text-xs px-2 py-0.5 rounded-full">
                {article.source}
              </span>
              <span className="flex-1 min-w-0 text-gray-100 text-sm font-medium line-clamp-2">
                {article.title}
              </span>
              <span className="shrink-0 text-gray-500 text-xs whitespace-nowrap">
                {article.publishedAt}
              </span>
            </a>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-xs mt-3">
        Headlines via Google News. Content belongs to respective publishers.
      </p>
    </section>
  );
}

/* ─── Home Page ──────────────────────────────────────────── */

export default function Home() {
  return (
    <div>
      {/* 1. Live score ticker */}
      <LiveScoreTicker />
      <LastUpdated />

      {/* 2. Hero */}
      <div className="mb-8 pt-2">
        <p className="text-xs font-medium uppercase tracking-widest text-dark-accent/70 mb-4">
          FIFA World Cup 2026 · USA · Canada · Mexico
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-dark-text-primary mb-3 leading-tight">
          Who&apos;s gonna bring it home?
        </h1>
        <p className="text-lg text-dark-text-muted mb-6">
          48 nations. One trophy.<br />
          The biggest World Cup ever.
        </p>
        <div className="flex gap-3">
          <Link href="/bracket" className="btn-primary">
            Pick your champion →
          </Link>
          <Link href="/timeline" className="btn">
            Today&apos;s story
          </Link>
        </div>
      </div>

      {/* 3. Match status strip / countdown */}
      <NextMatchCountdown />

      {/* 4. Your team (only when champion is picked) */}
      <YourTeamCard />

      {/* 5. Streak nudge */}
      <StreakNudgeBanner />

      {/* 6. Daily prediction */}
      <DailyPredictionWidget />

      {/* 7. Feature showcase — the main draw */}
      <FeatureShowcase />

      {/* 8. Bracket progress + Glory Index top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <BracketSnapshot />
        <GloryIndexPreview />
      </div>

      {/* 9. Did you know */}
      <div className="mb-6">
        <HistoryTeaser />
      </div>

      {/* 10. News feed */}
      <LatestNews />
    </div>
  );
}
