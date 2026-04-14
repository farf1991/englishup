'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { toast.error('Email ou mot de passe incorrect'); return }
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mobile-container bg-[#F8FAFF] min-h-screen flex flex-col justify-center px-6">

      <div className="text-center mb-10">
        <Link href="/" className="text-3xl font-black text-[#1B1B1B]">
          🌍 English<span className="text-[#FF6B35]">Up</span>
        </Link>
        <p className="text-sm text-gray-500 mt-2 font-semibold">Accéder à votre espace</p>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-6">
        <h1 className="text-xl font-black text-gray-900 mb-6">Connexion</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="parent@email.com" className="input-field" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className="input-field" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-5 mt-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD93D] rounded-2xl text-lg font-black text-gray-900 disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 font-semibold">
        Pas encore de compte ?{' '}
        <Link href="/auth/register" className="text-[#FF6B35] font-bold">S'inscrire</Link>
      </p>
    </div>
  )
}
