// GET /api/cms/backup/[id] - get backup detail
// DELETE /api/cms/backup/[id] - delete backup
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { BackupsRepo } from '@/lib/backup/repo'
import { deleteGcsPrefix } from '@/lib/backup/restore'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'super_admin' && user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const backup = await BackupsRepo.get(params.id)
  if (!backup) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ item: backup })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Chỉ super_admin có thể xóa backup' }, { status: 403 })
  }

  const backup = await BackupsRepo.get(params.id)
  if (!backup) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Xóa GCS objects
  if (backup.gcsPrefix) {
    try {
      await deleteGcsPrefix(backup.gcsPrefix)
    } catch {
      // Continue even if GCS delete fails
    }
  }

  await BackupsRepo.remove(params.id)
  return NextResponse.json({ ok: true })
}
