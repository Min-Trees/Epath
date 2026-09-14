// Server-side data fetch for public pages. Falls back to static data
// (the existing hardcoded arrays and messages JSON) when Firestore is
// not configured, so the website keeps working during setup.
import 'server-only'
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
  MediaRepo,
} from './cms-repo'
import { getPageSections, type PageSection } from './pages-repo'
import type {
  Locale,
  Statistic,
  Testimonial,
  HeroContent,
  AboutContent,
  SiteSettings,
} from './cms-types'
import { getAdminDb } from './firebase-admin'
import { CollectionNames } from './cms-types'

export interface CmsBundle {
  configured: boolean
  faqs: Awaited<ReturnType<typeof FaqsRepo.listActive>>
  coreValues: Awaited<ReturnType<typeof CoreValuesRepo.listActive>>
  pathways: Awaited<ReturnType<typeof PathwaysRepo.listActive>>
  programs: Awaited<ReturnType<typeof ProgramsRepo.listActive>>
  partners: Awaited<ReturnType<typeof PartnersRepo.listActive>>
  events: Awaited<ReturnType<typeof EventsRepo.listActive>>
  admissionSteps: Awaited<ReturnType<typeof AdmissionStepsRepo.listActive>>
  achievements: Awaited<ReturnType<typeof AchievementsRepo.listActive>>
  teamMembers: Awaited<ReturnType<typeof TeamMembersRepo.listActive>>
  statistics: Statistic[]
  testimonials: Testimonial[]
  heroContent: HeroContent | null
  aboutContent: AboutContent | null
  siteSettings: SiteSettings | null
}

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

async function loadActiveCollection<T extends { isActive?: boolean; order?: number }>(
  name: string
): Promise<T[]> {
  try {
    const db = getAdminDb()
    const snap = await db.collection(name).get()
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as unknown as T))
      .filter((it) => (it as Record<string, unknown>).isActive !== false)
      .sort((a, b) => ((a as Record<string, unknown>).order as number ?? 0) - ((b as Record<string, unknown>).order as number ?? 0))
  } catch {
    return []
  }
}

export async function loadCmsBundle(): Promise<CmsBundle> {
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
      FaqsRepo.listActive(),
      CoreValuesRepo.listActive(),
      PathwaysRepo.listActive(),
      ProgramsRepo.listActive(),
      PartnersRepo.listActive(),
      EventsRepo.listActive(),
      AdmissionStepsRepo.listActive(),
      AchievementsRepo.listActive(),
      TeamMembersRepo.listActive(),
      loadActiveCollection<Statistic>(CollectionNames.statistics),
      loadActiveCollection<Testimonial>(CollectionNames.testimonials),
      loadSingleton<HeroContent>(CollectionNames.heroContent),
      loadSingleton<AboutContent>(CollectionNames.aboutContent),
      loadSingleton<SiteSettings>(CollectionNames.siteSettings),
    ])
    return {
      configured: true,
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
    }
  } catch {
    return {
      configured: false,
      faqs: [],
      coreValues: [],
      pathways: [],
      programs: [],
      partners: [],
      events: [],
      admissionSteps: [],
      achievements: [],
      teamMembers: [],
      statistics: [],
      testimonials: [],
      heroContent: null,
      aboutContent: null,
      siteSettings: null,
    }
  }
}

export async function loadPageSections(pageId: string): Promise<PageSection[]> {
  try {
    return (await getPageSections(pageId as Parameters<typeof getPageSections>[0])).filter(
      (s) => s.isActive
    )
  } catch {
    return []
  }
}

/** Helper to pick a localized string. */
export function t(localized: { vi: string; en: string } | undefined, locale: Locale) {
  if (!localized) return ''
  return localized[locale] || localized.vi
}

/**
 * Recursively converts Firestore special types (Timestamp, DocumentReference,
 * GeoPoint, Blob, FieldValue, etc.) to plain JavaScript equivalents so the
 * result can safely be serialised and passed as a React prop from a Server
 * Component to a Client Component (or returned from an API route).
 */
export function toPlainObject(value: unknown): unknown {
  if (value === null || value === undefined) return value

  // Firestore Timestamp → ISO string
  if (
    typeof value === 'object' &&
    value !== null &&
    '__datastore_type' in (value as Record<string, unknown>)
  ) {
    const t = value as Record<string, unknown>
    if (t.toDate && typeof t.toDate === 'function') {
      return (t.toDate as () => Date)().toISOString()
    }
  }

  // Firestore Timestamp (check constructor name for robustness)
  if (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>).constructor?.name === 'Timestamp'
  ) {
    const t = value as { toDate?: () => Date }
    if (t.toDate) {
      try {
        return t.toDate().toISOString()
      } catch {
        return null
      }
    }
  }

  // Plain array
  if (Array.isArray(value)) {
    return value.map(toPlainObject)
  }

  // Plain object (but not a class instance)
  if (
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = toPlainObject(v)
    }
    return out
  }

  // Primitives and unknown non-plain objects (DocumentReference, GeoPoint,
  // Blob, FieldValue, etc.) → stringify or drop
  if (typeof value !== 'object' || value === null) return value
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return null
  }
}

/**
 * Load hero content records for a specific page server-side.
 *
 * Mirrors the logic in `app/api/public/cms/route.ts` so the SSR pass can
 * include the hero video/image without waiting for the client-side
 * CmsProvider round-trip. Returns the raw record (or null) for the
 * requested pageId; falls back to the legacy single-record hero if no
 * pageId-specific record exists.
 *
 * The result is sanitised through `toPlainObject` so it contains only
 * JSON-serialisable values and can safely be passed as a prop to
 * Client Components.
 */
export async function loadHeroContentForPage(
  pageId: string
): Promise<Record<string, unknown> | null> {
  try {
    const db = getAdminDb()
    const snap = await db.collection(CollectionNames.heroContent).get()
    let pageMatch: Record<string, unknown> | null = null
    let legacyHome: Record<string, unknown> | null = null
    for (const doc of snap.docs) {
      const raw = doc.data()
      const data = toPlainObject({ id: doc.id, ...raw }) as Record<string, unknown>
      if (data.isActive === false) continue
      const status = (data.status as string | undefined) ?? 'PUBLISHED'
      if (status !== 'PUBLISHED') continue
      const recordPageId = (data.pageId as string | undefined) || 'home'
      if (recordPageId === pageId && !pageMatch) pageMatch = data
      if (recordPageId === 'home') legacyHome = legacyHome ?? data
    }
    return pageMatch ?? legacyHome ?? null
  } catch {
    return null
  }
}
