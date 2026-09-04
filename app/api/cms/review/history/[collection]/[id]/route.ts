// GET /api/cms/review/history/[collection]/[id]
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { isReviewable } from '@/lib/review/with-review'
import { getHistory } from '@/lib/review/repo'

export async function GET(
  _req: NextRequest,
  { params }: { params: { collection: string; id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection, id } = params
  if (!isReviewable(collection)) {
    return NextResponse.json({ error: 'Collection không hỗ trợ review' }, { status: 400 })
  }

  const history = await getHistory(collection, id)
  return NextResponse.json({ items: history })
}
