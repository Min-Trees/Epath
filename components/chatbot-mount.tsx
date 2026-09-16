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
 *
 * Also mounts ChatInvite — a gentle browsing invite that appears
 * after 45s of genuine browsing time (non-intrusive, auto-hides).
 * Both components coordinate via sessionStorage so clicking the
 * invite opens the chat bubble.
 */

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ChatInvite } from './chat-invite'
import { AdvisoryLeadPopup } from './advisory-lead-popup'

const OPEN_CHAT_KEY = 'epath-wants-chat-open'

const Chatbot = dynamic(
  () => import('./chatbot').then((m) => m.Chatbot),
  {
    ssr: false,
    // Skeleton keeps the bottom-right corner reserved so the layout
    // doesn't jump when the bubble finally mounts. Matches the FAB's
    // navy gradient via the shared `.epath-chat-bubble` styles.
    loading: () => (
      <div
        aria-hidden
        className="chat-fab fixed bottom-4 right-4 sm:bottom-5 sm:right-6 lg:bottom-6 lg:right-6 z-[70] animate-pulse opacity-60"
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
    const id = window.setTimeout(() => setReady(true), 50)
    return () => window.clearTimeout(id)
  }, [])

  const handleInviteOpenChat = () => {
    // Signal the chatbot (once it's mounted) to open itself.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(OPEN_CHAT_KEY, '1')
      window.dispatchEvent(new CustomEvent('epath-open-chat'))
    }
  }

  if (!ready) return null
  return (
    <>
      <AdvisoryLeadPopup />
      <ChatInvite onStartChat={handleInviteOpenChat} />
      <Chatbot />
    </>
  )
}
