'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface RankingPoint {
  year: number;
  rank: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: RankingPoint }[] }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="font-bold tabular-nums">#{d.rank}</p>
      <p className="text-gray-300 tabular-nums">{d.year}</p>
    </div>
  );
}

export default function RankingChart({ history, currentRank }: { history: RankingPoint[]; currentRank: number }) {
  const best = useMemo(() => {
    let min = history[0];
    history.forEach(p => { if (p.rank < min.rank) min = p; });
    return min;
  }, [history]);

  const maxRank = useMemo(() => Math.max(...history.map(p => p.rank), 50), [history]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">FIFA Ranking History</h3>

      <div className="text-center mb-3">
        <p className="text-4xl font-bold text-gray-900 tabular-nums">#{currentRank}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Current FIFA Ranking</p>
        <p className="text-[11px] text-[#185FA5] font-medium mt-0.5 tabular-nums">
          Best: #{best.rank} ({best.year})
        </p>
      </div>

      <div className="w-full" style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rankFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e6f1fb" stopOpacity={1} />
                <stop offset="100%" stopColor="#e6f1fb" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              ticks={[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026]}
            />
            <YAxis
              reversed
              domain={[1, maxRank]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `#${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="rank"
              stroke="#185FA5"
              strokeWidth={2}
              fill="url(#rankFill)"
              dot={false}
              activeDot={{ r: 5, fill: '#185FA5', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
