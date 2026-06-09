'use client';

import { isMatchLive, isMatchFinished, formatMatchMinute } from '@/lib/matchUtils';
import MatchMinuteBadge from './MatchMinuteBadge';
import type { Match, MatchEvent, MatchStatus } from '@/types';

interface Props {
  match: Match;
}

function EventIcon({ type }: { type: MatchEvent['type'] }) {
  if (type === 'Goal') return <span className="text-xs">⚽</span>;
  if (type === 'Card') return <span className="text-xs">🟨</span>;
  return <span className="text-xs">🔄</span>;
}

function formatEventText(event: MatchEvent): string {
  if (event.type === 'Subst') {
    return `${event.player} (${event.team})`;
  }
  return `${event.player} (${event.team})`;
}

function StatBar({ homeValue, awayValue, label }: {
  homeValue: number; awayValue: number; label: string;
}) {
  const total = homeValue + awayValue || 1;
  const homePct = (homeValue / total) * 100;

  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-[10px] text-dark-text-muted">
        <span className="tabular-nums">{homeValue}{label === 'Possession' ? '%' : ''}</span>
        <span className="text-dark-text-muted">{label}</span>
        <span className="tabular-nums">{awayValue}{label === 'Possession' ? '%' : ''}</span>
      </div>
      <div className="flex h-1 rounded-full overflow-hidden bg-dark-border">
        <div
          className="bg-[#185FA5] rounded-l-full transition-all duration-500"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="bg-[#A32D2D] rounded-r-full transition-all duration-500"
          style={{ width: `${100 - homePct}%` }}
        />
      </div>
    </div>
  );
}

export default function LiveMatchCard({ match }: Props) {
  const live = isMatchLive(match.status);
  const finished = isMatchFinished(match.status);
  const hasScore = live || finished;
  const recentEvents = match.events.slice(-3).reverse();

  const homeXG = match.events.filter(e => e.type === 'Goal' && e.team === match.homeTeam.name).length * 0.85 + 0.3;
  const awayXG = match.events.filter(e => e.type === 'Goal' && e.team === match.awayTeam.name).length * 0.85 + 0.2;

  return (
    <div className={`bg-dark-surface border rounded-xl overflow-hidden shadow-sm
      ${live ? 'border-red-200 ring-1 ring-red-100' : 'border-dark-border'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-border/30 border-b border-dark-border">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dark-text-muted">
          {match.round}
        </span>
        <MatchMinuteBadge
          status={match.status as MatchStatus}
          minute={match.minute}
          time={match.time}
        />
      </div>

      {/* Teams & Score */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Home */}
          <div className="flex-1 text-center">
            <span className="text-2xl block">{match.homeTeam.flag}</span>
            <p className="text-sm font-semibold text-dark-text-primary mt-1 truncate">{match.homeTeam.name}</p>
            <p className="text-[10px] text-dark-text-muted">Rating {match.homeTeam.rating}</p>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center shrink-0">
            {hasScore ? (
              <>
                <span className={`text-3xl font-bold tabular-nums ${live ? 'text-dark-text-primary' : 'text-dark-text-primary'}`}>
                  {match.homeScore ?? 0} – {match.awayScore ?? 0}
                </span>
                {live && match.minute && (
                  <span className="text-xs text-red-500 font-semibold mt-0.5 tabular-nums">
                    {formatMatchMinute(match.minute, match.status)}
                  </span>
                )}
              </>
            ) : (
              <div className="text-center">
                <span className="text-xs text-dark-text-muted font-medium">vs</span>
                <p className="text-sm text-blue-600 font-semibold mt-0.5">{match.time}</p>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 text-center">
            <span className="text-2xl block">{match.awayTeam.flag}</span>
            <p className="text-sm font-semibold text-dark-text-primary mt-1 truncate">{match.awayTeam.name}</p>
            <p className="text-[10px] text-dark-text-muted">Rating {match.awayTeam.rating}</p>
          </div>
        </div>

        {/* Stat bars */}
        {hasScore && (
          <div className="mt-4 space-y-2">
            <StatBar homeValue={Number((homeXG).toFixed(1))} awayValue={Number((awayXG).toFixed(1))} label="xG" />
            <StatBar homeValue={live ? 54 : 50} awayValue={live ? 46 : 50} label="Possession" />
          </div>
        )}
      </div>

      {/* Events timeline */}
      {recentEvents.length > 0 && (
        <div className="border-t border-dark-border px-4 py-2.5 space-y-1.5">
          {recentEvents.map((event, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-dark-text-muted">
              <EventIcon type={event.type} />
              <span className="text-dark-text-muted tabular-nums font-medium w-8 shrink-0">
                {formatMatchMinute(event.minute, match.status === 'FT' ? '2H' : match.status)}
              </span>
              <span className="truncate">{formatEventText(event)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stadium */}
      <div className="border-t border-dark-border px-4 py-1.5 text-center">
        <span className="text-[10px] text-dark-text-muted">
          📍 {match.stadium}, {match.city}
        </span>
      </div>
    </div>
  );
}
