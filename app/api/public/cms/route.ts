// Public API - trả về nội dung CMS cho website public.
// Lọc: status === 'PUBLISHED' || (status === 'SCHEDULED' && scheduledAt <= now).
import { NextResponse } from 'next/server'
import {
  FaqsRepo,
  CoreValuesRepo,
  PathwaysRepo,
  ProgramsRepo,
  PartnersRepo,
  EventsRepo,
  AdmissionStepsRepo,
  AchievementsRepo,
  TeamMembersRepo,
} from '@/lib/cms-repo'
import { CollectionNames } from '@/lib/cms-types'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import { getAdminDb } from '@/lib/firebase-admin'

async function loadSingleton<T>(name: string): Promise<T | null> {
  try {
    const db = getAdminDb()
    const snap = await db.collection(name).limit(1).get()
    if (snap.empty) return null
    const doc = snap.docs[0]
    return { id: doc.id, ...(doc.data() as Record<string, unknown>) } as T
  } catch {
    return null
  }
}

/**
 * Loads ALL heroContent records so different pages (home / about /
 * programs / ...) can have their own hero config.
 *
 * Returns a record keyed by `pageId` so consumers can do
 *   `heroContent['home']` to grab the right one without iterating.
 * Any record missing a `pageId` (legacy single-record setups) is kept
 * under the key `'home'` so the homepage still works.
 */
async function loadAllHeroContent() {
  try {
    const db = getAdminDb()
    const snap = await db.collection(CollectionNames.heroContent).get()
    const byPage: Record<string, Record<string, unknown>> = {}
    let legacyFallback: Record<string, unknown> | null = null
    for (const doc of snap.docs) {
      const data = { id: doc.id, ...(doc.data() as Record<string, unknown>) }
      if ((data as Record<string, unknown>).isActive === false) continue
      const status = ((data as Record<string, unknown>).status as string | undefined) ?? 'PUBLISHED'
      if (status !== 'PUBLISHED') continue
      const pageId = ((data as Record<string, unknown>).pageId as string | undefined) || 'home'
      // First wins per pageId so admin "active" state isn't accidentally
      // overridden by stale drafts.
      if (!byPage[pageId]) byPage[pageId] = data
      if (!pageId || pageId === 'home') legacyFallback = legacyFallback ?? data
    }
    // Ensure 'home' is always populated, even if no record had pageId=home.
    if (!byPage.home && legacyFallback) byPage.home = legacyFallback
    return byPage
  } catch {
    return {}
  }
}

async function loadStatistics() {
  try {
    const db = getAdminDb()
    const snap = await db.collection(CollectionNames.statistics).get()
    const now = new Date()
    const all = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      .filter((it) => {
        if ((it as Record<string, unknown>).isActive === false) return false
        const status = (it as Record<string, unknown>).status as string || 'PUBLISHED'
        if (status === 'PUBLISHED') return true
        if (status === 'SCHEDULED' && (it as Record<string, unknown>).scheduledAt) {
          const t = new Date((it as Record<string, unknown>).scheduledAt as string).getTime()
          if (!Number.isNaN(t) && t <= now.getTime()) return true
        }
        return false
      })

    // Collapse duplicates that share the same numeric value + suffix.
    // Admin saves can produce multiple Firestore docs with identical numbers
    // (e.g. after a label rewrite); without dedup the public site renders
    // 3 stat tiles for a single number, which is visually wrong.
    //
    // For each (value, suffix) group we keep ONE record, preferring the one
    // with the longest/most-informative label so admin updates supersede the
    // short fallback labels.
    const byKey = new Map<string, Record<string, unknown>>()
    for (const it of all) {
      const value = (it as Record<string, unknown>).value as string | number | undefined
      const suffix = ((it as Record<string, unknown>).suffix as string | undefined) ?? ''
      if (value === undefined || value === null || value === '') continue
      const key = `${String(value).trim()}__${suffix.trim()}`
      const existing = byKey.get(key)
      if (!existing) {
        byKey.set(key, it)
        continue
      }
      const existingLabelLen = labelLength(existing)
      const candidateLabelLen = labelLength(it)
      if (candidateLabelLen > existingLabelLen) {
        byKey.set(key, it)
      } else if (
        candidateLabelLen === existingLabelLen &&
        ((it as Record<string, unknown>).updatedAt as string | undefined) &&
        ((existing as Record<string, unknown>).updatedAt as string | undefined) &&
        new Date((it as Record<string, unknown>).updatedAt as string).getTime() >
          new Date((existing as Record<string, unknown>).updatedAt as string).getTime()
      ) {
        byKey.set(key, it)
      }
    }

    return Array.from(byKey.values()).sort(
      (a, b) => ((a as Record<string, unknown>).order as number ?? 0) - ((b as Record<string, unknown>).order as number ?? 0)
    )
  } catch {
    return []
  }
}

function labelLength(it: Record<string, unknown>): number {
  const label = (it as Record<string, unknown>).label as
    | { vi?: string; en?: string }
    | undefined
  if (!label) return 0
  const vi = (label.vi || '').trim()
  const en = (label.en || '').trim()
  return Math.max(vi.length, en.length)
}

async function loadTestimonials() {
  try {
    const db = getAdminDb()
    const snap = await db.collection(CollectionNames.testimonials).get()
    const now = new Date()
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      .filter((it) => {
        if ((it as Record<string, unknown>).isActive === false) return false
        const status = (it as Record<string, unknown>).status as string || 'PUBLISHED'
        if (status === 'PUBLISHED') return true
        if (status === 'SCHEDULED' && (it as Record<string, unknown>).scheduledAt) {
          const t = new Date((it as Record<string, unknown>).scheduledAt as string).getTime()
          if (!Number.isNaN(t) && t <= now.getTime()) return true
        }
        return false
      })
      .sort((a, b) => {
        if ((a as Record<string, unknown>).isFeatured !== (b as Record<string, unknown>).isFeatured) {
          return (b as Record<string, unknown>).isFeatured ? 1 : -1
        }
        return ((a as Record<string, unknown>).order as number ?? 0) - ((b as Record<string, unknown>).order as number ?? 0)
      })
  } catch {
    return []
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      faqs,
      coreValues,
      pathways,
      programs,
      partners,
      events,
      admissionSteps,
      achievements,
      teamMembers,
      statistics,
      testimonials,
      heroContent,
      aboutContent,
      siteSettings,
    ] = await Promise.all([
      FaqsRepo.listPublished(),
      CoreValuesRepo.listPublished(),
      PathwaysRepo.listPublished(),
      ProgramsRepo.listPublished(),
      PartnersRepo.listPublished(),
      EventsRepo.listPublished(),
      AdmissionStepsRepo.listPublished(),
      AchievementsRepo.listPublished(),
      TeamMembersRepo.listPublished(),
      loadStatistics(),
      loadTestimonials(),
      loadAllHeroContent(),
      loadSingleton(CollectionNames.aboutContent),
      loadSingleton(CollectionNames.siteSettings),
    ])

    const programsOut = programs.length > 0 ? programs : DEFAULT_PROGRAMS

    const response = NextResponse.json({
      configured: true,
      [CollectionNames.faqs]: faqs,
      [CollectionNames.coreValues]: coreValues,
      [CollectionNames.learningPathways]: pathways,
      [CollectionNames.programs]: programsOut,
      [CollectionNames.partners]: partners,
      [CollectionNames.events]: events,
      [CollectionNames.admissionSteps]: admissionSteps,
      [CollectionNames.achievements]: achievements,
      [CollectionNames.teamMembers]: teamMembers,
      [CollectionNames.statistics]: statistics,
      [CollectionNames.testimonials]: testimonials,
      [CollectionNames.heroContent]: heroContent,
      [CollectionNames.aboutContent]: aboutContent,
      [CollectionNames.siteSettings]: siteSettings,
    })

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.warn('[public/cms] Firestore unavailable:', (error as Error).message)
    const response = NextResponse.json({
      configured: false,
      [CollectionNames.programs]: DEFAULT_PROGRAMS,
    })
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  }
}
