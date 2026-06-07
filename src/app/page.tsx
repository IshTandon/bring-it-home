'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LiveScoreTicker from '@/components/ui/LiveScoreTicker';
import { useLiveMatches } from '@/hooks/useLiveMatches';

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
    <p className="text-[10px] text-gray-400 mb-6 -mt-4 tabular-nums">
      Last updated {ago}
    </p>
  );
}

const PRIMARY_ACTIONS = [
  {
    href: '/bracket',
    title: 'Bracket',
    desc: 'Pick your path to the final. Share your bracket.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v4h4" /><path d="M4 8h4v8H4" /><path d="M4 16v4h4" />
        <path d="M8 6h4v12H8" /><path d="M12 12h4" /><path d="M16 8v8" /><path d="M16 12h4" />
      </svg>
    ),
  },
  {
    href: '/players',
    title: 'Players',
    desc: 'FIFA-style cards. Stats, form, head-to-head.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0113 0" />
      </svg>
    ),
  },
  {
    href: '/groups',
    title: 'Groups',
    desc: 'Toggle results. Watch the table shift live.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
];

const SECONDARY = [
  { href: '/timeline', title: 'Tournament Timeline', desc: 'Every matchday told as a chapter.' },
  { href: '/wrapped',  title: 'WC Wrapped',          desc: 'Your predictions, your stats, shareable.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-6 pt-4">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
          FIFA World Cup 2026 · USA · Canada · Mexico
        </p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-2 leading-tight">
          Who&apos;s gonna bring it home?
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          48 nations. One trophy.<br />
          The biggest World Cup ever.
        </p>
        <div className="flex gap-3 mb-6">
          <Link href="/bracket" className="btn-primary">
            Build your bracket
          </Link>
          <Link href="/players" className="btn">
            Scout players
          </Link>
        </div>
      </div>

      {/* Live score ticker */}
      <LiveScoreTicker />
      <LastUpdated />

      {/* Primary CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {PRIMARY_ACTIONS.map(a => (
          <Link
            key={a.href}
            href={a.href}
            className="card hover:border-gray-200 hover:shadow-md transition-all group cursor-pointer flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              {a.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900 mb-0.5 group-hover:text-[#185FA5] transition-colors">
                {a.title}
              </div>
              <div className="text-sm text-gray-500 leading-relaxed">{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary — deprioritised */}
      <div className="grid grid-cols-2 gap-3">
        {SECONDARY.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-xl border border-gray-100 bg-gray-50 p-3.5 hover:bg-gray-100 transition-colors group cursor-pointer"
          >
            <div className="text-sm font-medium text-gray-500 mb-0.5 group-hover:text-gray-700 transition-colors">
              {s.title}
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
