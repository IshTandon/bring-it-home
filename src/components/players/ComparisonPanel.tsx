'use client';

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import type { Player } from '@/types';

const COLOR_A = '#185FA5';
const COLOR_B = '#A32D2D';

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
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Head to Head</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] text-red-500 font-medium active:text-red-700"
        >
          Clear comparison
        </button>
      </div>

      {/* Player names side by side */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-4 pb-2">
        <div className="text-center">
          <span className="text-2xl">{playerA.flag}</span>
          <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{playerA.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="badge-blue text-[10px] px-1.5 py-0.5 rounded">{playerA.pos}</span>
            <span className="text-[10px] text-gray-400">{playerA.team}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white" style={{ backgroundColor: COLOR_A }}>
            {playerA.ovr}
          </div>
        </div>
        <div className="text-center">
          <span className="text-2xl">{playerB.flag}</span>
          <p className="text-sm font-semibold text-gray-900 mt-1 truncate">{playerB.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="badge-red text-[10px] px-1.5 py-0.5 rounded">{playerB.pos}</span>
            <span className="text-[10px] text-gray-400">{playerB.team}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white" style={{ backgroundColor: COLOR_B }}>
            {playerB.ovr}
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div className="px-2">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="#e5e7eb" />
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

      {/* Legend */}
      <div className="flex justify-center gap-6 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_A }} />
          <span className="text-[10px] font-medium text-gray-600">{playerA.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_B }} />
          <span className="text-[10px] font-medium text-gray-600">{playerB.name}</span>
        </div>
      </div>

      {/* Stat-by-stat table */}
      <div className="border-t border-gray-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-right px-4 py-2 font-medium text-gray-400 w-1/3">{playerA.name.split(' ').pop()}</th>
              <th className="text-center px-2 py-2 font-medium text-gray-400 w-1/3">Attribute</th>
              <th className="text-left px-4 py-2 font-medium text-gray-400 w-1/3">{playerB.name.split(' ').pop()}</th>
            </tr>
          </thead>
          <tbody>
            {ATTR_KEYS.map((attr) => {
              const a = playerA.attrs[attr];
              const b = playerB.attrs[attr];
              const aWins = a > b;
              const bWins = b > a;
              return (
                <tr key={attr} className="border-b border-gray-50">
                  <td className={`text-right px-4 py-2.5 tabular-nums font-semibold ${aWins ? 'text-blue-700' : 'text-gray-500'}`}>
                    {a}
                  </td>
                  <td className="text-center px-2 py-2.5 font-bold text-gray-900">{attr}</td>
                  <td className={`text-left px-4 py-2.5 tabular-nums font-semibold ${bWins ? 'text-red-700' : 'text-gray-500'}`}>
                    {b}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className={`text-right px-4 py-2.5 tabular-nums font-bold ${playerA.ovr > playerB.ovr ? 'text-blue-700' : 'text-gray-500'}`}>
                {playerA.ovr}
              </td>
              <td className="text-center px-2 py-2.5 font-bold text-gray-900">OVR</td>
              <td className={`text-left px-4 py-2.5 tabular-nums font-bold ${playerB.ovr > playerA.ovr ? 'text-red-700' : 'text-gray-500'}`}>
                {playerB.ovr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
