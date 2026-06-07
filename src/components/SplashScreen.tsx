'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0A1628]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Official FIFA WC 2026 logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <Image
          src="/icon-512x512.png"
          alt="Who's Gonna Bring It Home?"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* App name */}
      <motion.h1
        className="text-2xl font-bold text-white mt-6 mb-2 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
      >
        Who&apos;s gonna bring it home?
      </motion.h1>

      {/* Host line */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.7, ease: 'easeOut' }}
      >
        <div className="h-px w-8 bg-white/20" />
        <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
          USA · Canada · Mexico
        </span>
        <div className="h-px w-8 bg-white/20" />
      </motion.div>

      {/* Tagline */}
      <motion.p
        className="absolute bottom-12 text-white/30 text-xs italic text-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        48 nations. One trophy. Who&apos;s bringing it home?
      </motion.p>

      {/* Gold line accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A840, transparent)' }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
