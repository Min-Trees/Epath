'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useTransition } from 'react'

/**
 * LanguageSwitcher
 *
 * Optimizations to avoid the language-switch flicker:
 * 1. We keep an `optimisticLocale` state so the visible label updates
 *    instantly on click instead of waiting for the router to settle.
 * 2. We use `router.replace` (not `router.push`) so the URL change
 *    does not push a new history entry, and so the next click goes
 *    forward rather than relying on browser back/forward.
 * 3. We wrap the navigation in `startTransition` so React keeps the
 *    current tree interactive while the new one streams in.
 * 4. When the browser supports the View Transitions API, we wrap the
 *    navigation in `document.startViewTransition` for a buttery-smooth
 *    cross-fade of the entire page (Chrome / Edge / Safari 18+).
 */
export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const serverLocale = useLocale()
  const [optimisticLocale, setOptimisticLocale] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // While transitioning we display the *target* locale, otherwise the
  // server-detected one. This prevents the UI from briefly showing the
  // old locale after the URL has changed.
  const currentLocale = optimisticLocale ?? serverLocale
  const switchTo = currentLocale === 'vi' ? 'en' : 'vi'

  const toggleLocale = () => {
    const segments = pathname.split('/')
    segments[1] = switchTo
    const newPath = segments.join('/')
    if (newPath === pathname) return

    setOptimisticLocale(switchTo)

    const navigate = () => {
      startTransition(() => {
        router.replace(newPath, { scroll: false })
      })
    }

    // Use the native View Transitions API when available for a
    // perfectly smooth cross-fade. Fall back to router.replace.
    const anyDoc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown
    }
    if (typeof anyDoc.startViewTransition === 'function') {
      anyDoc.startViewTransition(navigate)
    } else {
      navigate()
    }
  }

  // Once the server-rendered locale catches up to our optimistic value
  // we clear the flag.
  useEffect(() => {
    if (optimisticLocale && serverLocale === optimisticLocale) {
      setOptimisticLocale(null)
    }
  }, [serverLocale, optimisticLocale])

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
        'transition-colors duration-200',
        'text-white/90 hover:text-white hover:bg-white/10',
        'view-transition-target'
      )}
      aria-label="Toggle language"
      type="button"
    >
      <Globe className="w-4 h-4" />
      <span
        key={mounted ? currentLocale : 'placeholder'}
        className="uppercase font-semibold inline-block animate-fade-in"
      >
        {mounted ? currentLocale : '—'}
      </span>
      <span className="text-white/60 text-xs">/ {switchTo.toUpperCase()}</span>
    </button>
  )
}
