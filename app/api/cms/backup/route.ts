// GET /api/cms/backup  - list backups
// POST /api/cms/backup - create manual backup
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { BackupsRepo } from '@/lib/backup/repo'
import { exportFirestore } from '@/lib/backup/firestore-export'
import { logActivity } from '@/lib/activity-log'
import { REVIEWABLE_COLLECTIONS, CollectionNames } from '@/lib/cms-types'

// Non-reviewable collections (singleton/settings)
const ALL_COLLECTIONS = [
  ...REVIEWABLE_COLLECTIONS,
  CollectionNames.siteSettings,
  CollectionNames.heroContent,
  CollectionNames.aboutContent,
  CollectionNames.leads,
]

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'super_admin' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const items = await BackupsRepo.list()
  return NextResponse.json({ items })
}

const CreateSchema = z.object({
  notes: z.string().optional().default(''),
})

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'super_admin' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const json = await req.json().catch(() => null)
  const parsed = CreateSchema.safeParse(json || {})
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  // Tạo record backup với status=pending
  const id = await BackupsRepo.create({
    type: 'manual',
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: '',
    gcsPrefix: '',
    collections: ALL_COLLECTIONS,
    triggeredByUid: user.uid,
    triggeredByEmail: user.email || '',
    triggeredByName: user.name || '',
    sizeBytes: 0,
    documentCount: 0,
    retentionUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    notes: parsed.data.notes,
    error: '',
  })

  // Chạy export (không blocking - có thể mất vài phút)
  // Vercel có timeout 10s cho serverless, nên export chạy async
  // Backend sẽ poll operation hoặc dùng callback
  // Tạm thời: chạy export và update record sau
  try {
    const result = await exportFirestore(ALL_COLLECTIONS)
    await BackupsRepo.update(id, {
      status: 'completed',
      finishedAt: new Date().toISOString(),
      gcsPrefix: result.gcsPrefix,
      error: '',
    })
    await logActivity({
      action: 'backup_run',
      collection: 'backups',
      documentId: id,
      documentLabel: `Manual backup - ${result.gcsPrefix}`,
      actor: user,
    })
    return NextResponse.json({ ok: true, id, gcsPrefix: result.gcsPrefix })
  } catch (err) {
    const error = (err as Error).message
    await BackupsRepo.update(id, { status: 'failed', error })
    await logActivity({
      action: 'backup_failed',
      collection: 'backups',
      documentId: id,
      documentLabel: `Manual backup failed: ${error}`,
      actor: user,
    })
    return NextResponse.json({ error }, { status: 500 })
  }
}
