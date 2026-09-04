import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { getAdminDb } from '@/lib/firebase-admin'
import { CollectionNames, LEAD_STATUSES } from '@/lib/cms-types'
import { logActivity } from '@/lib/activity-log'

const PatchSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const db = getAdminDb()
  await db.collection(CollectionNames.leads).doc(params.id).update({
    ...parsed.data,
    updatedAt: new Date(),
  })

  await logActivity({
    action: 'update',
    collection: CollectionNames.leads,
    documentId: params.id,
    changes: parsed.data,
    actor: user,
    request: req,
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await getAdminDb().collection(CollectionNames.leads).doc(params.id).delete()
  await logActivity({
    action: 'delete',
    collection: CollectionNames.leads,
    documentId: params.id,
    actor: user,
    request: req,
  })
  return NextResponse.json({ ok: true })
}