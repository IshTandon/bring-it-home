'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getQualificationStatus } from '@/lib/qualification-calc';
import type { MatchResult } from '@/lib/qualification-calc';
import type { Group, Match } from '@/types';
import { useUserPreferencesStore } from '@/lib/store';

interface QualificationCheckProps {
  teamId: string;
  group: Group;
  playedResults: MatchResult[];
  remainingMatches: Match[];
}

function CollapsibleSection({
  title,
  items,
  defaultExpanded = false,
  accentClass,
}: {
  title: string;
  items: string[];
  defaultExpanded?: boolean;
  accentClass: string;
}) {
  const [open, setOpen] = useState(defaultExpanded);

  if (items.length === 0) return null;

  return (
    <div className="border border-dark-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-dark-border/30 text-left"
      >
        <span className={`text-[11px] font-bold uppercase tracking-wide ${accentClass}`}>
          {title}
        </span>
        <span className={`text-xs transition-transform duration-200 ${accentClass} ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: open ? `${items.length * 48 + 16}px` : '0px' }}
      >
        <ul className="px-3 py-2 space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-dark-text-primary leading-relaxed">
              <span className="shrink-0 mt-0.5 text-dark-text-muted">•</span>
              <span className="break-words min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProbabilityBar({ probability }: { probability: number }) {
  const colorClass =
    probability >= 70 ? 'bg-green-500' :
    probability >= 30 ? 'bg-amber-400' :
    'bg-red-500';

  const labelColor =
    probability >= 70 ? 'text-green-400' :
    probability >= 30 ? 'text-amber-400' :
    'text-red-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted">
          Qualification probability
        </span>
        <span className={`text-sm font-bold tabular-nums ${labelColor}`}>
          {probability}%
        </span>
      </div>
      <div className="h-2.5 bg-dark-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${probability}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function QualificationCheck({
  teamId,
  group,
  playedResults,
  remainingMatches,
}: QualificationCheckProps) {
  const fanMode = useUserPreferencesStore(s => s.fanMode);
  const team = group.teams.find(t => t.id === teamId);
  const teamName = team ? team.name : teamId;

  const status = useMemo(
    () => getQualificationStatus(teamId, group, playedResults, remainingMatches),
    [teamId, group, playedResults, remainingMatches]
  );

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <h3 className="text-sm font-semibold text-dark-text-primary">
        Can {teamName} still qualify?
      </h3>
      {fanMode === 'new' && (
        <p className="text-[11px] text-dark-accent/80 -mt-2">
          Top 2 in each group qualify. Third place might sneak through.
        </p>
      )}

      {/* Big verdict */}
      {status.status === 'qualified' && (
        <div className="text-center py-3">
          <span className="text-lg font-bold text-green-400">✅ QUALIFIED</span>
        </div>
      )}
      {status.status === 'alive' && (
        <div className="text-center py-3">
          <span className="text-lg font-bold text-dark-accent">
            ✅ YES — here&apos;s what needs to happen
          </span>
        </div>
      )}
      {status.status === 'eliminated' && (
        <div className="text-center py-3">
          <span className="text-lg font-bold text-red-400">❌ ELIMINATED</span>
        </div>
      )}

      {/* Collapsible condition sections */}
      {status.status === 'alive' && (
        <div className="space-y-2">
          <CollapsibleSection
            title="GUARANTEED if:"
            items={status.guaranteedIf}
            accentClass="text-green-400"
          />
          <CollapsibleSection
            title="STILL POSSIBLE if:"
            items={status.possibleIf}
            accentClass="text-amber-400"
          />
          <CollapsibleSection
            title="ELIMINATED if:"
            items={status.eliminatedIf}
            accentClass="text-red-400"
          />
          {status.thirdPlaceDependent && (
            <p className="text-[11px] text-dark-text-muted italic px-1">
              May also advance as one of the 8 best third-placed teams
            </p>
          )}
        </div>
      )}

      {/* Probability bar */}
      <ProbabilityBar probability={status.probability} />
    </div>
  );
}
