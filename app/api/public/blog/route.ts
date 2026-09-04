import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { CollectionNames, type BlogPost } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200)
  const category = searchParams.get('category') || ''
  const tag = searchParams.get('tag') || ''

  try {
    let query = getAdminDb()
      .collection(CollectionNames.blogPosts)
      .where('isActive', '==', true)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(limit)

    const snap = await query.get()
    let items: BlogPost[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) }))

    if (slug) {
      const match = items.find((p) => p.slug === slug)
      if (!match) return NextResponse.json({ post: null }, { status: 404 })
      return NextResponse.json({ post: match })
    }
    if (category) items = items.filter((p) => p.category === category)
    if (tag) items = items.filter((p) => p.tags.includes(tag))

    return NextResponse.json({ items })
  } catch (err) {
    console.warn('[public/blog] Firestore unavailable:', (err as Error).message)
    return NextResponse.json({ items: [], configured: false })
  }
}