// @ts-nocheck
'use server'

import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ─── INSCRIPTION PARENT ──────────────────────────────────────
export async function registerParent(formData: {
  email: string
  password: string
  phone: string
  first_name: string
  // données enfant
  child_first_name: string
  child_last_name: string
  child_dob: string
  child_gender: 'boy' | 'girl'
  child_school: string
  child_grade: string
}) {
  const supabase = await createServerSupabaseClient()

  // 1. Créer le compte Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (authError) return { error: authError.message }

  const userId = authData.user?.id
  if (!userId) return { error: 'Erreur lors de la création du compte' }

  // 2. Créer le profil parent
  const { data: parent, error: parentError } = await supabase
    .from('parents')
    .insert({
      auth_id: userId,
      email: formData.email,
      phone: formData.phone,
      first_name: formData.first_name || null,
    })
    .select()
    .single()

  if (parentError) return { error: parentError.message }

  // 3. Créer le profil enfant
  const { data: child, error: childError } = await supabase
    .from('children')
    .insert({
      parent_id: parent.id,
      first_name: formData.child_first_name,
      last_name: formData.child_last_name,
      date_of_birth: formData.child_dob,
      gender: formData.child_gender,
      school: formData.child_school,
      grade: formData.child_grade,
      status: 'pending',
    })
    .select()
    .single()

  if (childError) return { error: childError.message }

  // 4. Créer l'enrollment (en attente de virement)
  const { error: enrollError } = await supabase
    .from('enrollments')
    .insert({
      child_id: child.id,
      parent_id: parent.id,
      payment_status: 'pending',
      amount_dhs: 379,
    })

  if (enrollError) return { error: enrollError.message }

  return { success: true, childId: child.id }
}

// ─── CONNEXION ───────────────────────────────────────────────
export async function loginParent(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Email ou mot de passe incorrect' }

  revalidatePath('/')
  redirect('/dashboard')
}

// ─── DÉCONNEXION ─────────────────────────────────────────────
export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ─── RÉCUPÉRER SESSION AUTH ──────────────────────────────────
export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── RÉCUPÉRER DONNÉES PARENT ────────────────────────────────
export async function getParentData() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: parent } = await supabase
    .from('parents')
    .select(`
      *,
      children (
        *,
        enrollments (*),
        sessions (*, order: session_number.asc),
        bilan_results (*)
      )
    `)
    .eq('auth_id', user.id)
    .single()

  return parent
}
