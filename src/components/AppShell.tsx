'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './SplashScreen';

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#185FA5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconBracket({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#185FA5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4v4h4" />
      <path d="M4 8h4v8H4" />
      <path d="M4 16v4h4" />
      <path d="M8 6h4v12H8" />
      <path d="M12 12h4" />
      <path d="M16 8v8" />
      <path d="M16 12h4" />
    </svg>
  );
}

function IconPlayers({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#185FA5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0113 0" />
    </svg>
  );
}

function IconGroups({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#185FA5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconMore({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#185FA5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="1.5" fill={active ? '#185FA5' : '#9CA3AF'} />
      <circle cx="12" cy="12" r="1.5" fill={active ? '#185FA5' : '#9CA3AF'} />
      <circle cx="19" cy="12" r="1.5" fill={active ? '#185FA5' : '#9CA3AF'} />
    </svg>
  );
}

const BOTTOM_TABS = [
  { href: '/',        label: 'Home',    Icon: IconHome },
  { href: '/bracket', label: 'Bracket', Icon: IconBracket },
  { href: '/players', label: 'Players', Icon: IconPlayers },
  { href: '/groups',  label: 'Groups',  Icon: IconGroups },
] as const;

const MORE_LINKS = [
  { href: '/rankings', label: 'Glory Index',          icon: '📈' },
  { href: '/timeline', label: 'Tournament Timeline',  icon: '📰' },
  { href: '/history',  label: 'History',               icon: '📜' },
  { href: '/wrapped',  label: 'WC Wrapped',            icon: '🎁' },
];

const DESKTOP_NAV = [
  { href: '/',         label: 'Home' },
  { href: '/bracket',  label: 'Bracket' },
  { href: '/players',  label: 'Players' },
  { href: '/groups',   label: 'Groups' },
  { href: '/rankings', label: 'Glory' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/history',  label: 'History' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem('splash-seen');
    if (seen) setShowSplash(false);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('splash-seen', '1');
  }, []);

  const isMoreActive = MORE_LINKS.some(l => pathname === l.href);

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
            <img src="/fifa-wc26.png" alt="FIFA WC 2026" className="w-7 h-7 rounded object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-gray-900">Bring It Home</span>
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: '#d4a017' }}>World Cup 2026</span>
            </div>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {DESKTOP_NAV.map(link => (
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

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:pb-6"
        style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>

      {/* Bottom tab bar — mobile only */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', backgroundColor: 'rgba(255,255,255,0.97)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
        <div className="grid grid-cols-5 h-[60px]">
          {BOTTOM_TABS.map(tab => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center gap-0.5 transition-colors"
              >
                <tab.Icon active={isActive} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#185FA5]' : 'text-[#9CA3AF]'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
          {/* More tab */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 transition-colors"
          >
            <IconMore active={isMoreActive || moreOpen} />
            <span className={`text-[10px] font-medium ${isMoreActive || moreOpen ? 'text-[#185FA5]' : 'text-[#9CA3AF]'}`}>
              More
            </span>
          </button>
        </div>
      </div>

      {/* More bottom sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMoreOpen(false)}
            />
            {/* Sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-2xl shadow-2xl"
              style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) setMoreOpen(false);
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              <div className="px-2 pb-4">
                {MORE_LINKS.map(link => (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => {
                      setMoreOpen(false);
                      router.push(link.href);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors active:bg-gray-50
                      ${pathname === link.href ? 'bg-blue-50' : ''}
                    `}
                  >
                    <span className="text-xl w-7 text-center">{link.icon}</span>
                    <span className={`flex-1 text-left text-sm font-medium ${pathname === link.href ? 'text-[#185FA5]' : 'text-gray-900'}`}>
                      {link.label}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
