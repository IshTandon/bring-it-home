'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './SplashScreen';

const NAV_LINKS = [
  { href: '/',         label: 'Home',     icon: '🏟️' },
  { href: '/bracket',  label: 'Bracket',  icon: '🏆' },
  { href: '/players',  label: 'Players',  icon: '⚽' },
  { href: '/groups',   label: 'Groups',   icon: '📊' },
  { href: '/rankings', label: 'Glory',    icon: '📈' },
  { href: '/timeline', label: 'Timeline', icon: '📰' },
  { href: '/history',  label: 'History',  icon: '📜' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('splash-seen');
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('splash-seen', '1');
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              ⚽
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-gray-900">Bring It Home</span>
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#d4a017' }}>World Cup 2026</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors
                  ${pathname === link.href
                    ? 'text-gray-900 bg-gray-100 font-medium'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content — pb accounts for nav height (60px) + safe-area on mobile */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:pb-6"
        style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>

      {/* Bottom tab bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', backgroundColor: 'rgba(255,255,255,0.95)', WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}>
        <div className="flex justify-around px-2">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 min-w-[60px] transition-colors
                  ${isActive ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {link.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gray-900" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
