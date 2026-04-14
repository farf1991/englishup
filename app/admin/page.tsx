// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPage() {
  const [data, setData] = useState({ enrollments: [], children: [], sessions: [] })
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== 'taha@perf-on.com') {
        window.location.href = '/auth/login'
        return
      }
      setAuthed(true)
      const [e, c, s] = await Promise.all([
        supabase.from('enrollments').select('*, children(*), parents(*)').order('created_at', { ascending: false }),
        supabase.from('children').select('*'),
        supabase.from('sessions').select('*'),
      ])
      setData({ enrollments: e.data || [], children: c.data || [], sessions: s.data || [] })
      setLoading(false)
    }
    load()
  }, [])

  async function activate(enrollmentId, childId) {
    await supabase.from('enrollments').update({ payment_status: 'confirmed' }).eq('id', enrollmentId)
    await supabase.from('children').update({ status: 'active' }).eq('id', childId)
    window.location.reload()
  }

  if (!authed || loading) return (
    <div style={{minHeight:'100vh',background:'#030712',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <p>Chargement...</p>
    </div>
  )

  const active = data.enrollments.filter(e => e.payment_status === 'confirmed')
  const pending = data.enrollments.filter(e => e.payment_status === 'pending')
  const revenue = active.length * 379

  return (
    <div style={{minHeight:'100vh',background:'#030712',color:'white',fontFamily:'sans-serif',padding:'24px'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px'}}>
          <div>
            <h1 style={{fontSize:'24px',fontWeight:'900',margin:0}}>EnglishUp Admin</h1>
            <p style={{color:'#6B7280',margin:'4px 0 0',fontSize:'14px'}}>Panel de gestion</p>
          </div>
          <a href="/admin/create-student" style={{padding:'10px 20px',background:'#2563EB',borderRadius:'10px',color:'white',textDecoration:'none',fontWeight:'700',fontSize:'14px'}}>+ Créer un élève</a>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'32px'}}>
          {[
            { label:'Revenus', value: revenue + ' DHS', color:'#FBBF24' },
            { label:'Élèves actifs', value: active.length, color:'#34D399' },
            { label:'En attente', value: pending.length, color:'#F87171' },
            { label:'Sessions', value: data.sessions.length, color:'#60A5FA' },
          ].map((k,i) => (
            <div key={i} style={{background:'#111827',borderRadius:'16px',padding:'20px',border:'1px solid #1F2937'}}>
              <div style={{fontSize:'28px',fontWeight:'900',color:k.color}}>{k.value}</div>
              <div style={{fontSize:'13px',color:'#6B7280',marginTop:'4px'}}>{k.label}</div>
            </div>
          ))}
        </div>

        {pending.length > 0 && (
          <div style={{background:'#111827',borderRadius:'16px',padding:'20px',marginBottom:'24px',border:'1px solid #374151'}}>
            <h2 style={{fontSize:'16px',fontWeight:'900',color:'#FBBF24',marginBottom:'16px'}}>⏳ En attente ({pending.length})</h2>
            {pending.map(e => (
              <div key={e.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#1F2937',borderRadius:'12px',marginBottom:'8px'}}>
                <div>
                  <div style={{fontWeight:'700'}}>{e.children?.first_name} {e.children?.last_name}</div>
                  <div style={{fontSize:'12px',color:'#9CA3AF'}}>{e.parents?.email} · {e.parents?.phone}</div>
                </div>
                <button onClick={() => activate(e.id, e.children?.id)}
                  style={{padding:'8px 16px',background:'#16A34A',border:'none',borderRadius:'8px',color:'white',fontWeight:'700',cursor:'pointer'}}>
                  ✅ Activer
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{background:'#111827',borderRadius:'16px',padding:'20px',border:'1px solid #374151'}}>
          <h2 style={{fontSize:'16px',fontWeight:'900',color:'#34D399',marginBottom:'16px'}}>✅ Élèves actifs ({active.length})</h2>
          {active.length === 0 && <p style={{color:'#6B7280'}}>Aucun élève actif.</p>}
          {data.children.filter(c => c.status === 'active').map(c => (
            <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#1F2937',borderRadius:'12px',marginBottom:'8px'}}>
              <div>
                <div style={{fontWeight:'700'}}>{c.first_name} {c.last_name}</div>
                <div style={{fontSize:'12px',color:'#9CA3AF'}}>{c.grade} · Niveau: {c.english_level}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:'900',color:'#60A5FA'}}>{c.current_session}/60</div>
                <div style={{fontSize:'12px',color:'#6B7280'}}>sessions</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/login' }}
          style={{marginTop:'24px',padding:'10px 20px',background:'transparent',border:'1px solid #374151',borderRadius:'10px',color:'#6B7280',cursor:'pointer',fontSize:'14px'}}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}