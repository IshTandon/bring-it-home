'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Player } from '@/types';
import { getPlayerPhotoUrl } from '@/lib/playerUtils';
import FormStrip from '@/components/ui/FormStrip';

const ATTR_COLORS: Record<string, string> = {
  PAC: 'text-green-400',
  SHO: 'text-red-400',
  PAS: 'text-blue-400',
  DRI: 'text-amber-400',
  DEF: 'text-cyan-400',
  PHY: 'text-purple-400',
};

function attrBarColor(val: number) {
  if (val >= 90) return 'bg-green-500';
  if (val >= 75) return 'bg-lime-500';
  if (val >= 60) return 'bg-amber-400';
  return 'bg-red-400';
}

function HeatmapBar({ label, value }: { label: string; value: number }) {
  const intensity = Math.round((value / 100) * 255);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-medium text-dark-text-muted w-8 uppercase">{label}</span>
      <div className="flex-1 h-5 bg-dark-border rounded-md overflow-hidden">
        <div
          className="h-full rounded-md transition-all duration-500"
          style={{
            width: `${value}%`,
            background: `rgb(${intensity}, ${Math.max(50, 180 - intensity)}, ${Math.max(30, 120 - intensity / 2)})`,
          }}
        />
      </div>
      <span className="text-xs font-semibold text-dark-text-primary tabular-nums w-7 text-right">{value}</span>
    </div>
  );
}

function PlayerSilhouette({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="rgba(245,158,11,0.1)" />
      <circle cx="28" cy="21" r="8" fill="rgba(245,158,11,0.3)" />
      <path d="M28 31c-9 0-16 5-16 11v2h32v-2c0-6-7-11-16-11z" fill="rgba(245,158,11,0.3)" />
    </svg>
  );
}

function PlayerAvatar({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = player.apiId
    ? getPlayerPhotoUrl(player.apiId)
    : '/placeholder-player.svg';

  if (imgError || !player.apiId) {
    return (
      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
        <PlayerSilhouette size={56} />
      </div>
    );
  }

  return (
    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-dark-border flex-shrink-0">
      <Image
        src={photoSrc}
        alt={player.name}
        fill
        className="object-cover object-top"
        onError={() => setImgError(true)}
        unoptimized
      />
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  isCompareSelected?: boolean;
  onToggleCompare?: (player: Player) => void;
}

const PlayerCard = memo(function PlayerCard({ player, isCompareSelected, onToggleCompare }: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-dark-surface border rounded-xl overflow-hidden transition-colors
      ${isCompareSelected ? 'border-dark-accent ring-2 ring-dark-accent/20' : 'border-dark-border'}
    `}>
      <div className="relative group">
        <button
          type="button"
          className="w-full text-left active:bg-dark-border/30 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="relative">
              <PlayerAvatar player={player} />
              <span className="absolute -bottom-1 -right-1 bg-dark-accent text-dark-bg text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {player.ovr}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-text-primary truncate">{player.name}</p>
              <div className="flex items-center gap-2">
                <span className="badge-blue text-[10px] px-1.5 py-0.5 rounded">{player.pos}</span>
                <Link href={`/teams/${player.teamId}`} onClick={e => e.stopPropagation()}
                  className="text-[11px] text-dark-text-muted hover:text-dark-accent transition-colors">
                  {player.flag} {player.team}
                </Link>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-dark-text-muted transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>

          {player.formDetailed && (
            <div className="px-4 pb-2">
              <FormStrip results={player.formDetailed} />
            </div>
          )}

          <div className="grid grid-cols-6 gap-1.5 px-4 pb-3">
            {(Object.keys(player.attrs) as (keyof typeof player.attrs)[]).map((attr) => (
              <div key={attr} className="text-center">
                <div className="h-1.5 rounded-full bg-dark-border mb-1 overflow-hidden">
                  <div className={`h-full rounded-full ${attrBarColor(player.attrs[attr])}`} style={{ width: `${player.attrs[attr]}%` }} />
                </div>
                <span className={`text-[10px] font-bold tabular-nums ${ATTR_COLORS[attr]}`}>{player.attrs[attr]}</span>
                <p className="text-[8px] text-dark-text-muted font-medium">{attr}</p>
              </div>
            ))}
          </div>
        </button>

        {onToggleCompare && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(player); }}
            className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all
              sm:opacity-0 sm:group-hover:opacity-100
              ${isCompareSelected
                ? 'bg-dark-accent text-dark-bg'
                : 'bg-dark-surface/90 text-dark-text-muted border border-dark-border backdrop-blur-sm'}
            `}
          >
            {isCompareSelected ? '✓ Comparing' : 'Compare'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-dark-border px-4 py-4 space-y-4 bg-dark-bg/50">
          <p className="text-xs text-dark-text-muted leading-relaxed italic">&ldquo;{player.bio}&rdquo;</p>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-2">World Cup Stats</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="stat-box">
                <div className="stat-num text-base">{player.wcStats.goals}</div>
                <div className="stat-lbl">Goals</div>
              </div>
              <div className="stat-box">
                <div className="stat-num text-base">{player.wcStats.assists}</div>
                <div className="stat-lbl">Assists</div>
              </div>
              <div className="stat-box">
                <div className="stat-num text-base">{player.wcStats.rating}</div>
                <div className="stat-lbl">Rating</div>
              </div>
              <div className="stat-box">
                <div className="stat-num text-base">{player.wcStats.matches}</div>
                <div className="stat-lbl">Apps</div>
              </div>
            </div>
            {(player.wcStats.xG !== undefined || player.wcStats.passAccuracy !== undefined) && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {player.wcStats.xG !== undefined && (
                  <div className="stat-box">
                    <div className="stat-num text-base">{player.wcStats.xG}</div>
                    <div className="stat-lbl">xG</div>
                  </div>
                )}
                {player.wcStats.passAccuracy !== undefined && (
                  <div className="stat-box">
                    <div className="stat-num text-base">{player.wcStats.passAccuracy}%</div>
                    <div className="stat-lbl">Pass Acc</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-widest text-dark-text-muted mb-2">Pitch Presence</h4>
            <div className="space-y-1.5">
              <HeatmapBar label="ATK" value={player.heatmap.ATK} />
              <HeatmapBar label="MID" value={player.heatmap.MID} />
              <HeatmapBar label="DEF" value={player.heatmap.DEF} />
              <HeatmapBar label="WID" value={player.heatmap.WID} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default PlayerCard;
