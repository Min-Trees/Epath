import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import {
  getPageSections,
  upsertPageSection,
  deletePageSection,
  reorderPageSections,
  PageSlugSchema,
  SectionTypeSchema,
} from '@/lib/pages-repo'

const SectionSchema = z.object({
  id: z.string().min(1),
  pageId: PageSlugSchema,
  type: SectionTypeSchema,
  order: z.number().int().nonnegative(),
  isActive: z.boolean().default(true),
  data: z.record(z.unknown()).default({}),
})

const BodySchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('list'), pageId: PageSlugSchema }),
  z.object({ action: z.literal('upsert'), section: SectionSchema }),
  z.object({
    action: z.literal('delete'),
    pageId: PageSlugSchema,
    id: z.string(),
  }),
  z.object({
    action: z.literal('reorder'),
    pageId: PageSlugSchema,
    ids: z.array(z.string()).min(1),
  }),
])

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const body = parsed.data
  switch (body.action) {
    case 'list':
      return NextResponse.json({ sections: await getPageSections(body.pageId) })
    case 'upsert':
      await upsertPageSection(body.section)
      return NextResponse.json({ ok: true })
    case 'delete':
      await deletePageSection(body.pageId, body.id)
      return NextResponse.json({ ok: true })
    case 'reorder':
      await reorderPageSections(body.pageId, body.ids)
      return NextResponse.json({ ok: true })
  }
}