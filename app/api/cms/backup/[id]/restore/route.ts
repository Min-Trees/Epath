// POST /api/cms/backup/[id]/restore
// Body: { mode: 'full' | 'collection', collection?: string }
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { BackupsRepo } from '@/lib/backup/repo'
import { importFirestore } from '@/lib/backup/firestore-import'
import { logActivity } from '@/lib/activity-log'

const BodySchema = z.object({
  mode: z.enum(['full', 'collection']),
  collection: z.string().optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Chỉ super_admin có thể restore backup' }, { status: 403 })
  }

  const backup = await BackupsRepo.get(params.id)
  if (!backup) return NextResponse.json({ error: 'Backup không tồn tại' }, { status: 404 })
  if (!backup.gcsPrefix) return NextResponse.json({ error: 'Backup này không có GCS prefix' }, { status: 400 })

  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 })
  }

  const collections = parsed.data.mode === 'collection' && parsed.data.collection
    ? [parsed.data.collection]
    : backup.collections || []

  if (collections.length === 0) {
    return NextResponse.json({ error: 'Không có collection nào để restore' }, { status: 400 })
  }

  try {
    // 1. Tạo pre-restore snapshot trước khi restore
    const preRestoreId = await BackupsRepo.create({
      type: 'pre-restore',
      status: 'running',
      startedAt: new Date().toISOString(),
      finishedAt: '',
      gcsPrefix: '',
      collections,
      triggeredByUid: user.uid,
      triggeredByEmail: user.email || '',
      triggeredByName: user.name || '',
      sizeBytes: 0,
      documentCount: 0,
      retentionUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Pre-restore snapshot for restore of backup ${params.id}`,
      error: '',
    })

    // 2. Gọi import
    const result = await importFirestore(backup.gcsPrefix, collections)

    // 3. Update pre-restore record
    await BackupsRepo.update(preRestoreId, {
      status: 'completed',
      finishedAt: new Date().toISOString(),
    })

    await BackupsRepo.update(params.id, {
      notes: `${backup.notes || ''}\nRestored at: ${new Date().toISOString()}`,
    })

    await logActivity({
      action: 'backup_restore',
      collection: 'backups',
      documentId: params.id,
      documentLabel: `Restore: ${parsed.data.mode}${parsed.data.collection ? ` (${parsed.data.collection})` : ''}`,
      changes: {
        mode: parsed.data.mode,
        collections,
        preRestoreId,
      },
      actor: user,
    })

    return NextResponse.json({
      ok: true,
      preRestoreId,
      operationName: result.operationName,
    })
  } catch (err) {
    const error = (err as Error).message
    return NextResponse.json({ error }, { status: 500 })
  }
}
