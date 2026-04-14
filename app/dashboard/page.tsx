// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function Dashboard() {
  const [child, setChild] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }
      const { data: parent } = await supabase.from('parents').select('id').eq('auth_id', user.id).single()
      if (!parent) { setLoading(false); return }
      const { data: childData } = await supabase.from('children').select('*').eq('parent_id', parent.id).single()
      setChild(childData)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#040D1A',color:'white'}}><p>Chargement...</p></div>

  if (!child) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#040D1A',color:'white',padding:'24px',textAlign:'center'}}>
      <div style={{fontSize:'48px',marginBottom:'16px'}}>⏳</div>
      <h1 style={{fontSize:'22px',fontWeight:'900',marginBottom:'8px'}}>Compte en attente</h1>
      <p style={{color:'#9CA3AF',marginBottom:'24px'}}>Votre compte sera activé après réception du virement de 379 DHS.</p>
      <p style={{color:'#9CA3AF',fontSize:'14px'}}>Des questions ? WhatsApp : <a href="https://wa.me/0033665791697" style={{color:'#00B4D8'}}>0033665791697</a></p>
      <button onClick={async () => { await createClient().auth.signOut(); window.location.href = '/auth/login' }}
        style={{marginTop:'24px',padding:'12px 24px',background:'#374151',border:'none',borderRadius:'12px',color:'white',cursor:'pointer'}}>
        Se déconnecter
      </button>
    </div>
  )

  const pct = Math.round((child.current_session / 60) * 100)

  return (
    <div style={{minHeight:'100vh',background:'#040D1A',color:'white',fontFamily:'sans-serif'}}>
      <div style={{background:'linear-gradient(135deg,#00B4D8,#7B2FBE)',padding:'32px 20px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:'20px'}}>
          <div>
            <div style={{fontSize:'22px',fontWeight:'900'}}>Bonjour ! 👋</div>
            <div style={{fontSize:'28px',fontWeight:'900',marginTop:'4px'}}>{child.first_name} {child.last_name}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.6)',marginTop:'4px'}}>{child.grade} · {child.school}</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.15)',borderRadius:'16px',padding:'12px 16px',textAlign:'center'}}>
            <div style={{fontSize:'24px',fontWeight:'900'}}>{child.streak}</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.6)'}}>🔥 streak</div>
          </div>
        </div>
        <div style={{background:'rgba(255,255,255,0.1)',borderRadius:'16px',padding:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
            <span style={{fontSize:'13px',fontWeight:'700'}}>Progression</span>
            <span style={{fontSize:'13px',fontWeight:'900'}}>{child.current_session}/60 sessions</span>
          </div>
          <div style={{height:'8px',background:'rgba(255,255,255,0.2)',borderRadius:'4px',overflow:'hidden'}}>
            <div style={{height:'100%',background:'white',borderRadius:'4px',width:pct+'%'}} />
          </div>
        </div>
      </div>
      <div style={{padding:'20px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}}>
          <div style={{background:'#1B3A6B',borderRadius:'16px',padding:'16px',textAlign:'center'}}>
            <div style={{fontSize:'28px',fontWeight:'900',color:'#FFD93D'}}>⚡ {child.total_xp}</div>
            <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'4px'}}>XP total</div>
          </div>
          <div style={{background:'#1B3A6B',borderRadius:'16px',padding:'16px',textAlign:'center'}}>
            <div style={{fontSize:'28px',fontWeight:'900',color:'#06D6A0'}}>{child.english_level}</div>
            <div style={{fontSize:'12px',color:'#9CA3AF',marginTop:'4px'}}>Niveau</div>
          </div>
        </div>
        {child.status === 'active' ? (
          <a href="/session" style={{display:'block',padding:'20px',background:'linear-gradient(135deg,#FF6B35,#FFD93D)',borderRadius:'20px',textAlign:'center',textDecoration:'none',color:'#1B1B1B',fontWeight:'900',fontSize:'18px'}}>
            ▶ Commencer ma session du jour
          </a>
        ) : (
          <div style={{padding:'20px',background:'#1B3A6B',borderRadius:'20px',textAlign:'center'}}>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#FFD93D'}}>⏳ Compte en attente d activation</div>
            <div style={{fontSize:'13px',color:'#9CA3AF',marginTop:'8px'}}>Contactez-nous sur WhatsApp pour activer votre accès</div>
          </div>
        )}
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/login' }}
          style={{width:'100%',marginTop:'16px',padding:'12px',background:'transparent',border:'1px solid #374151',borderRadius:'12px',color:'#6B7280',cursor:'pointer',fontSize:'14px'}}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}