// ============================================================
// ENGLISHUP — Système d'alertes SMS (Twilio)
// À appeler via un cron job quotidien (Vercel Cron ou GitHub Actions)
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Envoyer un SMS via Twilio ───────────────────────────────
async function sendSMS(to: string, message: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.log('[SMS] Twilio non configuré — SMS simulé:', { to, message })
    return true // En dev, on simule
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: to.startsWith('+') ? to : `+${to.replace(/\D/g, '')}`,
          Body: message,
        }),
      }
    )
    const data = await response.json()
    return data.sid !== undefined
  } catch (err) {
    console.error('[SMS] Erreur Twilio:', err)
    return false
  }
}

// ─── Vérifier les enfants qui n'ont pas fait leur session ────
export async function checkMissedSessions(): Promise<void> {
  console.log('[CRON] Vérification des sessions manquées...')

  // Récupère tous les enfants actifs
  const { data: children } = await supabase
    .from('children')
    .select(`
      id, first_name, streak, last_session_at, status,
      parent:parents!inner(phone, email, first_name)
    `)
    .eq('status', 'active')

  if (!children) return

  const now = new Date()
  const alerts: Array<{ childId: string; parentId: string; missedDays: number; childName: string; parentPhone: string }> = []

  for (const child of children) {
    if (!child.last_session_at) continue

    const lastSession = new Date(child.last_session_at)
    const daysSinceLastSession = Math.floor((now.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24))

    // Alerte si 2 jours sans session
    if (daysSinceLastSession >= 2) {
      const parent = child.parent as any
      alerts.push({
        childId: child.id,
        parentId: parent.id,
        missedDays: daysSinceLastSession,
        childName: child.first_name,
        parentPhone: parent.phone,
      })
    }
  }

  console.log(`[CRON] ${alerts.length} alertes à envoyer`)

  for (const alert of alerts) {
    // Vérifier qu'on n'a pas déjà envoyé une alerte aujourd'hui
    const today = new Date().toISOString().split('T')[0]
    const { data: existingNotif } = await supabase
      .from('notifications')
      .select('id')
      .eq('child_id', alert.childId)
      .eq('type', 'missed_session')
      .gte('sent_at', `${today}T00:00:00`)
      .single()

    if (existingNotif) {
      console.log(`[CRON] Alerte déjà envoyée aujourd''hui pour ${alert.childName}`)
      continue
    }

    const message = alert.missedDays === 2
      ? `🔔 EnglishUp : ${alert.childName} n''a pas fait sa session depuis 2 jours. Encouragez-le(a) à se connecter ! englishup.ma`
      : `⚠️ EnglishUp : ${alert.childName} est absent(e) depuis ${alert.missedDays} jours. Le streak est en danger ! Connectez-vous sur englishup.ma`

    const sent = await sendSMS(alert.parentPhone, message)

    // Enregistrer la notification
    await supabase.from('notifications').insert({
      child_id: alert.childId,
      type: 'missed_session',
      message,
      status: sent ? 'sent' : 'failed',
    })

    console.log(`[CRON] SMS ${sent ? 'envoyé' : 'échoué'} pour ${alert.childName} (${alert.missedDays} jours)`)
  }
}

// ─── API Route: appelée par le cron ─────────────────────────
// Ajoute dans app/api/cron/check-sessions/route.ts
export async function GET(request: Request) {
  // Vérification du secret cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  await checkMissedSessions()
  return Response.json({ success: true, timestamp: new Date().toISOString() })
}
