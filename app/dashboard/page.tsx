import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { format, subDays, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import type { Child, Session, Enrollment } from '@/types/database'
import LogoutButton from '@/components/LogoutButton'
import Heatmap from '@/components/Heatmap'
import ScoreChart from '@/components/ScoreChart'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch parent + children
  const { data: parent } = await supabase
    .from('parents')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (!parent) redirect('/auth/login')

  const { data: children } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', parent.id)

  const child: Child | null = children?.[0] || null

  if (!child) redirect('/auth/register')

  // Si compte en attente
  if (child.status === 'pending') redirect('/dashboard/pending')

  // Fetch sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('child_id', child.id)
    .order('completed_at', { ascending: false })

  // Fetch enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('*')
    .eq('child_id', child.id)
    .single()

  const allSessions: Session[] = sessions || []

  // Calculs
  const completedCount = child.current_session
  const pct = Math.round((completedCount / 60) * 100)
  const sessionsThisWeek = allSessions.filter(s => {
    const d = new Date(s.completed_at)
    return d >= subDays(new Date(), 7)
  }).length
  const avgScore = allSessions.length > 0
    ? Math.round(allSessions.reduce((a, s) => a + (s.score / Math.max(s.total_questions, 1)) * 100, 0) / allSessions.length)
    : 0

  const lastSessionDate = child.last_session_at ? new Date(child.last_session_at) : null
  const sessionToday = lastSessionDate && isToday(lastSessionDate)
  const missedDays = !sessionToday && lastSessionDate
    ? Math.floor((Date.now() - lastSessionDate.getTime()) / 86400000)
    : 0

  const ageGroupLabel = { explorer: 'Explorers 🦁', adventurer: 'Adventurers 🚀', champion: 'Champions 🎯' }

  return (
    <div className="mobile-container bg-[#F0F4F8] min-h-screen pb-8">

      {/* HEADER gradient */}
      <div className="bg-gradient-to-br from-[#00B4D8] to-[#7B2FBE] px-5 pt-10 pb-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-xs text-white/60 font-semibold mb-0.5">Dashboard parent</p>
            <h1 className="text-2xl font-black text-white">{child.first_name} {child.last_name}</h1>
            <p className="text-sm text-white/70 font-semibold">
              {ageGroupLabel[child.age_group]} · {child.grade} · {child.school}
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-3 text-center">
            <div className="text-2xl">🔥</div>
            <div className="text-xl font-black text-white">{child.streak}</div>
            <div className="text-xs text-white/60 font-bold">jours</div>
          </div>
        </div>

        {/* Session alert */}
        {missedDays >= 2 && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-white font-bold">
              {child.first_name} n'a pas fait de session depuis {missedDays} jours !
            </p>
          </div>
        )}
        {sessionToday && (
          <div className="bg-green-500/20 border border-green-400/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="text-sm text-white font-bold">{child.first_name} a fait sa session aujourd'hui !</p>
          </div>
        )}

        {/* 60 sessions progress */}
        <div className="bg-white/10 rounded-2xl px-4 py-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/80 font-bold">Programme 60 sessions</span>
            <span className="text-sm text-white font-black">{completedCount}/60</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2 relative">
            <div className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }} />
            {/* Milestone marker at session 30 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white"
              style={{ background: completedCount >= 30 ? '#FFD93D' : 'rgba(255,255,255,0.3)' }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 font-bold">
            <span>Début</span>
            <span className={completedCount >= 30 ? 'text-yellow-300' : ''}>🧪 Test 1 (s.30)</span>
            <span className={completedCount >= 60 ? 'text-yellow-300' : ''}>🏆 Test 2 (s.60)</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-4">

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Sessions faites', value: `${completedCount}/60`, sub: `${sessionsThisWeek} cette semaine`, icon: '📅' },
            { label: 'Score moyen', value: `${avgScore}%`, sub: allSessions.length > 0 ? `sur ${allSessions.length} sessions` : 'Aucune session', icon: '📊' },
            { label: 'Streak actuel', value: `${child.streak} jours`, sub: child.streak >= 7 ? '🔥 Incroyable !' : 'Continue !', icon: '🔥' },
            { label: 'XP total', value: child.total_xp.toLocaleString(), sub: 'points gagnés', icon: '⚡' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs font-bold text-gray-500">{s.label}</div>
              <div className="text-xs text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Heatmap assiduité */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-black text-gray-900 mb-4">📅 Assiduité — 5 semaines</h2>
          <Heatmap sessions={allSessions} />
        </div>

        {/* Score chart */}
        {allSessions.length >= 3 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-black text-gray-900 mb-4">📈 Évolution des scores</h2>
            <ScoreChart sessions={allSessions.slice().reverse()} />
          </div>
        )}

        {/* Prochain test bilan */}
        {completedCount < 30 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">🧪</span>
            <div>
              <p className="font-black text-amber-900 text-sm">Test bilan 1 dans {30 - completedCount} sessions</p>
              <p className="text-xs text-amber-700">Un rapport PDF vous sera envoyé après le test.</p>
            </div>
          </div>
        )}
        {completedCount >= 30 && completedCount < 60 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="font-black text-green-900 text-sm">Test bilan 2 dans {60 - completedCount} sessions</p>
              <p className="text-xs text-green-700">Dernière ligne droite !</p>
            </div>
          </div>
        )}
        {completedCount >= 60 && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-4">
            <span className="text-3xl">🎓</span>
            <div>
              <p className="font-black text-purple-900 text-sm">Programme terminé !</p>
              <p className="text-xs text-purple-700">Certificat disponible · Félicitations à {child.first_name} !</p>
            </div>
          </div>
        )}

        {/* Alertes SMS info */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-xl">📱</span>
          <div>
            <p className="text-sm font-black text-blue-900">Alertes SMS actives</p>
            <p className="text-xs text-blue-700">SMS envoyé si {child.first_name} manque 2 sessions consécutives.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/session`}
            className="bg-gradient-to-r from-[#00B4D8] to-[#7B2FBE] rounded-2xl p-4 text-center text-white font-black text-sm shadow-lg">
            ▶ Lancer la session de {child.first_name}
          </Link>
          <LogoutButton />
        </div>

      </div>
    </div>
  )
}
