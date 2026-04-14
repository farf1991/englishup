'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import Heatmap from '@/components/Heatmap'
import ScoreChart from '@/components/ScoreChart'
import { generateBilanPDF } from '@/lib/pdf-report'
import type { Child, Session, BilanResult, Parent } from '@/types/database'

export default function ChildProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [child, setChild] = useState<Child | null>(null)
  const [parent, setParent] = useState<Parent | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [bilans, setBilans] = useState<BilanResult[]>([])
  const [tab, setTab] = useState<'overview' | 'sessions' | 'bilans'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: parentData } = await supabase.from('parents').select('*').eq('auth_id', user.id).single()
      if (!parentData) return
      setParent(parentData)

      const { data: childData } = await supabase.from('children').select('*').eq('parent_id', parentData.id).single()
      if (!childData) return
      setChild(childData)

      const [{ data: sessionData }, { data: bilanData }] = await Promise.all([
        supabase.from('sessions').select('*').eq('child_id', childData.id).order('completed_at', { ascending: false }),
        supabase.from('bilan_results').select('*').eq('child_id', childData.id).order('bilan_number'),
      ])
      setSessions(sessionData || [])
      setBilans(bilanData || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="mobile-container min-h-screen bg-[#F0FBFF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">⏳</div>
          <p className="text-gray-500 font-semibold">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!child) return null

  const pct = Math.round((child.current_session / 60) * 100)
  const avgScore = sessions.length > 0
    ? Math.round(sessions.reduce((a, s) => a + (s.score / Math.max(s.total_questions, 1)) * 100, 0) / sessions.length)
    : 0
  const totalTime = sessions.reduce((a, s) => a + (s.duration_sec || 0), 0)
  const totalHours = Math.floor(totalTime / 3600)
  const totalMins = Math.floor((totalTime % 3600) / 60)

  const levelLabel = { starter: 'A1 — Débutant', explorer: 'A2/B1 — Intermédiaire', champion: 'B1/B2 — Avancé' }

  return (
    <div className="mobile-container min-h-screen bg-[#F0F4F8] pb-10" style={{ fontFamily: 'var(--font-nunito)' }}>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#00B4D8] to-[#7B2FBE] px-5 pt-8 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Link href="/dashboard" className="text-xs text-white/60 font-semibold mb-2 block">← Dashboard</Link>
            <h1 className="text-2xl font-black text-white">{child.first_name} {child.last_name}</h1>
            <p className="text-sm text-white/70 font-semibold">{child.grade} · {child.school}</p>
            <p className="text-xs text-white/50 mt-1">{levelLabel[child.english_level]}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-4 py-3 text-center">
            <div className="text-3xl font-black text-white">{child.streak}</div>
            <div className="text-xs text-white/60 font-bold">🔥 streak</div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/12 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white/80 font-bold">Progression 60 sessions</span>
            <span className="text-sm text-white font-black">{pct}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 font-bold">
            <span>{child.current_session} sessions</span>
            <span className={child.current_session >= 30 ? 'text-yellow-300' : ''}>🧪 s.30</span>
            <span className={child.current_session >= 60 ? 'text-yellow-300' : ''}>🏆 s.60</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Sessions', value: child.current_session, icon: '📅' },
            { label: 'Score moy.', value: `${avgScore}%`, icon: '🎯' },
            { label: 'Temps total', value: totalHours > 0 ? `${totalHours}h${totalMins}` : `${totalMins}min`, icon: '⏱️' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-black text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-200 rounded-2xl p-1 mb-5">
          {([['overview', 'Vue générale'], ['sessions', 'Sessions'], ['bilans', 'Tests bilan']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all
                ${tab === k ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="space-y-4 animate-fadeUp">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">📅 Assiduité — 5 semaines</h3>
              <Heatmap sessions={sessions} />
            </div>
            {sessions.length >= 3 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">📈 Évolution des scores</h3>
                <ScoreChart sessions={[...sessions].reverse()} />
              </div>
            )}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">🏅 Badges ({child.current_session >= 1 ? Math.min(4, Math.floor(child.current_session / 10) + 1) : 0}/6)</h3>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: '⭐', label: 'Démarrage', unlocked: child.current_session >= 1 },
                  { icon: '🔥', label: '7 jours', unlocked: child.streak >= 7 },
                  { icon: '📖', label: '10 sessions', unlocked: child.current_session >= 10 },
                  { icon: '🚀', label: '30 sessions', unlocked: child.current_session >= 30 },
                  { icon: '🧪', label: 'Test bilan 1', unlocked: bilans.some(b => b.bilan_number === 1) },
                  { icon: '🏆', label: 'Programme fini', unlocked: child.current_session >= 60 },
                ].map((b, i) => (
                  <div key={i} className={`rounded-xl p-3 text-center transition-all ${b.unlocked ? 'bg-blue-50' : 'bg-gray-100 opacity-40'}`}>
                    <div className="text-2xl">{b.icon}</div>
                    <div className={`text-xs font-bold mt-1 ${b.unlocked ? 'text-blue-700' : 'text-gray-400'}`}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sessions tab */}
        {tab === 'sessions' && (
          <div className="space-y-2 animate-fadeUp">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 font-semibold">Aucune session complétée pour l'instant.</div>
            ) : sessions.map(s => {
              const pctScore = s.total_questions > 0 ? Math.round((s.score / s.total_questions) * 100) : 0
              return (
                <div key={s.id} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0
                    ${s.session_type === 'bilan' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.session_type === 'bilan' ? '🧪' : `S${s.session_number}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-900 text-sm">Session #{s.session_number}</span>
                      {s.session_type === 'bilan' && <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Test bilan</span>}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{format(new Date(s.completed_at), 'EEE d MMM yyyy', { locale: fr })}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-black ${pctScore >= 80 ? 'text-green-500' : pctScore >= 60 ? 'text-blue-500' : 'text-orange-500'}`}>
                      {pctScore}%
                    </div>
                    <div className="text-xs text-gray-400">+{s.xp_earned} XP</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bilans tab */}
        {tab === 'bilans' && (
          <div className="space-y-4 animate-fadeUp">
            {[1, 2].map(num => {
              const bilan = bilans.find(b => b.bilan_number === num)
              const isUnlocked = (num === 1 && child.current_session >= 30) || (num === 2 && child.current_session >= 60)
              return (
                <div key={num} className={`bg-white rounded-2xl p-6 shadow-sm ${!isUnlocked ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${bilan ? 'bg-amber-100' : 'bg-gray-100'}`}>
                      {bilan ? '🧪' : '🔒'}
                    </div>
                    <div>
                      <div className="font-black text-gray-900">Test Bilan #{num}</div>
                      <div className="text-xs text-gray-500">{num === 1 ? 'Débloqué à la session 30' : 'Débloqué à la session 60'}</div>
                    </div>
                    {bilan && (
                      <div className="ml-auto text-right">
                        <div className={`text-2xl font-black ${bilan.score_pct >= 80 ? 'text-green-500' : bilan.score_pct >= 60 ? 'text-blue-500' : 'text-orange-500'}`}>
                          {Math.round(bilan.score_pct)}%
                        </div>
                        <div className="text-xs text-gray-400">{bilan.score}/{bilan.total_questions}</div>
                      </div>
                    )}
                  </div>
                  {bilan ? (
                    <div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full" style={{ width: `${bilan.score_pct}%`, background: bilan.score_pct >= 80 ? '#06D6A0' : bilan.score_pct >= 60 ? '#00B4D8' : '#FF6B35' }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-4">
                        <span>Passé le {format(new Date(bilan.completed_at), 'dd/MM/yyyy')}</span>
                        <span>{bilan.score_pct >= 80 ? '🌟 Excellent' : bilan.score_pct >= 70 ? '👍 Bien' : bilan.score_pct >= 60 ? '✓ Satisfaisant' : '💪 À améliorer'}</span>
                      </div>
                      <button
                        onClick={() => child && parent && generateBilanPDF({ child, bilan, sessions, parentEmail: parent.email })}
                        className="w-full py-3 rounded-xl font-black text-sm"
                        style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B35)', color: '#1B1B1B' }}>
                        📄 Télécharger le rapport PDF
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      {isUnlocked ? (
                        <Link href="/bilan"
                          className="inline-block py-3 px-8 rounded-xl font-black text-sm text-white"
                          style={{ background: 'linear-gradient(135deg, #FF6B35, #FFD93D)', color: '#1B1B1B' }}>
                          Passer le test bilan →
                        </Link>
                      ) : (
                        <p className="text-gray-400 text-sm font-semibold">
                          🔒 Débloqué à la session {num === 1 ? 30 : 60}<br/>
                          <span className="text-xs text-gray-300">{num === 1 ? 30 - child.current_session : 60 - child.current_session} sessions restantes</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
