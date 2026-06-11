'use client';

import { useState } from 'react';
import Link from 'next/link';

const STAGES = [
  {
    id: 'group',
    headline: '12 Groups · 4 Teams Each',
    detail:
      '48 teams are split into 12 groups of 4. Each team plays 3 matches. The top 2 from each group advance automatically. The 8 best third-placed teams also qualify — making 32 teams total in the knockout stage.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="9" cy="9" r="2.5" fill="#f59e0b" />
        <circle cx="19" cy="9" r="2.5" fill="#f59e0b" />
        <circle cx="9" cy="19" r="2.5" fill="#f59e0b" />
        <circle cx="19" cy="19" r="2.5" fill="#f59e0b" />
      </svg>
    ),
  },
  {
    id: 'r32',
    headline: '32 Teams · Single Elimination Begins',
    detail:
      "For the first time in World Cup history, there's a Round of 32. One loss and you're out. This is where upsets happen.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 5v4h5M4 19v4h5M9 7h4v14H9M13 14h4M17 10v8M17 14h4" />
      </svg>
    ),
  },
  {
    id: 'r16',
    headline: '16 Teams · No Second Chances',
    detail:
      "The surviving 16 teams. By now, every match has a story. One bad game ends a nation's dream.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
        <path d="M6 6v5h5M6 17v5h5M11 8.5h5v11H11M16 14h5" />
      </svg>
    ),
  },
  {
    id: 'qf',
    headline: '8 Teams · The World is Watching',
    detail: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 7v6h5M8 17v4h5M13 10h4v8H13M17 14h4" />
      </svg>
    ),
  },
  {
    id: 'sf',
    headline: '4 Teams · One Win From the Final',
    detail: null,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 8v5h5M10 18v3h5M15 10.5h3v7H15M18 14h3" />
      </svg>
    ),
  },
  {
    id: '3rd',
    headline: 'The Match Nobody Wants to Play',
    detail:
      "The two semi-final losers compete for third place. For most players, it's the last World Cup match of their career.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="11" r="6" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        <path d="M14 7v1.5l1.5 2L14 12l-1.5-1.5L14 8.5" fill="#f59e0b" />
        <rect x="10" y="18" width="8" height="3" rx="1" fill="#f59e0b" opacity="0.6" />
        <rect x="12" y="16" width="4" height="2" rx="0.5" fill="#f59e0b" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'final',
    headline: 'One Nation Brings It Home',
    detail: 'July 19, 2026 · MetLife Stadium, New Jersey',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M9 6h10l-1.5 6H10.5L9 6z" fill="#f59e0b" />
        <path d="M7 6h14" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="12" y="12" width="4" height="4" rx="0.5" fill="#f59e0b" opacity="0.6" />
        <rect x="10" y="16" width="8" height="2" rx="1" fill="#f59e0b" opacity="0.8" />
        <path d="M6 6c0-1 1-3 3-3M22 6c0-1-1-3-3-3" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const STAGE_LABELS = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter-Finals',
  'Semi-Finals',
  'Third Place',
  'The Final',
];

const WHATS_NEW = [
  {
    emoji: '🌍',
    title: '48 Teams',
    body: "Up from 32. More nations than ever get their moment on the world's biggest stage.",
  },
  {
    emoji: '🏟️',
    title: 'USA · Canada · Mexico',
    body: '16 venues across 3 countries. Matches from Vancouver to Guadalajara.',
  },
  {
    emoji: '🔀',
    title: 'The Third-Place Path',
    body: '8 of the 12 third-placed group teams advance — making qualification tighter and every group match count.',
  },
];

interface VenueEntry {
  city: string;
  stadium: string;
  capacity: string;
}

const VENUES: { country: string; flag: string; list: VenueEntry[] }[] = [
  {
    country: 'USA',
    flag: '🇺🇸',
    list: [
      { city: 'New York/New Jersey', stadium: 'MetLife Stadium', capacity: '82,500' },
      { city: 'Los Angeles', stadium: 'SoFi Stadium', capacity: '77,500' },
      { city: 'Dallas', stadium: 'AT&T Stadium', capacity: '80,000' },
      { city: 'San Francisco', stadium: "Levi's Stadium", capacity: '68,500' },
      { city: 'Miami', stadium: 'Hard Rock Stadium', capacity: '65,326' },
      { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium', capacity: '71,000' },
      { city: 'Seattle', stadium: 'Lumen Field', capacity: '68,740' },
      { city: 'Boston', stadium: 'Gillette Stadium', capacity: '65,878' },
      { city: 'Kansas City', stadium: 'Arrowhead Stadium', capacity: '76,416' },
      { city: 'Philadelphia', stadium: 'Lincoln Financial Field', capacity: '69,796' },
      { city: 'Houston', stadium: 'NRG Stadium', capacity: '72,220' },
    ],
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    list: [
      { city: 'Toronto', stadium: 'BMO Field', capacity: '45,000' },
      { city: 'Vancouver', stadium: 'BC Place', capacity: '54,500' },
    ],
  },
  {
    country: 'Mexico',
    flag: '🇲🇽',
    list: [
      { city: 'Mexico City', stadium: 'Estadio Azteca', capacity: '87,523' },
      { city: 'Guadalajara', stadium: 'Estadio Akron', capacity: '49,850' },
      { city: 'Monterrey', stadium: 'Estadio BBVA', capacity: '53,500' },
    ],
  },
];

const FAQS = [
  {
    q: 'What happens if teams are level on points in the group?',
    a: 'Tiebreakers go in this order: goal difference, goals scored, head-to-head result, fair play points, and finally a drawing of lots.',
  },
  {
    q: 'Is there extra time and penalties?',
    a: 'Yes — in all knockout rounds. If scores are level after 90 minutes, 30 minutes of extra time is played. If still level, a penalty shootout decides it.',
  },
  {
    q: 'When does the tournament start?',
    a: 'June 11, 2026. The Final is July 19, 2026 at MetLife Stadium in New Jersey.',
  },
  {
    q: 'Which teams have qualified?',
    a: 'All 48 teams are confirmed. Head to the Groups page to see every team.',
    link: { label: 'See all groups →', href: '/groups' },
  },
  {
    q: 'How is the bracket seeded?',
    a: "Groups are drawn by FIFA based on world rankings. Top seeds are kept apart in the draw to ensure the strongest teams don't meet until the later rounds.",
  },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function StageCard({
  stage,
  label,
  index,
  expanded,
  onToggle,
}: {
  stage: (typeof STAGES)[number];
  label: string;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-stretch gap-0 lg:flex-col lg:items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`
          text-left w-full rounded-2xl border p-4 transition-all duration-300 cursor-pointer
          ${expanded
            ? 'border-amber-500 bg-amber-950/20'
            : 'border-gray-800 bg-gray-900 hover:border-gray-700'
          }
        `}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            {stage.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-amber-500/70 font-medium mb-0.5">
              {label}
            </p>
            <p className="text-sm font-semibold text-gray-100 leading-snug">
              {stage.headline}
            </p>
          </div>
          <ChevronDown
            className={`shrink-0 text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180 text-amber-400' : ''}`}
          />
        </div>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: expanded ? '200px' : '0px', opacity: expanded ? 1 : 0 }}
        >
          {stage.detail && (
            <p className="text-sm text-gray-400 leading-relaxed mt-3 pl-[52px]">
              {stage.detail}
            </p>
          )}
        </div>
      </button>

      {index < STAGES.length - 1 && (
        <>
          {/* Vertical connector on mobile, horizontal on desktop */}
          <div className="flex items-center justify-center lg:hidden py-1 pl-7">
            <div className="w-px h-4 border-l border-dashed border-gray-700" />
          </div>
          <div className="hidden lg:flex items-center justify-center px-0 py-2">
            <div className="h-px w-6 border-t border-dashed border-gray-700" />
          </div>
        </>
      )}
    </div>
  );
}

function FAQItem({
  faq,
  open,
  onToggle,
}: {
  faq: (typeof FAQS)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 text-left cursor-pointer group"
      >
        <span className={`text-sm font-medium transition-colors duration-200 ${open ? 'text-amber-400' : 'text-gray-200 group-hover:text-gray-100'}`}>
          {faq.q}
        </span>
        <ChevronDown
          className={`shrink-0 ml-3 transition-transform duration-250 ${open ? 'rotate-180 text-amber-400' : 'text-gray-500'}`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-[250ms] ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}
      >
        <div className="pb-4 px-1">
          <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
          {faq.link && (
            <Link
              href={faq.link.href}
              className="inline-block mt-2 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
            >
              {faq.link.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FormatPage() {
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Section A: Page Header */}
      <section className="mb-12 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          How It Works
        </h1>
        <p className="text-lg text-amber-400 font-medium">
          The 2026 World Cup is unlike any before it.
        </p>
      </section>

      {/* Section B: Tournament Flow */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-gray-100 mb-5">
          Tournament Path
        </h2>
        <div className="flex flex-col lg:flex-row lg:items-start gap-0">
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.id}
              stage={stage}
              label={STAGE_LABELS[i]}
              index={i}
              expanded={expandedStage === stage.id}
              onToggle={() =>
                setExpandedStage(prev => (prev === stage.id ? null : stage.id))
              }
            />
          ))}
        </div>
      </section>

      {/* Section C: What's New in 2026 */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-gray-100 mb-5">
          What&apos;s New in 2026
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WHATS_NEW.map(card => (
            <div
              key={card.title}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
            >
              <span className="text-2xl mb-3 block">{card.emoji}</span>
              <h3 className="text-base font-semibold text-white mb-1.5">
                {card.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section D: Host Cities */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-gray-100 mb-5">
          Where the Games Are Played
        </h2>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {VENUES.map((group, gi) => (
            <div key={group.country} className={gi > 0 ? 'border-t border-gray-800' : ''}>
              <div className="flex items-center gap-2 px-5 py-3 bg-gray-900/80">
                <span className="text-lg">{group.flag}</span>
                <span className="text-sm font-semibold text-white tracking-wide uppercase">
                  {group.country}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({group.list.length} {group.list.length === 1 ? 'venue' : 'venues'})
                </span>
              </div>
              <div className="divide-y divide-gray-800/60">
                {group.list.map(v => (
                  <div key={v.stadium} className="flex items-center justify-between px-5 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-300 truncate">{v.stadium}</p>
                      <p className="text-xs text-gray-500">{v.city}</p>
                    </div>
                    <span className="text-sm text-gray-500 tabular-nums shrink-0 ml-4">
                      {v.capacity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section E: FAQ Accordion */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-gray-100 mb-5">
          Quick Answers
        </h2>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 px-5">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              open={openFAQ === i}
              onToggle={() => setOpenFAQ(prev => (prev === i ? null : i))}
            />
          ))}
        </div>
      </section>

      {/* Section F: CTA */}
      <section>
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 rounded-2xl p-8 sm:p-10 text-center">
          <p className="text-xl sm:text-2xl font-bold text-white mb-4">
            Now you know how it works — who do you think wins it?
          </p>
          <Link
            href="/bracket"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/20"
          >
            Pick the winners →
          </Link>
        </div>
      </section>
    </div>
  );
}
