// Cron: run weekly backup (Vercel calls this every Sunday at 19:00).
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { BackupsRepo } from '@/lib/backup/repo'
import { exportFirestore } from '@/lib/backup/firestore-export'
import { logActivity } from '@/lib/activity-log'
import { REVIEWABLE_COLLECTIONS, CollectionNames } from '@/lib/cms-types'

const ALL_COLLECTIONS = [
  ...REVIEWABLE_COLLECTIONS,
  CollectionNames.siteSettings,
  CollectionNames.heroContent,
  CollectionNames.aboutContent,
  CollectionNames.leads,
]

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

  const id = await BackupsRepo.create({
    type: 'scheduled',
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: '',
    gcsPrefix: '',
    collections: ALL_COLLECTIONS,
    triggeredByUid: 'cron',
    triggeredByEmail: '',
    triggeredByName: 'Cron scheduler',
    sizeBytes: 0,
    documentCount: 0,
    retentionUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Weekly scheduled backup',
    error: '',
  })

  try {
    const result = await exportFirestore(ALL_COLLECTIONS)
    await BackupsRepo.update(id, {
      status: 'completed',
      finishedAt: new Date().toISOString(),
      gcsPrefix: result.gcsPrefix,
    })
    await logActivity({
      action: 'backup_run',
      collection: 'backups',
      documentId: id,
      documentLabel: `Scheduled backup - ${result.gcsPrefix}`,
      actor: { uid: 'cron', email: '', name: 'Cron scheduler', role: 'super_admin' },
    })
    return NextResponse.json({ ok: true, id, gcsPrefix: result.gcsPrefix })
  } catch (err) {
    const error = (err as Error).message
    await BackupsRepo.update(id, { status: 'failed', error })
    await logActivity({
      action: 'backup_failed',
      collection: 'backups',
      documentId: id,
      documentLabel: `Scheduled backup failed: ${error}`,
      actor: { uid: 'cron', email: '', name: 'Cron scheduler', role: 'super_admin' },
    })
    return NextResponse.json({ error }, { status: 500 })
  }
}

export const GET = POST
