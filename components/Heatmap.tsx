'use client'

import { subDays, format, isToday } from 'date-fns'
import type { Session } from '@/types/database'

interface Props { sessions: Session[] }

export default function Heatmap({ sessions }: Props) {
  // Build last 35 days
  const days = Array.from({ length: 35 }, (_, i) => {
    const date = subDays(new Date(), 34 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const done = sessions.some(s => s.completed_at.startsWith(dateStr))
    return { date, dateStr, done, today: isToday(date) }
  })

  const weekLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekLabels.map((d, i) => (
          <div key={i} className="text-center text-xs font-bold text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div
            key={i}
            title={format(d.date, 'dd/MM')}
            className="heatmap-cell"
            style={{
              background: d.today
                ? '#00B4D8'
                : d.done
                ? '#E0F7FF'
                : '#F3F4F6',
              border: d.today ? '2px solid #00B4D8' : 'none',
            }}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        {[
          { color: '#E0F7FF', label: 'Session faite' },
          { color: '#F3F4F6', label: 'Manquée' },
          { color: '#00B4D8', label: 'Aujourd\'hui' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: l.color, border: l.color === '#00B4D8' ? '1.5px solid #00B4D8' : 'none' }} />
            <span className="text-xs text-gray-400 font-medium">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
