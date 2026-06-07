'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface StatsChartProps {
  teamGoals: number;
  teamName: string;
  groupAvg: number;
  tournamentAvg: number;
}

export default function StatsChart({ teamGoals, teamName, groupAvg, tournamentAvg }: StatsChartProps) {
  const data = [
    { label: teamName, value: teamGoals, fill: '#185FA5' },
    { label: 'Group avg', value: groupAvg, fill: '#D1D5DB' },
    { label: 'Tournament avg', value: tournamentAvg, fill: '#D1D5DB' },
  ];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} barCategoryGap="25%">
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
        />
        <YAxis hide domain={[0, 'auto']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
