'use client'

import { CmsProvider } from '@/lib/cms-context'
import { RegistrationModalProvider } from '@/components/registration-modal-context'

interface CmsLayoutWrapperProps {
  children: React.ReactNode
}

export function CmsLayoutWrapper({ children }: CmsLayoutWrapperProps) {
  return (
    <CmsProvider>
      <RegistrationModalProvider>{children}</RegistrationModalProvider>
    </CmsProvider>
  )
}
