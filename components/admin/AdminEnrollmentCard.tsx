'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface Props {
  enrollment: any
  compact?: boolean
}

export default function AdminEnrollmentCard({ enrollment: e, compact }: Props) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(e.payment_status)
  const child = e.children
  const parent = e.parents
  const isPending = status === 'pending'

  async function activate() {
    if (!confirm(`Activer le compte de ${child?.first_name} ? Virement reçu confirmé.`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId: e.id, childId: child?.id }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      toast.success(`✅ ${child?.first_name} activé !`)
      setStatus('confirmed')
    } catch {
      toast.error('Erreur lors de l\'activation')
    } finally {
      setLoading(false)
    }
  }

  const statusBadge = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    received: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
  }[status] || ''

  const statusLabel = { pending: '⏳ En attente', received: '👀 Reçu', confirmed: '✅ Actif' }[status] || status

  if (compact) {
    return (
      <div className={`flex items-center gap-4 py-3 px-4 rounded-xl border ${isPending ? 'border-yellow-900/30 bg-yellow-950/20' : 'border-gray-800 bg-gray-800/30'}`}>
        <div className={`text-xs font-black px-2.5 py-1 rounded-lg border flex-shrink-0 ${statusBadge}`}>{statusLabel}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white">{child?.first_name} {child?.last_name}</div>
          <div className="text-xs text-gray-500">{parent?.email} · {child?.grade}</div>
        </div>
        <div className="text-xs text-gray-600">{format(new Date(e.created_at), 'dd/MM')}</div>
        {isPending && (
          <button onClick={activate} disabled={loading}
            className="text-xs bg-green-500 hover:bg-green-400 text-white font-black px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0">
            {loading ? '...' : 'Activer'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`rounded-2xl p-5 border ${isPending ? 'bg-yellow-950/20 border-yellow-800/30' : 'bg-gray-900 border-gray-800'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${statusBadge}`}>{statusLabel}</span>
            <span className="text-xs text-gray-600">{format(new Date(e.created_at), 'dd/MM/yyyy à HH:mm')}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
            {[
              ['Enfant', `${child?.first_name} ${child?.last_name}`],
              ['Classe', child?.grade],
              ['École', child?.school],
              ['Groupe', child?.age_group],
              ['Email parent', parent?.email],
              ['Téléphone', parent?.phone],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-2">
                <span className="text-gray-500 flex-shrink-0">{label} :</span>
                <span className="font-bold text-white truncate">{val || '—'}</span>
              </div>
            ))}
            {status === 'confirmed' && (
              <>
                <div className="flex gap-2"><span className="text-gray-500">Sessions :</span><span className="font-black text-green-400">{child?.current_session}/60</span></div>
                <div className="flex gap-2"><span className="text-gray-500">Streak :</span><span className="font-black text-orange-400">🔥 {child?.streak}j</span></div>
              </>
            )}
          </div>
        </div>
        {isPending && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button onClick={activate} disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
              {loading ? 'Activation...' : '✅ Activer'}
            </button>
            <a href={`https://wa.me/${parent?.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="bg-green-900/30 border border-green-700/30 text-green-400 font-bold px-3 py-2 rounded-xl text-xs text-center hover:bg-green-800/30 transition-colors">
              📱 WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
