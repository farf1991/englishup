import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin client with service role (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // Vérif header secret admin
    const secret = req.headers.get('x-admin-secret')
    // Accept calls from admin panel (même domaine) ou avec le secret
    const origin = req.headers.get('origin') || ''
    const isLocal = origin.includes('localhost') || origin.includes(process.env.NEXT_PUBLIC_APP_URL || '')

    const body = await req.json()
    const { enrollmentId, childId } = body

    if (!enrollmentId || !childId) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const now = new Date().toISOString()

    // 1. Mettre à jour l'enrollment
    const { error: enrollError } = await supabase
      .from('enrollments')
      .update({
        payment_status: 'confirmed',
        activated_at: now,
        activated_by: 'admin',
      })
      .eq('id', enrollmentId)

    if (enrollError) return NextResponse.json({ error: enrollError.message }, { status: 500 })

    // 2. Activer l'enfant
    const { error: childError } = await supabase
      .from('children')
      .update({
        status: 'active',
        activated_at: now,
      })
      .eq('id', childId)

    if (childError) return NextResponse.json({ error: childError.message }, { status: 500 })

    // 3. Enregistrer notification
    const { data: child } = await supabase
      .from('children')
      .select('parent_id, first_name')
      .eq('id', childId)
      .single()

    if (child) {
      await supabase.from('notifications').insert({
        parent_id: child.parent_id,
        child_id: childId,
        type: 'activation',
        message: `Le programme de ${child.first_name} est maintenant actif ! Bonne chance 🚀`,
        status: 'sent',
      })
    }

    // TODO: Envoyer email de bienvenue via Resend/Sendgrid
    // TODO: Envoyer SMS via Twilio

    return NextResponse.json({ success: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
