import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { getAdminDb } from '@/lib/firebase-admin'
import { CollectionNames, LeadSchema, LEAD_STATUSES, type Lead } from '@/lib/cms-types'
import { logActivity } from '@/lib/activity-log'
import { notifyLeadZalo } from '@/lib/lead-pipeline'

const ListQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(['chatbot', 'contact-form', 'zalo', 'manual', 'website', 'events']).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(100),
})

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const parsed = ListQuerySchema.safeParse({
    status: searchParams.get('status') || undefined,
    source: searchParams.get('source') || undefined,
    limit: searchParams.get('limit') || undefined,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  }

  try {
    const snap = await getAdminDb()
      .collection(CollectionNames.leads)
      .orderBy('createdAt', 'desc')
      .limit(parsed.data.limit)
      .get()
    let items: Lead[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, 'id'>) }))
    if (parsed.data.status) items = items.filter((i) => i.status === parsed.data.status)
    if (parsed.data.source) items = items.filter((i) => i.source === parsed.data.source)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('[leads/list] failed:', err)
    return NextResponse.json({ items: [], error: (err as Error).message }, { status: 500 })
  }
}

const CreateBodySchema = LeadSchema.omit({ id: true }).partial({ status: true })

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = CreateBodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const id = await getAdminDb()
    .collection(CollectionNames.leads)
    .add({ ...data, createdAt: new Date(), updatedAt: new Date() }).then((r) => r.id)

  await logActivity({
    action: 'create',
    collection: CollectionNames.leads,
    documentId: id,
    documentLabel: data.name || data.phone,
    actor: user,
    request: req,
  })

  // Fan out the same Zalo notification as the public/chatbot endpoints
  // so manually-entered leads also reach the sales chat in real time.
  // Sheet is intentionally skipped – manual admin entries are not CRM
  // candidates, the lead inbox is the source of truth.
  const zaloResult = await notifyLeadZalo(
    {
      name: data.name || '',
      phone: data.phone,
      email: data.email || '',
      childAge: data.childAge || '',
      program: data.program || '',
      campus: data.campus || '',
      topicsInterested: data.topicsInterested || [],
      conversationSummary: data.conversationSummary || '',
      conversationCount: data.conversationCount || 0,
      locale: data.locale || 'vi',
      source: data.source || 'manual',
    },
    data.source === 'manual' ? 'Thủ công (admin)' : undefined
  )

  if (!zaloResult.ok && zaloResult.attempted) {
    console.warn('[cms/leads] Zalo notification failed:', zaloResult.error)
  }

  return NextResponse.json({ id, zalo: zaloResult })
}