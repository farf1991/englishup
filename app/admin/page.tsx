import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { format, subDays, startOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import AdminEnrollmentCard from '@/components/admin/AdminEnrollmentCard'
import AdminStatsChart from '@/components/admin/AdminStatsChart'

export const revalidate = 60

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) redirect('/')

  const [
    { data: enrollments },
    { data: allChildren },
    { data: allSessions },
    { data: allBilans },
    { data: recentNotifs },
  ] = await Promise.all([
    supabase.from('enrollments').select('*, children(*), parents(*)').order('created_at', { ascending: false }),
    supabase.from('children').select('*'),
    supabase.from('sessions').select('*').order('completed_at', { ascending: false }),
    supabase.from('bilan_results').select('*'),
    supabase.from('notifications').select('*').order('sent_at', { ascending: false }).limit(20),
  ])

  const all = enrollments || []
  const children = allChildren || []
  const sessions = allSessions || []
  const bilans = allBilans || []

  const pending = all.filter((e: any) => (e as any).payment_status === 'pending')
  const active = all.filter((e: any) => (e as any).payment_status === 'confirmed')
  const totalRevenueDHS = active.length * 379

  const activeChildren = children.filter((c: any) => (c as any).status === 'active')
  const avgCompletion = activeChildren.length > 0
    ? Math.round(activeChildren.reduce((a, c) => a + (c.current_session / 60) * 100, 0) / activeChildren.length)
    : 0

  const sessionsThisWeek = sessions.filter(s => new Date(s.completed_at) >= subDays(new Date(), 7))
  const sessionsThisMonth = sessions.filter(s => new Date(s.completed_at) >= startOfMonth(new Date()))
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + (s.score / Math.max(s.total_questions, 1)) * 100, 0) / sessions.length)
    : 0

  const completedPrograms = children.filter((c: any) => c.current_session >= 60).length
  const atRisk = activeChildren.filter(c => {
    if (!c.last_session_at) return true
    return Math.floor((Date.now() - new Date(c.last_session_at).getTime()) / 86400000) >= 3
  })

  const sessionsByDay = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const count = sessions.filter(s => s.completed_at?.startsWith(dateStr)).length
    return { date: format(date, 'dd/MM', { locale: fr }), count }
  })

  const NAV = [
    { href: '/admin', label: 'Vue globale', icon: '📊', active: true },
    { href: '/admin/students', label: 'Élèves', icon: '👦' },
    { href: '/admin/enrollments', label: 'Inscriptions', icon: '📋' },
    { href: '/admin/content', label: 'Contenu', icon: '📚' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex" style={{ fontFamily: 'var(--font-nunito)' }}>

      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 p-5 flex flex-col fixed top-0 left-0">
        <div className="mb-8">
          <div className="text-xl font-black">🌍 English<span className="text-yellow-400">Up</span></div>
          <div className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Admin Panel</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                ${n.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-600 truncate">{user.email}</p>
          <Link href="/" className="text-xs text-gray-500 hover:text-white mt-1 block">← Voir le site</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-8 overflow-x-hidden">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">Vue globale</h1>
            <p className="text-sm text-gray-500 mt-0.5">{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</p>
          </div>
          {pending.length > 0 && (
            <Link href="/admin/enrollments"
              className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-black px-4 py-2 rounded-xl text-sm hover:bg-yellow-500/30 transition-colors">
              <span className="bg-red-500 text-white rounded-full w-5 h-5 inline-flex items-center justify-center text-xs">{pending.length}</span>
              Virements en attente
            </Link>
          )}
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Revenus totaux', value: `${totalRevenueDHS.toLocaleString()} DHS`, sub: `${active.length} programmes`, icon: '💰', col: 'text-yellow-400', bg: 'bg-yellow-500/8 border-yellow-500/20' },
            { label: 'Élèves actifs', value: active.length, sub: `${pending.length} en attente`, icon: '👦', col: 'text-blue-400', bg: 'bg-blue-500/8 border-blue-500/20' },
            { label: 'Sessions totales', value: sessions.length, sub: `${sessionsThisWeek.length} cette semaine`, icon: '📚', col: 'text-green-400', bg: 'bg-green-500/8 border-green-500/20' },
            { label: 'Score moyen QCM', value: `${avgScore}%`, sub: `${completedPrograms} prog. terminés`, icon: '🎯', col: 'text-purple-400', bg: 'bg-purple-500/8 border-purple-500/20' },
          ].map((k, i) => (
            <div key={i} className={`rounded-2xl p-5 border ${k.bg}`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{k.icon}</span>
                <span className="text-xs text-gray-600 font-semibold text-right">{k.sub}</span>
              </div>
              <div className={`text-3xl font-black ${k.col} mb-1`}>{k.value}</div>
              <div className="text-xs text-gray-500 font-semibold">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Chart + Side stats */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div className="col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black">📈 Sessions par jour — 30 jours</h2>
              <span className="text-sm text-gray-500 font-bold">{sessionsThisMonth.length} ce mois</span>
            </div>
            <AdminStatsChart data={sessionsByDay} />
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
            <h2 className="font-black">📊 Santé du programme</h2>
            {[
              { l: 'Complétion moy.', v: `${avgCompletion}%`, pct: avgCompletion, col: '#00B4D8' },
              { l: 'Prog. terminés', v: completedPrograms, pct: activeChildren.length > 0 ? (completedPrograms / activeChildren.length) * 100 : 0, col: '#06D6A0' },
              { l: 'Tests bilan passés', v: bilans.length, pct: activeChildren.length > 0 ? Math.min(100, (bilans.length / (activeChildren.length * 2)) * 100) : 0, col: '#FFD93D' },
              { l: 'Élèves à risque', v: atRisk.length, pct: activeChildren.length > 0 ? (atRisk.length / activeChildren.length) * 100 : 0, col: '#EF4444' },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400 font-semibold">{s.l}</span>
                  <span className="text-sm font-black" style={{ color: s.col }}>{s.v}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, s.pct)}%`, background: s.col }} />
                </div>
              </div>
            ))}
            <div className="mt-auto pt-4 border-t border-gray-800">
              <div className="text-xs text-gray-500 mb-1 font-semibold">REVENU ESTIMÉ / MOIS</div>
              <div className="text-2xl font-black text-yellow-400">{Math.round(active.length * 379 / Math.max(1, Math.ceil(active.length / 4))).toLocaleString()} DHS</div>
            </div>
          </div>
        </div>

        {/* At-risk alert */}
        {atRisk.length > 0 && (
          <div className="bg-red-950/40 border border-red-800/40 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="font-black text-red-400">{atRisk.length} élève(s) à risque de décrochage</h2>
                <p className="text-xs text-red-700">Pas de session depuis 3+ jours — SMS automatique envoyé à J+2</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {atRisk.map(c => {
                const days = c.last_session_at ? Math.floor((Date.now() - new Date(c.last_session_at).getTime()) / 86400000) : 999
                return (
                  <div key={c.id} className="bg-gray-900/60 rounded-xl p-3 border border-red-900/30">
                    <div className="font-black text-sm text-white">{c.first_name} {c.last_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.grade} · s.{c.current_session}/60</div>
                    <div className="text-xs text-red-400 font-bold mt-1.5">
                      {days >= 999 ? '⛔ Jamais commencé' : `⏳ ${days}j sans session`}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom grid */}
        <div className="grid grid-cols-2 gap-5">
          {/* Top students */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="font-black mb-4">🏆 Classement — Sessions</h2>
            <div className="space-y-3">
              {[...activeChildren].sort((a, b) => b.current_session - a.current_session).slice(0, 6).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                    ${i === 0 ? 'bg-yellow-500 text-gray-900' : i === 1 ? 'bg-gray-400 text-gray-900' : i === 2 ? 'bg-orange-700 text-white' : 'bg-gray-800 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-black text-white truncate">{c.first_name} {c.last_name}</span>
                      <span className="text-xs text-blue-400 font-black">{c.current_session}/60</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${(c.current_session / 60) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {activeChildren.length === 0 && <p className="text-gray-600 text-sm">Aucun élève actif.</p>}
            </div>
          </div>

          {/* Recent notifications */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="font-black mb-4">🔔 Dernières notifications</h2>
            <div className="space-y-2.5">
              {(recentNotifs || []).slice(0, 7).map((n: any) => (
                <div key={n.id} className="flex items-start gap-2.5 pb-2.5 border-b border-gray-800 last:border-0">
                  <span className="text-base flex-shrink-0 mt-0.5">
                    {n.type === 'missed_session' ? '⚠️' : n.type === 'activation' ? '✅' : n.type === 'bilan_ready' ? '📄' : '👋'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-300 font-semibold leading-relaxed truncate">{n.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{format(new Date(n.sent_at), 'dd/MM à HH:mm')}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0
                    ${n.status === 'sent' ? 'bg-green-900/40 text-green-500' : 'bg-red-900/40 text-red-500'}`}>
                    {n.status === 'sent' ? '✓' : '✗'}
                  </span>
                </div>
              ))}
              {(!recentNotifs || recentNotifs.length === 0) && <p className="text-gray-600 text-sm">Aucune notification envoyée.</p>}
            </div>
          </div>
        </div>

        {/* Recent enrollments */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black">📋 Inscriptions récentes</h2>
            <Link href="/admin/enrollments" className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors">Voir toutes →</Link>
          </div>
          <div className="space-y-2">
            {all.slice(0, 5).map(e => (
              <AdminEnrollmentCard key={e.id} enrollment={e} compact />
            ))}
            {all.length === 0 && <p className="text-gray-500 text-sm">Aucune inscription.</p>}
          </div>
        </div>

      </main>
    </div>
  )
}
