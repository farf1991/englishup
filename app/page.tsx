// @ts-nocheck
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const STARS = Array.from({ length: 22 }, (_, i) => ({
  left: `${4 + (i * 43) % 92}%`,
  top: `${3 + (i * 37) % 85}%`,
  size: i % 4 === 0 ? 4 : 2,
  opacity: 0.15 + (i % 6) * 0.08,
  dur: 2 + (i % 3),
  del: (i % 5) * 0.6,
}))

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Si déjà connecté → dashboard
  if (user) redirect('/dashboard')

  return (
    <div className="mobile-container min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-10"
      style={{ background: 'linear-gradient(160deg, #040D1A 0%, #1B3A6B 55%, #0A3251 100%)' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.7} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
      `}</style>

      {/* Stars */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: s.left, top: s.top,
          width: s.size, height: s.size, borderRadius: '50%',
          background: '#fff', opacity: s.opacity,
          animation: `twinkle ${s.dur}s ease-in-out infinite`,
          animationDelay: `${s.del}s`,
        }} />
      ))}

      {/* Logo */}
      <div className="text-center mb-8" style={{ animation: 'fadeUp 0.5s ease' }}>
        <div className="text-6xl mb-3" style={{ animation: 'float 3s ease-in-out infinite' }}>🌍</div>
        <h1 className="text-5xl font-black text-white tracking-tight">
          English<span style={{ color: '#FFD93D' }}>Up</span>
        </h1>
        <p className="text-[#93C5FD] text-base font-semibold mt-2">Programme anglais · Enfants 6–16 ans</p>
        <div className="inline-block mt-3 bg-[rgba(255,217,61,0.15)] border border-[rgba(255,217,61,0.35)] rounded-full px-4 py-2 text-sm text-[#FFD93D] font-bold">
          ✨ Testez gratuitement — aucune carte requise
        </div>
      </div>

      {/* Benefits */}
      <div className="w-full max-w-sm mb-8" style={{ animation: 'fadeUp 0.7s ease' }}>
        {[
          { icon: '⏱️', text: '20 min par jour — résultats visibles' },
          { icon: '🎯', text: 'Parcours adapté à l\'âge de l\'enfant' },
          { icon: '👨‍👩‍👧', text: 'Suivi parent en temps réel' },
          { icon: '🧪', text: '2 tests bilan avec rapports PDF' },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-xl flex-shrink-0">{b.icon}</span>
            <span className="text-white text-sm font-semibold">{b.text}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="w-full max-w-sm" style={{ animation: 'fadeUp 0.9s ease' }}>
        <Link href="/demo"
          className="block w-full text-center py-5 mb-3 rounded-2xl text-lg font-black text-gray-900 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #FFD93D, #FF6B35)', animation: 'pulse 2.5s ease-in-out infinite' }}>
          👀 Essayer gratuitement — voir la démo
        </Link>

        <Link href="/auth/register"
          className="block w-full text-center py-4 rounded-2xl text-base font-black text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
          Créer mon compte →
        </Link>

        <p className="text-center text-xs text-white/30 font-semibold mt-4">
          Déjà inscrit ?{' '}
          <Link href="/auth/login" className="text-white/60 underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
