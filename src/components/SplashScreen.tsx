'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SPRING = [0.34, 1.56, 0.64, 1] as const;

function TrophySVG() {
  return (
    <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold" x1="60" y1="0" x2="60" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5D78E" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="goldDark" x1="60" y1="120" x2="60" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8962E" />
          <stop offset="100%" stopColor="#9A7B22" />
        </linearGradient>
      </defs>

      {/* Base plinth */}
      <rect x="30" y="140" width="60" height="16" rx="3" fill="url(#goldDark)" />
      <rect x="38" y="132" width="44" height="12" rx="2" fill="url(#gold)" />

      {/* Stem */}
      <rect x="52" y="108" width="16" height="28" rx="3" fill="url(#gold)" />

      {/* Cup body — tapered, widening toward top */}
      <path
        d="M36 30 C36 75, 44 100, 52 108 L68 108 C76 100, 84 75, 84 30 Z"
        fill="url(#gold)"
      />

      {/* Flat circular top / rim */}
      <ellipse cx="60" cy="30" rx="26" ry="8" fill="url(#gold)" />
      <ellipse cx="60" cy="30" rx="20" ry="5" fill="#0A1628" opacity="0.15" />

      {/* Left handle */}
      <path
        d="M36 42 C14 42, 8 65, 18 82 C24 92, 38 90, 42 80"
        stroke="url(#gold)" strokeWidth="7" fill="none" strokeLinecap="round"
      />

      {/* Right handle */}
      <path
        d="M84 42 C106 42, 112 65, 102 82 C96 92, 82 90, 78 80"
        stroke="url(#gold)" strokeWidth="7" fill="none" strokeLinecap="round"
      />

      {/* Shine highlight */}
      <ellipse cx="50" cy="55" rx="8" ry="22" fill="white" opacity="0.15"
        transform="rotate(-8 50 55)" />
    </svg>
  );
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A1628' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full border border-white/5" />
        <div className="absolute bottom-1/4 -right-16 w-48 h-48 rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03]" />
      </div>

      {/* Football — drops in from above */}
      <motion.div
        className="text-6xl mb-2"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: SPRING }}
      >
        ⚽
      </motion.div>

      {/* Trophy SVG — scales up with spring */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: SPRING }}
      >
        <TrophySVG />
      </motion.div>

      {/* "Bring It Home" — fades up */}
      <motion.h1
        className="text-3xl font-bold text-white mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
      >
        Bring It Home
      </motion.h1>

      {/* Subtitle — letter-spaces in */}
      <motion.p
        className="text-sm uppercase font-medium mb-1"
        style={{ color: '#f5d442' }}
        initial={{ opacity: 0, letterSpacing: '0em' }}
        animate={{ opacity: 1, letterSpacing: '0.3em' }}
        transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
      >
        FIFA World Cup
      </motion.p>

      {/* Host line — letter-spaces in */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, letterSpacing: '0em' }}
        animate={{ opacity: 1, letterSpacing: '0.4em' }}
        transition={{ delay: 0.8, duration: 0.7, ease: 'easeOut' }}
      >
        <div className="h-px w-8 bg-white/20" />
        <span className="text-white/60 text-xs font-medium">
          USA · CANADA · MEXICO · 2026
        </span>
        <div className="h-px w-8 bg-white/20" />
      </motion.div>

      {/* Tagline — fades in last */}
      <motion.p
        className="absolute bottom-12 text-white/40 text-xs italic text-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        Every team starts the tournament. Only one brings it home.
      </motion.p>

      {/* Gold line accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #f5d442, transparent)' }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
