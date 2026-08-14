// Wrapper renamed to hook helper
'use client'

import { useEffect, useState } from 'react'
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
} from '@/lib/cms-types'

export interface PublicCmsBundle {
  configured: boolean
  faqs: FAQ[]
  coreValues: CoreValue[]
  pathways: LearningPathway[]
  programs: Program[]
  partners: Partner[]
  events: CmsEvent[]
  admissionSteps: AdmissionStep[]
  achievements: Achievement[]
  teamMembers: TeamMember[]
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
}

/**
 * Client-side hook that fetches CMS content once on mount and exposes
 * it. When Firestore is not configured the hook returns `configured:false`
 * so the page can fall back to hardcoded data.
 */
export function usePublicCms(): PublicCmsBundle {
  const [bundle, setBundle] = useState<PublicCmsBundle>(EMPTY)
  useEffect(() => {
    let cancelled = false
    fetch('/api/public/cms')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setBundle({ ...EMPTY, ...(data as Partial<PublicCmsBundle>) })
        }
      })
      .catch(() => {
        // keep empty fallback
      })
    return () => {
      cancelled = true
    }
  }, [])
  return bundle
}