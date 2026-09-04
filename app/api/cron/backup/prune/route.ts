// Cron: prune expired backups (Vercel calls this every Monday at 03:00).
import { NextRequest, NextResponse } from 'next/server'
import { pruneExpiredBackups } from '@/lib/backup/retention'

function checkCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true
  const auth = req.headers.get('authorization') || ''
  return auth === `Bearer ${secret}`
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!checkCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { deleted } = await pruneExpiredBackups({
      uid: 'cron',
      email: '',
      name: 'Cron scheduler',
      role: 'super_admin',
    })
    return NextResponse.json({ ok: true, deleted })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export const GET = POST
