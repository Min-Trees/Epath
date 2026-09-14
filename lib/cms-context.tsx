// Context provider for sharing CMS data across components
'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type {
  FAQ,
  CoreValue,
  LearningPathway,
  Program,
  Partner,
  CmsEvent,
  AdmissionStep,
  Achievement,
  TeamMember,
  Statistic,
  Testimonial,
  AboutContent,
  SiteSettings,
} from '@/lib/cms-types'

export interface PublicCmsBundle {
  configured: boolean
  faqs: FAQ[]
  coreValues: CoreValue[]
  pathways: LearningPathway[]
  learningPathways?: LearningPathway[]
  programs: Program[]
  partners: Partner[]
  events: CmsEvent[]
  admissionSteps: AdmissionStep[]
  achievements: Achievement[]
  teamMembers: TeamMember[]
  statistics: Statistic[]
  testimonials: Testimonial[]
  // Hero content indexed by pageId (e.g. 'home', 'about', 'programs', ...).
  // Pages that don't have an explicit entry simply get `null` from the
  // `getHero(pageId)` helper.
  heroContent: Record<string, Record<string, unknown> | null>
  aboutContent: AboutContent | null
  siteSettings: SiteSettings | null
}

const EMPTY: PublicCmsBundle = {
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
  heroContent: {},
  aboutContent: null,
  siteSettings: null,
}

interface CmsContextValue {
  data: PublicCmsBundle
  loading: boolean
  refresh: () => void
}

const CmsContext = createContext<CmsContextValue>({
  data: EMPTY,
  loading: true,
  refresh: () => {},
})

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PublicCmsBundle>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => {
    setRefreshKey(k => k + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const now = Date.now()
        const response = await fetch(`/api/public/cms?_=${now}&k=${refreshKey}`)
        const result = await response.json()
        if (!cancelled) {
          const raw = result as Record<string, unknown>
          const pathways = ((raw.pathways || raw.learningPathways || []) as LearningPathway[])
          setData({
            ...EMPTY,
            ...(result as Partial<PublicCmsBundle>),
            pathways,
            learningPathways: pathways,
            heroContent: normalizeHeroContent((result as { heroContent?: unknown }).heroContent),
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch CMS data:', error)
        if (!cancelled) {
          setData(EMPTY)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [refreshKey])

  return (
    <CmsContext.Provider value={{ data, loading, refresh }}>
      {children}
    </CmsContext.Provider>
  )
}

// Hook to use CMS context
export function useCmsContext(): CmsContextValue {
  const context = useContext(CmsContext)
  if (!context) {
    throw new Error('useCmsContext must be used within CmsProvider')
  }
  return context
}

// Legacy hook for backward compatibility - uses context
export function usePublicCms(): PublicCmsBundle {
  const { data } = useCmsContext()
  return data
}

/**
 * The /api/public/cms route now returns heroContent as a record keyed by
 * `pageId` so each page can have its own hero. Older builds returned a
 * single record. This helper accepts either shape and returns the keyed
 * map, defaulting unknown records to the `home` slot so the homepage
 * keeps working through the migration.
 */
function normalizeHeroContent(raw: unknown): Record<string, Record<string, unknown> | null> {
  if (!raw) return {}
  if (typeof raw !== 'object') return {}
  // Already keyed (new API) - look like Record<string, ...>
  const obj = raw as Record<string, unknown>
  const firstKey = Object.keys(obj)[0]
  if (!firstKey) return {}
  // Detect new shape: any key whose value looks like a hero record (has
  // pageId/videoUrl/backgroundImage) OR a pageId slug (e.g. 'home').
  const looksKeyed = Object.values(obj).every(
    (v) => v === null || typeof v === 'object'
  ) && (
    firstKey === 'home' ||
    firstKey === 'about' ||
    firstKey === 'programs' ||
    firstKey === 'partners' ||
    firstKey === 'admissions' ||
    firstKey === 'events'
  )
  if (looksKeyed) {
    const out: Record<string, Record<string, unknown> | null> = {}
    for (const [k, v] of Object.entries(obj)) {
      out[k] = (v && typeof v === 'object') ? (v as Record<string, unknown>) : null
    }
    return out
  }
  // Legacy single-record shape: wrap under 'home'.
  return { home: obj as Record<string, unknown> }
}
