// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'

const GRADES_PRIMAIRE = [
  'CP (1ère année)','CE1 (2ème année)','CE2 (3ème année)',
  'CM1 (4ème année)','CM2 (5ème année)','6ème (6ème année)'
]
const GRADES_COLLEGE = ['5ème (1ère collège)','4ème (2ème collège)','3ème (3ème collège)']
const GRADES_LYCEE = ['2nde (Tronc commun)','1ère (1ère bac)','Terminale (2ème bac)']

function getAgeGroup(dob) {
  const age = new Date().getFullYear() - new Date(dob).getFullYear()
  if (age >= 6 && age <= 9) return { name: 'Explorers 🦁', color: '#FF6B35' }
  if (age >= 10 && age <= 13) return { name: 'Adventurers 🚀', color: '#00B4D8' }
  return { name: 'Champions 🎯', color: '#7B2FBE' }
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ child_first_name:'',child_last_name:'',child_dob:'',child_gender:'',child_school:'',child_grade:'',phone:'',email:'',password:'' })
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const ageGroup = form.child_dob ? getAgeGroup(form.child_dob) : null
  const inputClass = "w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-400 bg-white text-gray-900"
  const labelClass = "block text-xs font-black text-gray-500 uppercase tracking-wide mb-1.5"

  async function handleSubmit() {
    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password })
      if (authError) throw new Error(authError.message)
      const userId = authData.user.id
      const { data: parent, error: parentError } = await supabase.from('parents').insert({ auth_id: userId, email: form.email, phone: form.phone, first_name: '' }).select().single()
      if (parentError) throw new Error(parentError.message)
      const age = new Date().getFullYear() - new Date(form.child_dob).getFullYear()
      const age_group = age <= 9 ? 'explorer' : age <= 13 ? 'adventurer' : 'champion'
      const { data: child, error: childError } = await supabase.from('children').insert({ parent_id: parent.id, first_name: form.child_first_name, last_name: form.child_last_name, date_of_birth: form.child_dob, gender: form.child_gender, school: form.child_school, grade: form.child_grade, age_group, english_level: 'starter', status: 'pending' }).select().single()
      if (childError) throw new Error(childError.message)
      await supabase.from('enrollments').insert({ child_id: child.id, parent_id: parent.id, payment_status: 'pending', amount_dhs: 379 })
      toast.success('Compte créé !')
      router.push('/auth/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mobile-container min-h-screen bg-[#F0F4F8]" style={{fontFamily:'var(--font-nunito)'}}>
      <div className="bg-gradient-to-br from-[#00B4D8] to-[#7B2FBE] px-5 pt-8 pb-6">
        <div className="text-2xl font-black text-white mb-1">🌍 EnglishUp</div>
        <div className="flex gap-2 mt-4">{[1,2].map(n=><div key={n} className={`flex-1 h-1.5 rounded-full ${step>=n?'bg-white':'bg-white/30'}`}/>)}</div>
        <p className="text-white/60 text-xs mt-2 font-semibold">{step===1?'Étape 1/2 — Votre enfant':'Étape 2/2 — Vos coordonnées'}</p>
      </div>
      <div className="px-5 py-6">
        {step===1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="font-black text-gray-900 mb-4">👦 Votre enfant</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={labelClass}>Prénom *</label><input value={form.child_first_name} onChange={e=>update('child_first_name',e.target.value)} className={inputClass} placeholder="Yassine"/></div>
                <div><label className={labelClass}>Nom *</label><input value={form.child_last_name} onChange={e=>update('child_last_name',e.target.value)} className={inputClass} placeholder="Alami"/></div>
              </div>
              <div className="mb-3"><label className={labelClass}>Date de naissance *</label><input type="date" value={form.child_dob} onChange={e=>update('child_dob',e.target.value)} className={inputClass}/>
                {ageGroup&&<div className="mt-2 text-xs font-black px-3 py-1.5 rounded-xl inline-block" style={{background:ageGroup.color+'20',color:ageGroup.color}}>Groupe : {ageGroup.name}</div>}
              </div>
              <div className="mb-3"><label className={labelClass}>Genre *</label>
                <div className="grid grid-cols-2 gap-2">{[['boy','👦 Garçon'],['girl','👧 Fille']].map(([v,l])=><button key={v} type="button" onClick={()=>update('child_gender',v)} className={`py-3 rounded-2xl text-sm font-black border-2 transition-all ${form.child_gender===v?'border-blue-400 bg-blue-50 text-blue-700':'border-gray-200 text-gray-500'}`}>{l}</button>)}</div>
              </div>
              <div className="mb-3"><label className={labelClass}>École *</label><input value={form.child_school} onChange={e=>update('child_school',e.target.value)} className={inputClass} placeholder="École Ibn Sina, Casablanca"/></div>
              <div><label className={labelClass}>Niveau scolaire *</label>
                <select value={form.child_grade} onChange={e=>update('child_grade',e.target.value)} className={inputClass}>
                  <option value="">Choisir</option>
                  <optgroup label="Primaire">{GRADES_PRIMAIRE.map(g=><option key={g}>{g}</option>)}</optgroup>
                  <optgroup label="Collège">{GRADES_COLLEGE.map(g=><option key={g}>{g}</option>)}</optgroup>
                  <optgroup label="Lycée">{GRADES_LYCEE.map(g=><option key={g}>{g}</option>)}</optgroup>
                </select>
              </div>
            </div>
            <button onClick={()=>{if(!form.child_first_name||!form.child_last_name||!form.child_dob||!form.child_gender||!form.child_school||!form.child_grade){toast.error('Remplissez tous les champs');return}setStep(2)}} className="w-full py-4 rounded-2xl text-white font-black" style={{background:'linear-gradient(135deg,#00B4D8,#7B2FBE)'}}>Continuer →</button>
          </div>
        )}
        {step===2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="font-black text-gray-900 mb-4">👤 Vos coordonnées</h2>
              <div className="mb-3"><label className={labelClass}>Numéro WhatsApp *</label><input value={form.phone} onChange={e=>update('phone',e.target.value)} className={inputClass} placeholder="06 12 34 56 78" type="tel"/><p className="text-xs text-gray-400 mt-1">Pour l activation de votre compte</p></div>
              <div className="mb-3"><label className={labelClass}>Email *</label><input value={form.email} onChange={e=>update('email',e.target.value)} className={inputClass} placeholder="parent@email.com" type="email"/></div>
              <div><label className={labelClass}>Mot de passe *</label><input value={form.password} onChange={e=>update('password',e.target.value)} className={inputClass} placeholder="8 caractères minimum" type="password"/></div>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-black text-amber-900">💳 Paiement par virement — 379 DHS</p>
              <p className="text-xs text-amber-700 mt-1">Après inscription, vous recevrez les coordonnées bancaires sur WhatsApp.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={()=>setStep(1)} className="flex-1 py-4 rounded-2xl font-black text-gray-600 bg-white border-2 border-gray-200">← Retour</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-2 px-8 py-4 rounded-2xl font-black disabled:opacity-50" style={{background:'linear-gradient(135deg,#FF6B35,#FFD93D)',color:'#1B1B1B',flex:2}}>{loading?'Création...':'Créer mon compte →'}</button>
            </div>
            <p className="text-center text-sm text-gray-400">Déjà inscrit ? <a href="/auth/login" className="text-blue-500 font-bold">Se connecter</a></p>
          </div>
        )}
      </div>
    </div>
  )
}
