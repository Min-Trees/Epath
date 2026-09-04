// Public list (read-only) of media metadata – used by the media picker.
import { NextResponse } from 'next/server'
import { MediaRepo } from '@/lib/cms-repo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await MediaRepo.list()
    items.sort((a, b) =>
      (b.uploadedAt || '').localeCompare(a.uploadedAt || '')
    )
    return NextResponse.json({ items })
  } catch (err) {
    console.warn('[cms/media] list failed:', (err as Error).message)
    return NextResponse.json({ items: [], configured: false })
  }
}
