'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import type { Player } from '@/types';

const COLOR_A = '#f59e0b';
const COLOR_B = '#ef4444';

const ATTR_KEYS: (keyof Player['attrs'])[] = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];

interface Props {
  playerA: Player;
  playerB: Player;
  onClear: () => void;
}

export default function ComparisonPanel({ playerA, playerB, onClear }: Props) {
  const radarData = ATTR_KEYS.map((attr) => ({
    attr,
    A: playerA.attrs[attr],
    B: playerB.attrs[attr],
  }));

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden mb-4">
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border bg-dark-border/30">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-dark-text-muted">Head to Head</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-red-400 font-medium active:text-red-300"
        >
          Clear comparison
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-2">
        <div className="text-center">
          <span className="text-2xl">{playerA.flag}</span>
          <p className="text-sm font-semibold text-dark-text-primary mt-1 truncate">{playerA.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="badge-blue text-[10px] px-1.5 py-0.5 rounded">{playerA.pos}</span>
            <span className="text-[10px] text-dark-text-muted">{playerA.team}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-dark-bg" style={{ backgroundColor: COLOR_A }}>
            {playerA.ovr}
          </div>
        </div>
        <div className="text-center">
          <span className="text-2xl">{playerB.flag}</span>
          <p className="text-sm font-semibold text-dark-text-primary mt-1 truncate">{playerB.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="badge-red text-[10px] px-1.5 py-0.5 rounded">{playerB.pos}</span>
            <span className="text-[10px] text-dark-text-muted">{playerB.team}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white" style={{ backgroundColor: COLOR_B }}>
            {playerB.ovr}
          </div>
        </div>
      </div>

      <div className="px-2">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="#1f2937" />
            <PolarAngleAxis
              dataKey="attr"
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }}
            />
            <Radar
              name={playerA.name}
              dataKey="A"
              stroke={COLOR_A}
              fill={COLOR_A}
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name={playerB.name}
              dataKey="B"
              stroke={COLOR_B}
              fill={COLOR_B}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_A }} />
          <span className="text-[10px] font-medium text-dark-text-muted">{playerA.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_B }} />
          <span className="text-[10px] font-medium text-dark-text-muted">{playerB.name}</span>
        </div>
      </div>

      <div className="border-t border-dark-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-dark-border/30 border-b border-dark-border">
              <th className="text-right px-4 py-2 font-medium text-dark-text-muted w-1/3">{playerA.name.split(' ').pop()}</th>
              <th className="text-center px-2 py-2 font-medium text-dark-text-muted w-1/3">Attribute</th>
              <th className="text-left px-4 py-2 font-medium text-dark-text-muted w-1/3">{playerB.name.split(' ').pop()}</th>
            </tr>
          </thead>
          <tbody>
            {ATTR_KEYS.map((attr) => {
              const a = playerA.attrs[attr];
              const b = playerB.attrs[attr];
              const aWins = a > b;
              const bWins = b > a;
              return (
                <tr key={attr} className="border-b border-dark-border/50">
                  <td className={`text-right px-4 py-2.5 tabular-nums font-semibold ${aWins ? 'text-dark-accent' : 'text-dark-text-muted'}`}>
                    {a}
                  </td>
                  <td className="text-center px-2 py-2.5 font-bold text-dark-text-primary">{attr}</td>
                  <td className={`text-left px-4 py-2.5 tabular-nums font-semibold ${bWins ? 'text-red-400' : 'text-dark-text-muted'}`}>
                    {b}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className={`text-right px-4 py-2.5 tabular-nums font-bold ${playerA.ovr > playerB.ovr ? 'text-dark-accent' : 'text-dark-text-muted'}`}>
                {playerA.ovr}
              </td>
              <td className="text-center px-2 py-2.5 font-bold text-dark-text-primary">OVR</td>
              <td className={`text-left px-4 py-2.5 tabular-nums font-bold ${playerB.ovr > playerA.ovr ? 'text-red-400' : 'text-dark-text-muted'}`}>
                {playerB.ovr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
