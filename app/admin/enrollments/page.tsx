import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import AdminEnrollmentCard from '@/components/admin/AdminEnrollmentCard'
import Link from 'next/link'

export default async function EnrollmentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, children(*), parents(*)')
    .order('created_at', { ascending: false })

  const all = enrollments || []
  const pending = all.filter(e => e.payment_status === 'pending')
  const confirmed = all.filter(e => e.payment_status === 'confirmed')

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: 'var(--font-nunito)' }}>
      <div className="flex">
        <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 p-5 fixed top-0 left-0">
          <div className="mb-8">
            <div className="text-xl font-black">🌍 English<span className="text-yellow-400">Up</span></div>
            <div className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Admin Panel</div>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { href: '/admin', label: 'Vue globale', icon: '📊' },
              { href: '/admin/students', label: 'Élèves', icon: '👦' },
              { href: '/admin/enrollments', label: 'Inscriptions', icon: '📋', active: true },
              { href: '/admin/content', label: 'Contenu', icon: '📚' },
            ].map(n => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${n.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
                <span>{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="ml-60 flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black">Inscriptions</h1>
              <p className="text-sm text-gray-500 mt-0.5">{all.length} au total · {pending.length} en attente · {confirmed.length} actifs</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-yellow-500/15 border border-yellow-500/30 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-yellow-400">{pending.length}</div>
                <div className="text-xs text-yellow-600 font-bold">En attente</div>
              </div>
              <div className="bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-green-400">{confirmed.length * 379}</div>
                <div className="text-xs text-green-600 font-bold">DHS encaissés</div>
              </div>
            </div>
          </div>

          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-black text-yellow-400 mb-4">⏳ En attente de virement ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map(e => <AdminEnrollmentCard key={e.id} enrollment={e} />)}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-black text-green-400 mb-4">✅ Comptes actifs ({confirmed.length})</h2>
            {confirmed.length === 0
              ? <div className="bg-gray-900 rounded-xl p-8 text-center text-gray-500">Aucun compte actif.</div>
              : <div className="space-y-3">{confirmed.map(e => <AdminEnrollmentCard key={e.id} enrollment={e} />)}</div>
            }
          </div>
        </main>
      </div>
    </div>
  )
}
