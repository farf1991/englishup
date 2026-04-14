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

  const all = (enrollments || []) as any[]
  const pending = all.filter((e: any) => e.payment_status === 'pending')
  const confirmed = all.filter((e: any) => e.payment_status === 'confirmed')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex">
        <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 p-5 fixed top-0 left-0">
          <div className="mb-8">
            <div className="text-xl font-black">🌍 EnglishUp</div>
          </div>
          <nav className="flex flex-col gap-1">
            {([
              { href: '/admin', label: 'Vue globale', icon: '📊' },
              { href: '/admin/students', label: 'Élèves', icon: '👦' },
              { href: '/admin/enrollments', label: 'Inscriptions', icon: '📋', active: true },
              { href: '/admin/content', label: 'Contenu', icon: '📚' },
            ] as any[]).map((n: any) => (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${n.active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-white'}`}>
                <span>{n.icon}</span>{n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="ml-60 flex-1 p-8">
          <h1 className="text-2xl font-black mb-8">Inscriptions — {all.length} total</h1>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-black text-yellow-400 mb-4">⏳ En attente ({pending.length})</h2>
              <div className="space-y-3">{pending.map((e: any) => <AdminEnrollmentCard key={e.id} enrollment={e} />)}</div>
            </div>
          )}
          <div>
            <h2 className="text-lg font-black text-green-400 mb-4">✅ Actifs ({confirmed.length})</h2>
            <div className="space-y-3">{confirmed.map((e: any) => <AdminEnrollmentCard key={e.id} enrollment={e} />)}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
