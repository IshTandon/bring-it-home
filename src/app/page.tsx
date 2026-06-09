'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import LiveScoreTicker from '@/components/ui/LiveScoreTicker';
import DailyPredictionWidget from '@/components/ui/DailyPredictionWidget';
import StreakNudgeBanner from '@/components/ui/StreakNudgeBanner';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { useBracketStore } from '@/lib/store';
import type { BracketState } from '@/types';

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

function NextMatchCountdown() {
  const { matches } = useLiveMatches();
  const [countdown, setCountdown] = useState('');

  const nextMatch = useMemo(() => {
    const upcoming = matches.filter(m => m.status === 'NS');
    if (upcoming.length === 0) return null;
    return upcoming[0];
  }, [matches]);

  useEffect(() => {
    if (!nextMatch) return;
    const update = () => {
      const matchTime = new Date(`${nextMatch.date}T${nextMatch.time?.replace(' ET', ':00') || '00:00:00'}`);
      const diff = matchTime.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown('Starting soon');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdown(`in ${h}h ${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [nextMatch]);

  const hasLive = matches.some(m => m.status !== 'NS' && m.status !== 'FT' && m.status !== 'AET' && m.status !== 'PEN');

  if (hasLive) return null;

  if (!nextMatch) {
    return (
      <div className="mb-4 bg-dark-surface border border-dark-border rounded-xl p-3 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-gray-600" />
        <p className="text-sm text-dark-text-muted">No matches scheduled. The tournament continues soon.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-dark-surface border border-dark-border rounded-xl p-3 flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      <p className="text-sm text-dark-text-primary">
        <span className="text-dark-text-muted">Next: </span>
        <span className="font-medium">{nextMatch.homeTeam.flag} {nextMatch.homeTeam.name} vs {nextMatch.awayTeam.name} {nextMatch.awayTeam.flag}</span>
        <span className="text-dark-accent ml-1.5 font-medium">{countdown}</span>
      </p>
    </div>
  );
}

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
          <h3 className="text-sm font-semibold text-dark-text-primary">My Bracket</h3>
        </div>
        <p className="text-sm text-dark-text-muted mb-3">You haven&apos;t started your bracket yet.</p>
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
          <h3 className="text-sm font-semibold text-dark-text-primary">My Bracket</h3>
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

const HISTORY_FACTS = [
  'Brazil has won the World Cup 5 times — more than any nation.',
  'The highest-scoring WC final was 1958: Brazil 5–2 Sweden.',
  'Only 8 nations have ever won the World Cup.',
  'The 2022 final (Argentina vs France) is considered the greatest WC final of all time.',
  'Germany holds the record for most goals scored in WC history: 232.',
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

export default function Home() {
  return (
    <div>
      {/* Live score ticker */}
      <LiveScoreTicker />
      <LastUpdated />

      {/* Hero */}
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

      {/* Streak nudge banner */}
      <StreakNudgeBanner />

      {/* Daily Prediction Widget */}
      <DailyPredictionWidget />

      {/* Next match countdown (when no live matches) */}
      <NextMatchCountdown />

      {/* Dynamic feed widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <BracketSnapshot />
        <GloryIndexPreview />
        <HistoryTeaser />
      </div>

      {/* News Feed */}
      <LatestNews />
    </div>
  );
}
