'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { registerParent } from '@/lib/auth'

const schema = z.object({
  // Parent
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  phone: z.string().min(8, 'Numéro invalide'),
  first_name: z.string().optional(),
  // Enfant
  child_first_name: z.string().min(1, 'Requis'),
  child_last_name: z.string().min(1, 'Requis'),
  child_dob: z.string().refine(v => {
    const age = new Date().getFullYear() - new Date(v).getFullYear()
    return age >= 6 && age <= 16
  }, 'L\'enfant doit avoir entre 6 et 16 ans'),
  child_gender: z.enum(['boy', 'girl'], { required_error: 'Requis' }),
  child_school: z.string().min(1, 'Requis'),
  child_grade: z.string().min(1, 'Requis'),
})

type FormData = z.infer<typeof schema>

const GRADES = ['CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème','2nde','1ère','Terminale']

function getAgeGroup(dob: string) {
  const age = new Date().getFullYear() - new Date(dob).getFullYear()
  if (age >= 6 && age <= 9) return { name: 'Explorers', emoji: '🦁', color: '#FF6B35' }
  if (age >= 10 && age <= 13) return { name: 'Adventurers', emoji: '🚀', color: '#00B4D8' }
  if (age >= 14 && age <= 16) return { name: 'Champions', emoji: '🎯', color: '#1B4332' }
  return null
}

export default function RegisterPage() {
  const [step, setStep] = useState<1|2>(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const watchedDob = watch('child_dob')
  const ageGroup = watchedDob ? getAgeGroup(watchedDob) : null
  const watchedGender = watch('child_gender')

  async function goToStep2() {
    const valid = await trigger(['child_first_name','child_last_name','child_dob','child_gender','child_school','child_grade'])
    if (valid) setStep(2)
  }

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const result = await registerParent(data)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Compte créé ! En attente de validation.')
      router.push('/dashboard/pending')
    } catch {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field?: { message?: string }) =>
    `input-field ${field?.message ? 'error' : ''}`

  return (
    <div className="mobile-container bg-[#F8FAFF] min-h-screen font-[var(--font-nunito)]">

      {/* Header */}
      <div className="text-center py-8 px-6">
        <Link href="/" className="text-2xl font-black text-[#1B1B1B]">
          🌍 English<span className="text-[#FF6B35]">Up</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1 font-semibold">Inscription de votre enfant</p>
      </div>

      {/* Progress */}
      <div className="px-6 mb-8">
        <div className="flex justify-between mb-2">
          {['Profil enfant', 'Votre compte'].map((s, i) => (
            <span key={i} className={`text-xs font-bold ${i + 1 <= step ? 'text-[#FF6B35]' : 'text-gray-400'}`}>{s}</span>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFD93D] rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-12">

        {/* ── STEP 1: Enfant ── */}
        {step === 1 && (
          <div className="animate-fadeUp">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <h2 className="text-lg font-black text-gray-900 mb-5">👦 Profil de l'enfant</h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Prénom *</label>
                  <input {...register('child_first_name')} placeholder="Emma" className={inputClass(errors.child_first_name)} />
                  {errors.child_first_name && <p className="text-red-500 text-xs mt-1">{errors.child_first_name.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Nom *</label>
                  <input {...register('child_last_name')} placeholder="Martin" className={inputClass(errors.child_last_name)} />
                  {errors.child_last_name && <p className="text-red-500 text-xs mt-1">{errors.child_last_name.message}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Date de naissance *</label>
                <input type="date" {...register('child_dob')} className={inputClass(errors.child_dob)} />
                {errors.child_dob && <p className="text-red-500 text-xs mt-1">{errors.child_dob.message}</p>}
                {ageGroup && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold"
                    style={{ background: ageGroup.color + '18', color: ageGroup.color }}>
                    <span>{ageGroup.emoji}</span>
                    <span>Groupe {ageGroup.name}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Genre *</label>
                <div className="flex gap-3">
                  {[{ v: 'girl', l: '👧 Fille' }, { v: 'boy', l: '👦 Garçon' }].map(g => (
                    <label key={g.v} className={`flex-1 py-3 text-center rounded-xl border-2 cursor-pointer font-bold text-sm transition-all
                      ${watchedGender === g.v ? 'border-[#FF6B35] bg-[#FFF0EA] text-[#FF6B35]' : 'border-gray-200 text-gray-500'}`}>
                      <input type="radio" {...register('child_gender')} value={g.v} className="sr-only" />
                      {g.l}
                    </label>
                  ))}
                </div>
                {errors.child_gender && <p className="text-red-500 text-xs mt-1">{errors.child_gender.message}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Établissement scolaire *</label>
                <input {...register('child_school')} placeholder="École Jean Moulin, Paris" className={inputClass(errors.child_school)} />
                {errors.child_school && <p className="text-red-500 text-xs mt-1">{errors.child_school.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Classe *</label>
                <select {...register('child_grade')} className={inputClass(errors.child_grade)} style={{ appearance: 'none' }}>
                  <option value="">Sélectionner une classe</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.child_grade && <p className="text-red-500 text-xs mt-1">{errors.child_grade.message}</p>}
              </div>
            </div>

            <button type="button" onClick={goToStep2}
              className="w-full py-5 bg-gradient-to-r from-[#FF6B35] to-[#FFD93D] rounded-2xl text-lg font-black text-gray-900 shadow-lg">
              Continuer →
            </button>
          </div>
        )}

        {/* ── STEP 2: Parent ── */}
        {step === 2 && (
          <div className="animate-fadeUp">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <h2 className="text-lg font-black text-gray-900 mb-2">👨‍👩‍👧 Vos coordonnées</h2>
              <p className="text-sm text-gray-500 mb-5">Pour les alertes et rapports de progression.</p>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Email *</label>
                <input type="email" {...register('email')} placeholder="parent@email.com" className={inputClass(errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Mot de passe *</label>
                <input type="password" {...register('password')} placeholder="Minimum 8 caractères" className={inputClass(errors.password)} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Téléphone *</label>
                <input type="tel" {...register('phone')} placeholder="+212 6 12 34 56 78" className={inputClass(errors.phone)} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                <p className="text-xs text-gray-400 mt-1">Alertes SMS si votre enfant manque une session</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Votre prénom (optionnel)</label>
                <input {...register('first_name')} placeholder="Marie" className="input-field" />
              </div>
            </div>

            {/* Info paiement */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4 flex gap-3">
              <span className="text-xl">💳</span>
              <div>
                <p className="text-sm font-bold text-blue-900">Paiement par virement — 379 DHS</p>
                <p className="text-xs text-blue-700 mt-1">Après inscription, vous recevrez nos coordonnées bancaires. L'accès s'active dès réception du virement.</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-6 flex gap-3">
              <span className="text-xl">🔒</span>
              <p className="text-xs text-green-800 font-semibold">Vos données sont sécurisées et ne sont jamais revendues.</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="px-5 py-4 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-500">
                ← Retour
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FFD93D] rounded-xl text-base font-black text-gray-900 disabled:opacity-60">
                {loading ? 'Création...' : 'Créer mon compte →'}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6 font-semibold">
          Déjà inscrit ?{' '}
          <Link href="/auth/login" className="text-[#FF6B35] font-bold">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
