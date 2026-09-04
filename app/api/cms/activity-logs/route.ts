import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { getAdminDb } from '@/lib/firebase-admin'
import { CollectionNames } from '@/lib/cms-types'

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') || 100), 500)
  const collection = searchParams.get('collection') || ''
  const action = searchParams.get('action') || ''

  try {
    let query = getAdminDb()
      .collection(CollectionNames.activityLogs)
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const snap = await query.get()
    const rawItems: Array<{ id: string; collection?: string; action?: string; [k: string]: unknown }> = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
    let items: Array<{ id: string; collection?: string; action?: string; [k: string]: unknown }> = rawItems

    if (collection) items = items.filter((i) => i.collection === collection)
    if (action) items = items.filter((i) => i.action === action)

    return NextResponse.json({ items })
  } catch (err) {
    console.error('[activity-logs/list] failed:', err)
    return NextResponse.json({ items: [], error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE() {
  // Reserved for future "clear logs" feature. Disabled by default for safety.
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}