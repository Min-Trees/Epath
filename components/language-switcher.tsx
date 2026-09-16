'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState, useTransition } from 'react'

/**
 * LanguageSwitcher
 *
 * Displays EN and VI flag icon buttons side by side.
 * - Active language: opacity 1
 * - Inactive language: opacity ~0.55 (hover ~1.0)
 *
 * Retains zero-flicker transitions via:
 * 1. optimisticLocale state for instant visual feedback.
 * 2. router.replace with scroll: false.
 * 3. document.startViewTransition for smooth cross-fade.
 */
export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const serverLocale = useLocale()
  const [optimisticLocale, setOptimisticLocale] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentLocale = optimisticLocale ?? serverLocale

  const switchLanguage = (targetLocale: string) => {
    if (targetLocale === currentLocale) return

    const segments = pathname.split('/')
    segments[1] = targetLocale
    const newPath = segments.join('/')
    if (newPath === pathname) return

    setOptimisticLocale(targetLocale)

    const navigate = () => {
      startTransition(() => {
        router.replace(newPath, { scroll: false })
      })
    }

    const anyDoc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    if (typeof anyDoc.startViewTransition === 'function') {
      anyDoc.startViewTransition(navigate)
    } else {
      navigate()
    }
  }

  useEffect(() => {
    if (optimisticLocale && serverLocale === optimisticLocale) {
      setOptimisticLocale(null)
    }
  }, [serverLocale, optimisticLocale])

  const activeLocale = mounted ? currentLocale : serverLocale

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">

      <button
        type="button"
        onClick={() => switchLanguage('vi')}
        aria-label="Chuyển sang Tiếng Việt"
        title="Tiếng Việt"
        className={cn(
          'transition-all duration-200 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a54a4]',
          activeLocale === 'vi'
            ? 'opacity-100 scale-105 cursor-default'
            : 'opacity-55 hover:opacity-100 scale-95 hover:scale-100 cursor-pointer'
        )}
      >
        <Image
          src="/images/VIE_iconLanaguage.png"
          alt="Tiếng Việt"
          width={32}
          height={32}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain"
          priority
        />
      </button>
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        aria-label="Switch to English"
        title="English"
        className={cn(
          'transition-all duration-200 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3a54a4]',
          activeLocale === 'en'
            ? 'opacity-100 scale-105 cursor-default'
            : 'opacity-55 hover:opacity-100 scale-95 hover:scale-100 cursor-pointer'
        )}
      >
        <Image
          src="/images/ENG_iconLanaguage.png"
          alt="English"
          width={32}
          height={32}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain"
          priority
        />
      </button>
    </div>
  )
}
