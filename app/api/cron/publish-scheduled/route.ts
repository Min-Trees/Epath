// Cron: publish scheduled documents when scheduledAt <= now.
// Yêu cầu header Authorization: Bearer ${CRON_SECRET}.
import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { listScheduledDue } from '@/lib/review/repo'
import { logActivity } from '@/lib/activity-log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function checkCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // dev mode: không có secret thì cho chạy
  const auth = req.headers.get('authorization') || ''
  return auth === `Bearer ${secret}`
}

export async function POST(req: NextRequest) {
  if (!checkCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const due = await listScheduledDue()
    if (due.length === 0) {
      return NextResponse.json({ ok: true, published: 0 })
    }

    const db = getAdminDb()
    const now = new Date()
    const batch = db.batch()
    due.forEach(({ collection, id }) => {
      batch.update(db.collection(collection).doc(id), {
        status: 'PUBLISHED',
        publishedAt: now.toISOString(),
        updatedAt: now,
      })
    })
    await batch.commit()

    await logActivity({
      action: 'publish',
      collection: 'cron',
      documentLabel: 'publish-scheduled',
      changes: { count: due.length, items: due },
      actor: { uid: 'cron', email: 'cron', name: 'Cron publisher', role: 'super_admin' },
    })

    return NextResponse.json({ ok: true, published: due.length })
  } catch (err) {
    console.error('[publish-scheduled] failed:', err)
    return NextResponse.json(
      { error: 'Internal error', message: (err as Error).message },
      { status: 500 }
    )
  }
}

// Vercel Cron dùng GET — support cả 2 để không phụ thuộc.
export const GET = POST
