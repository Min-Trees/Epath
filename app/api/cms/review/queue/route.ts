// GET /api/cms/review/queue
// Trả về tất cả document PENDING_REVIEW gom từ 13 collection.
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { listPendingReview } from '@/lib/review/repo'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await listPendingReview()
  return NextResponse.json({ items })
}
