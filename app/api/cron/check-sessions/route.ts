// @ts-nocheck
import { checkMissedSessions } from '@/lib/sms-alerts'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  await checkMissedSessions()
  return Response.json({ ok: true, ts: new Date().toISOString() })
}
