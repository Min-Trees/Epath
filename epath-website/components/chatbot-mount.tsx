'use client'

/**
 * ChatbotMount
 *
 * Thin wrapper that lazy-loads the heavy Chatbot component.
 * Rationale:
 *   - The full Chatbot is ~50KB (Q&A DB + framer-motion wrappers).
 *   - Eager-importing it on every page adds ~150ms of JS parse /
 *     hydration before the actual page is interactive, which is
 *     what the user perceives as "delay when switching pages".
 *   - `next/dynamic` with `ssr: false` defers loading until after
 *     first paint so route navigation feels instant.
 *   - The import itself is then cached for subsequent navigations.
 */

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Chatbot = dynamic(
  () => import('./chatbot').then((m) => m.Chatbot),
  {
    ssr: false,
    // Skeleton keeps the bottom-right corner reserved so the layout
    // doesn't jump when the bubble finally mounts.
    loading: () => (
      <div
        aria-hidden
        className="fixed bottom-6 right-4 sm:right-6 z-[70] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#3A53A3]/40 animate-pulse"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      />
    ),
  }
)

export function ChatbotMount() {
  // Don't block the first paint: only mount the chatbot after the
  // initial route has finished its critical work.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    // requestIdleCallback would be nicer, but Safari doesn't support
    // it without polyfill. setTimeout(0) is a safe universal fallback
    // that still runs after paint.
    const id = window.setTimeout(() => setReady(true), 50)
    return () => window.clearTimeout(id)
  }, [])

  if (!ready) return null
  return <Chatbot />
}
