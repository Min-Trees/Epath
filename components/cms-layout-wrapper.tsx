'use client'

import { CmsProvider } from '@/lib/cms-context'

interface CmsLayoutWrapperProps {
  children: React.ReactNode
}

// REMOVED: The Footer previously made its own redundant fetch to /api/public/cms.
// All CMS data is now fetched once by CmsProvider at the layout level and
// shared through context. Footer should read from context instead.
export function CmsLayoutWrapper({ children }: CmsLayoutWrapperProps) {
  return <CmsProvider>{children}</CmsProvider>
}
