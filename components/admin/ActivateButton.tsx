'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  enrollmentId: string
  childId: string
  parentEmail: string
  childName: string
}

export default function ActivateButton({ enrollmentId, childId, parentEmail, childName }: Props) {
  const [loading, setLoading] = useState(false)

  async function activate() {
    if (!confirm(`Activer le compte de ${childName} ? (virement reçu confirmé)`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, childId }),
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      toast.success(`✅ ${childName} activé !`)
      window.location.reload()
    } catch {
      toast.error('Erreur lors de l\'activation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={activate} disabled={loading}
      className="text-xs bg-green-500 hover:bg-green-400 text-white font-black px-4 py-2 rounded-xl transition-colors disabled:opacity-50 whitespace-nowrap">
      {loading ? 'Activation...' : '✅ Activer'}
    </button>
  )
}
