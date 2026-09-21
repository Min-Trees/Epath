'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { RegistrationModal } from './registration-modal'

export interface OpenRegistrationOptions {
  program?: string
  title?: string
  source?: string
}

interface RegistrationModalContextType {
  isOpen: boolean
  program: string
  programTitle: string
  source: string
  openRegistrationModal: (options?: OpenRegistrationOptions) => void
  closeRegistrationModal: () => void
}

const RegistrationModalContext = createContext<RegistrationModalContextType | undefined>(undefined)

export function RegistrationModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [program, setProgram] = useState('')
  const [programTitle, setProgramTitle] = useState('')
  const [source, setSource] = useState('website')

  const openRegistrationModal = useCallback((options?: OpenRegistrationOptions) => {
    setProgram(options?.program || '')
    setProgramTitle(options?.title || '')
    setSource(options?.source || 'website')
    setIsOpen(true)
  }, [])

  const closeRegistrationModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Global event listener and click delegation
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Listen for custom event 'epath-open-registration'
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<OpenRegistrationOptions>
      openRegistrationModal(customEvent.detail)
    }
    window.addEventListener('epath-open-registration', handleCustomEvent)

    // 2. Global click interceptor for any element with data-open-register
    // or links containing #form-tu-van, #contact, or admissions?program=
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button') as HTMLElement | null
      if (!target) return

      // Explicit data attribute
      if (target.hasAttribute('data-open-register')) {
        e.preventDefault()
        const prog = target.getAttribute('data-program') || ''
        const title = target.getAttribute('data-title') || ''
        openRegistrationModal({ program: prog, title, source: 'data-attribute' })
        return
      }

      // Check href for registration anchors
      if (target.tagName.toLowerCase() === 'a') {
        const href = target.getAttribute('href') || ''
        
        // Intercept admissions anchor or query param links to show popup instead of jumping
        const isRegisterAnchor =
          href.includes('#form-tu-van') ||
          href.includes('#contact') ||
          href.includes('admissions?program=')

        if (isRegisterAnchor) {
          // Extract program from query if present
          let progParam = ''
          try {
            const urlObj = new URL(href, window.location.origin)
            progParam = urlObj.searchParams.get('program') || ''
          } catch {
            // fallback regex
            const match = href.match(/program=([^&#]+)/)
            if (match) progParam = decodeURIComponent(match[1])
          }

          e.preventDefault()
          openRegistrationModal({
            program: progParam,
            source: 'anchor-interceptor',
          })
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('epath-open-registration', handleCustomEvent)
      document.removeEventListener('click', handleClick)
    }
  }, [openRegistrationModal])

  return (
    <RegistrationModalContext.Provider
      value={{
        isOpen,
        program,
        programTitle,
        source,
        openRegistrationModal,
        closeRegistrationModal,
      }}
    >
      {children}
      <RegistrationModal
        isOpen={isOpen}
        initialProgram={program}
        initialTitle={programTitle}
        source={source}
        onClose={closeRegistrationModal}
      />
    </RegistrationModalContext.Provider>
  )
}

export function useRegistrationModal() {
  const context = useContext(RegistrationModalContext)
  if (!context) {
    throw new Error('useRegistrationModal must be used within a RegistrationModalProvider')
  }
  return context
}
