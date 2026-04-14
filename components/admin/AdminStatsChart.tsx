'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { date: string; count: number }[]
}

export default function AdminStatsChart({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#4B5563' }}
          interval={4}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#4B5563' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
          }}
          formatter={(v: number) => [v, 'sessions']}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.count === 0 ? '#1F2937' : d.count >= max * 0.7 ? '#00B4D8' : '#1D4ED8'}
              opacity={d.count === 0 ? 0.4 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
