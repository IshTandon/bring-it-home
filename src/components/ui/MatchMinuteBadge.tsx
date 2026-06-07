'use client';

import { formatMatchMinute, isMatchLive } from '@/lib/matchUtils';
import type { MatchStatus } from '@/types';

interface Props {
  status: MatchStatus;
  minute?: number;
  time?: string;
}

export default function MatchMinuteBadge({ status, minute, time }: Props) {
  const live = isMatchLive(status);
  const label = status === 'NS'
    ? (time ?? '')
    : formatMatchMinute(minute ?? 0, status);

  if (status === 'NS') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold tabular-nums">
        {label}
      </span>
    );
  }

  if (status === 'HT') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">
        HT
      </span>
    );
  }

  if (status === 'FT') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
        FT
      </span>
    );
  }

  if (live) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold tabular-nums">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
        </span>
        {label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold tabular-nums">
      {label}
    </span>
  );
}
