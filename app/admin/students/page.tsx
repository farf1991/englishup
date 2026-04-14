// @ts-nocheck
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'

export default async function StudentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const { data: children } = await supabase
    .from('children')
    .select('*, parents(*), sessions(count), bilan_results(*)')
    .order('current_session', { ascending: false })

  const all = children || []
  const active = all.filter(c => c.status === 'active')
  const pending = all.filter(c => c.status === 'pending')

  const AGE_GROUP_COLOR: Record<string, string> = {
    explorer: 'text-orange-400 bg-orange-500/15',
    adventurer: 'text-blue-400 bg-blue-500/15',
    champion: 'text-green-400 bg-green-500/15',
  }
  const LEVEL_COLOR: Record<string, string> = {
    starter: 'text-gray-400',
    explorer: 'text-blue-400',
    champion: 'text-purple-400',
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: 'var(--font-nunito)' }}>
      <div className="flex">
        <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 p-5 fixed top-0 left-0">
          <div className="mb-8">
            <div className="text-xl font-black">🌍 English<span className="text-yellow-400">Up</span></div>
            <div className="text-xs text-gray-500 mt-1 font-semibold uppercase">Admin Panel</div>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { href: '/admin', label: 'Vue globale', icon: '📊' },
              { href: '/admin/students', label: 'Élèves', icon: '👦', active: true },
              { href: '/admin/enrollments', label: 'Inscriptions', icon: '📋' },
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
          <div className="mb-8">
            <h1 className="text-2xl font-black">Élèves</h1>
            <p className="text-sm text-gray-500 mt-0.5">{active.length} actifs · {pending.length} en attente · {all.length} total</p>
          </div>

          {/* Active students table */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="font-black text-green-400">✅ Élèves actifs ({active.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['Élève', 'Groupe', 'Niveau', 'Progression', 'XP', 'Streak', 'Dernière session', 'Bilan'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {active.map(c => {
                    const pct = Math.round((c.current_session / 60) * 100)
                    const bilansPassed = c.bilan_results?.length || 0
                    const lastSession = c.last_session_at ? new Date(c.last_session_at) : null
                    const daysSince = lastSession ? Math.floor((Date.now() - lastSession.getTime()) / 86400000) : null
                    return (
                      <tr key={c.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-black text-white">{c.first_name} {c.last_name}</div>
                          <div className="text-xs text-gray-500">{c.grade} · {c.school?.slice(0, 20)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${AGE_GROUP_COLOR[c.age_group] || ''}`}>
                            {c.age_group}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold capitalize ${LEVEL_COLOR[c.english_level] || ''}`}>
                            {c.english_level}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-blue-400 font-black">{c.current_session}/60</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-yellow-400 font-black">⚡ {c.total_xp?.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-black text-sm ${c.streak >= 7 ? 'text-orange-400' : 'text-gray-400'}`}>
                            🔥 {c.streak}j
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {daysSince !== null ? (
                            <span className={`text-xs font-bold ${daysSince === 0 ? 'text-green-400' : daysSince <= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {daysSince === 0 ? 'Aujourd\'hui' : `Il y a ${daysSince}j`}
                            </span>
                          ) : <span className="text-gray-600 text-xs">Jamais</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-black px-2 py-1 rounded-lg ${bilansPassed === 2 ? 'bg-purple-500/20 text-purple-400' : bilansPassed === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-500'}`}>
                            {bilansPassed}/2 passés
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {active.length === 0 && (
                <div className="text-center py-12 text-gray-500">Aucun élève actif.</div>
              )}
            </div>
          </div>

          {/* Pending students */}
          {pending.length > 0 && (
            <div className="bg-gray-900 rounded-2xl border border-yellow-900/30 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="font-black text-yellow-400">⏳ En attente d'activation ({pending.length})</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {pending.map(c => (
                  <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <div className="font-black text-white">{c.first_name} {c.last_name}</div>
                      <div className="text-xs text-gray-500">{c.grade} · {c.school}</div>
                    </div>
                    <Link href="/admin/enrollments" className="text-xs bg-yellow-500/20 text-yellow-400 font-bold px-3 py-1.5 rounded-xl hover:bg-yellow-500/30">
                      Activer →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
