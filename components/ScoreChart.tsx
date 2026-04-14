'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { format } from 'date-fns'
import type { Session } from '@/types/database'

interface Props { sessions: Session[] }

export default function ScoreChart({ sessions }: Props) {
  const data = sessions.slice(-20).map(s => ({
    name: `S${s.session_number}`,
    score: s.total_questions > 0 ? Math.round((s.score / s.total_questions) * 100) : 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
        <Tooltip
          contentStyle={{
            background: '#1B3A6B', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', color: '#fff', fontSize: 12, fontWeight: 700,
          }}
          formatter={(v: number) => [`${v}%`, 'Score']}
        />
        <ReferenceLine y={70} stroke="#06D6A0" strokeDasharray="4 4" strokeOpacity={0.5} />
        <Line
          type="monotone" dataKey="score"
          stroke="#00B4D8" strokeWidth={2.5}
          dot={{ fill: '#00B4D8', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#FFD93D' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
