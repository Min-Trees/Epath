// Update alt text on a media record.
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { MediaRepo } from '@/lib/cms-repo'
import { logActivity } from '@/lib/activity-log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PatchSchema = z.object({
  altText: z.string().max(500).optional(),
  fileName: z.string().max(255).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  await MediaRepo.update(params.id, parsed.data)
  await logActivity({
    action: 'update',
    collection: 'media',
    documentId: params.id,
    documentLabel: parsed.data.fileName || '',
    actor: user,
    request: req,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // We delete via the /api/admin/upload DELETE route (which removes
  // both the S3 object and the Firestore doc). Kept here for symmetry.
  return NextResponse.json(
    { error: 'Use DELETE /api/admin/upload?key=… instead' },
    { status: 400 }
  )
}
