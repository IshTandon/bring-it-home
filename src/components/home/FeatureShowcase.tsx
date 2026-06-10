'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Feature {
  icon: string;
  name: string;
  hook: string;
  href: string;
  highlight?: boolean;
}

const FEATURES: Feature[] = [
  {
    icon: '🌀',
    name: 'Chaos Mode',
    hook: 'Spin a random future for any group',
    href: '/groups',
    highlight: true,
  },
  {
    icon: '🎯',
    name: 'Can They Qualify?',
    hook: 'Every path, every scenario',
    href: '/groups',
    highlight: true,
  },
  {
    icon: '🏆',
    name: 'Bracket Builder',
    hook: 'Pick all 31 knockout games, share your call',
    href: '/bracket',
  },
  {
    icon: '⚔️',
    name: 'If This Happens',
    hook: 'Toggle results, watch the table flip',
    href: '/groups',
  },
  {
    icon: '📊',
    name: 'Scout Players',
    hook: '1,248 player cards, head-to-head radar',
    href: '/players',
  },
  {
    icon: '📈',
    name: 'Glory Index',
    hook: 'Live power ranking of all 48 teams',
    href: '/rankings',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function FeatureShowcase() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section ref={ref} className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-dark-text-muted mb-4">
        Six ways to follow the Cup
      </h2>

      <motion.div
        className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        {FEATURES.map((f) => (
          <motion.div key={f.name} variants={cardVariants}>
            <Link
              href={f.href}
              className={`
                group flex flex-col gap-2 rounded-xl p-4
                bg-dark-surface border border-dark-border
                transition-all duration-200
                hover:border-dark-accent/60 hover:-translate-y-0.5
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                active:scale-[0.98]
                min-h-[44px]
                ${f.highlight
                  ? 'shadow-[0_0_20px_rgba(201,168,76,0.08)] border-dark-accent/30'
                  : ''
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none">{f.icon}</span>
                <span className="text-sm font-semibold text-dark-text-primary group-hover:text-dark-accent transition-colors">
                  {f.name}
                </span>
              </div>
              <p className="text-xs text-dark-text-muted leading-relaxed">
                {f.hook}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
