'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './SplashScreen';
import OnboardingOverlay from './OnboardingOverlay';
import WelcomeFlow from '@/components/onboarding/WelcomeFlow';
import StreakBadge from '@/components/ui/StreakBadge';
import BottomNav from '@/components/nav/BottomNav';

const ACTIVE_COLOR = '#f59e0b';
const INACTIVE_COLOR = '#6b7280';

const NAV_LINKS = [
  { href: '/',         label: 'Home',             icon: '🏠' },
  { href: '/format',   label: 'How It Works',     icon: '🗺️' },
  { href: '/bracket',  label: 'My Picks',          icon: '🏆' },
  { href: '/players',  label: 'Players',          icon: '⚽' },
  { href: '/groups',   label: 'Groups',           icon: '📊' },
  { href: '/rankings', label: 'Glory Index',      icon: '📈' },
  { href: '/timeline', label: 'Timeline',         icon: '📰' },
  { href: '/history',  label: 'World Cup History', icon: '📜' },
  { href: '/wrapped',  label: 'WC Wrapped',       icon: '🎁' },
  { href: '/news',     label: 'News',             icon: '📡' },
  { href: '/settings', label: 'Settings',         icon: '⚙️' },
];

const DESKTOP_NAV = [
  { href: '/',         label: 'Home' },
  { href: '/bracket',  label: 'My Picks' },
  { href: '/players',  label: 'Players' },
  { href: '/groups',   label: 'Groups' },
  { href: '/format',   label: 'Format' },
  { href: '/rankings', label: 'Glory' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/history',  label: 'History' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('splash-seen');
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('splash-seen', '1');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (drawerOpen) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      if (touchStartX.current < 30 && dx > 60 && dy < 40) {
        setDrawerOpen(true);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [mounted, drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <OnboardingOverlay />
      <WelcomeFlow />

      {/* Top nav bar */}
      <nav className="sticky top-0 z-50 border-b border-dark-border px-4 py-2.5"
        style={{ backgroundColor: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="sm:hidden flex items-center justify-center w-8 h-8 -ml-1 rounded-lg active:bg-dark-border transition-colors"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INACTIVE_COLOR} strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2.5 active:scale-95 transition-transform">
              <img src="/fifa-wc26.png" alt="FIFA WC 2026" className="w-7 h-7 rounded object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight text-dark-text-primary">Bring It Home</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-dark-accent">World Cup 2026</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="sm:hidden">
              <StreakBadge />
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {DESKTOP_NAV.map(link => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-sm rounded-md transition-colors
                      ${isActive
                        ? 'text-dark-accent font-medium'
                        : 'text-dark-text-muted hover:text-dark-text-primary'}
                    `}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-dark-accent rounded-full" />
                    )}
                  </Link>
                );
              })}
              <StreakBadge />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom tab bar — mobile only */}
      <BottomNav />

      {/* Left-side drawer — mobile */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-dark-surface border-r border-dark-border shadow-2xl flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: -280, right: 0 }}
              dragElastic={0.05}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) setDrawerOpen(false);
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-dark-border">
                <div className="flex items-center gap-2.5">
                  <img src="/fifa-wc26.png" alt="FIFA WC 2026" className="w-6 h-6 rounded object-contain" />
                  <span className="text-sm font-semibold text-dark-text-primary">Bring It Home</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-border transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-3 px-3">
                {NAV_LINKS.map(link => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-colors active:bg-dark-border mb-0.5
                        ${isActive ? 'bg-dark-accent/10' : 'hover:bg-dark-border/50'}
                      `}
                    >
                      <span className="text-lg w-6 text-center">{link.icon}</span>
                      <span className={`text-sm font-medium ${isActive ? 'text-dark-accent' : 'text-dark-text-primary'}`}>
                        {link.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-dark-accent" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-dark-border">
                <StreakBadge />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
