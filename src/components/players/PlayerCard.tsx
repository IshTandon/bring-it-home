'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Player } from '@/types';
import { getPlayerPhotoUrl } from '@/lib/playerUtils';
import FormStrip from '@/components/ui/FormStrip';

const ATTR_COLORS: Record<string, string> = {
  PAC: 'text-green-600',
  SHO: 'text-red-600',
  PAS: 'text-blue-600',
  DRI: 'text-amber-600',
  DEF: 'text-cyan-700',
  PHY: 'text-purple-600',
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
      <span className="text-[10px] font-medium text-gray-500 w-8 uppercase">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-md overflow-hidden">
        <div
          className="h-full rounded-md transition-all duration-500"
          style={{
            width: `${value}%`,
            background: `rgb(${intensity}, ${Math.max(50, 180 - intensity)}, ${Math.max(30, 120 - intensity / 2)})`,
          }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-600 tabular-nums w-7 text-right">{value}</span>
    </div>
  );
}

function PlayerAvatar({ player }: { player: Player }) {
  const [imgError, setImgError] = useState(false);
  const photoSrc = player.apiId
    ? getPlayerPhotoUrl(player.apiId)
    : '/placeholder-player.svg';

  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  if (imgError) {
    return (
      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-500">{initials}</span>
      </div>
    );
  }

  return (
    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
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
    <div className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-colors
      ${isCompareSelected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}
    `}>
      <div className="relative group">
        <button
          type="button"
          className="w-full text-left active:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="relative">
              <PlayerAvatar player={player} />
              <span className="absolute -bottom-1 -right-1 bg-gray-900 text-white text-[10px] font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {player.ovr}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{player.name}</p>
              <div className="flex items-center gap-2">
                <span className="badge-blue text-[10px] px-1.5 py-0.5 rounded">{player.pos}</span>
                <Link href={`/teams/${player.teamId}`} onClick={e => e.stopPropagation()}
                  className="text-[11px] text-gray-400 hover:text-[#185FA5] transition-colors">
                  {player.flag} {player.team}
                </Link>
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}
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
                <div className="h-1.5 rounded-full bg-gray-100 mb-1 overflow-hidden">
                  <div className={`h-full rounded-full ${attrBarColor(player.attrs[attr])}`} style={{ width: `${player.attrs[attr]}%` }} />
                </div>
                <span className={`text-[10px] font-bold tabular-nums ${ATTR_COLORS[attr]}`}>{player.attrs[attr]}</span>
                <p className="text-[8px] text-gray-400 font-medium">{attr}</p>
              </div>
            ))}
          </div>
        </button>

        {/* Compare toggle — visible on hover/tap */}
        {onToggleCompare && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(player); }}
            className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all
              sm:opacity-0 sm:group-hover:opacity-100
              ${isCompareSelected
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-gray-500 border border-gray-200 backdrop-blur-sm'}
            `}
          >
            {isCompareSelected ? '✓ Comparing' : 'Compare'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50/50">
          <p className="text-xs text-gray-600 leading-relaxed italic">&ldquo;{player.bio}&rdquo;</p>

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-2">World Cup Stats</h4>
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
            <h4 className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-2">Pitch Presence</h4>
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
