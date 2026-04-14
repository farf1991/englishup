'use client'

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleLogout}
      className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center text-gray-500 font-bold text-sm hover:border-gray-300 transition-colors">
      Déconnexion
    </button>
  )
}
