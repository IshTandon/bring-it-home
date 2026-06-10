'use client';

import { motion } from 'framer-motion';

interface EliminationBannerProps {
  teamName: string;
  teamFlag: string;
}

export default function EliminationBanner({ teamName, teamFlag }: EliminationBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-center gap-3"
    >
      <span className="text-2xl leading-none">💀</span>
      <div>
        <p className="text-sm font-bold text-red-400">
          {teamFlag} {teamName} ELIMINATED
        </p>
        <p className="text-[10px] text-dark-text-muted">In this scenario</p>
      </div>
    </motion.div>
  );
}
