'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Bot, X, MessageCircle } from 'lucide-react'
import { pickLocale, chatInviteContent } from '@/lib/chatbot-content'

const STORAGE_KEY = 'epath-chat-invite-dismissed-at'
const INVITE_DELAY_MS = 45_000   // 45s — wait until user is genuinely browsing
const AUTO_HIDE_MS = 12_000      // 12s — fade away if they ignore it
const DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1_000 // 24h before re-showing

interface ChatInviteProps {
  onStartChat: () => void
}

/**
 * A gentle browsing invite that appears center-screen after the user has
 * been on the page long enough to signal real intent — not a cold-popup.
 *
 * Design: macOS/iOS notification style
 *   - Card floats center-screen, with only a soft blur backdrop behind it
 *   - Never blocks the edges or persistent UI (header, chat bubble)
 *   - Auto-dismisses + fades if ignored (12s), or stays dismissed 24h
 *   - Friendly, warm tone — not a sales banner
 *   - Opens the chatbot on click
 *   - Content is fully localized via next-intl (vi + en)
 */
export function ChatInvite({ onStartChat }: ChatInviteProps) {
  const locale = useLocale()
  const l = pickLocale(locale)
  const c = chatInviteContent[l]

  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoHideRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const dismissedAt = Number(raw)
        if (Date.now() - dismissedAt < DISMISS_COOLDOWN_MS) return
      } catch {
        // Corrupted value — treat as not dismissed
      }
    }

    timerRef.current = setTimeout(() => {
      if (dismissedRef.current) return
      setVisible(true)

      autoHideRef.current = setTimeout(() => {
        if (dismissedRef.current) return
        setVisible(false)
      }, AUTO_HIDE_MS)
    }, INVITE_DELAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (autoHideRef.current) clearTimeout(autoHideRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDismiss = () => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    if (autoHideRef.current) clearTimeout(autoHideRef.current)
    setVisible(false)
  }

  const handleAccept = () => {
    if (autoHideRef.current) clearTimeout(autoHideRef.current)
    setVisible(false)
    onStartChat()
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Soft backdrop — transparent, pointer-events-none so page
              behind remains fully interactive. */}
          <motion.div
            key="chat-invite-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[64] pointer-events-none"
            style={{ background: 'transparent' }}
            aria-hidden
          />

          {/* The card — anchored to bottom-LEFT so it sits BELOW the
              text column and ABOVE the floating chat bubble (which is
              at bottom-right). It never covers the character
              illustration on the right or the chat launch icon. The
              card only takes up the left ~40% of the screen at most,
              so the hero illustration stays fully visible. */}
          <motion.div
            key="chat-invite-card"
            role="dialog"
            aria-modal="false"
            aria-label={l === 'vi' ? 'Gợi ý trò chuyện với Bộ phận Học vụ' : 'Invite to chat with the Academic Department'}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{
              opacity: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              scale: { type: 'spring', stiffness: 260, damping: 22 },
              y: { type: 'spring', stiffness: 260, damping: 22 },
            }}
            className="fixed z-[65] pointer-events-none left-3 right-3 bottom-24 sm:left-6 sm:right-auto sm:bottom-28 flex sm:justify-start justify-center"
          >
            <div
              className="pointer-events-auto w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#DEDDD6] overflow-hidden"
              style={{ boxShadow: '0 20px 60px -12px rgba(30, 53, 112, 0.2)' }}
            >
              {/* Colored top accent */}
              <div className="h-1.5 bg-gradient-to-r from-[#2E4A9E] via-[#8DC63F] to-[#F26522]" />

              <div className="px-6 py-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar with subtle glow */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-[#2E4A9E]/30 blur-md" />
                      <div 
                        className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)',
                          boxShadow: '0 8px 20px -6px rgba(46, 74, 158, 0.4)',
                        }}
                      >
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      {/* Online pulse */}
                      <motion.span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"
                        animate={{ scale: [1, 0.8, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>

                    <div>
                      <p className="text-[15px] font-semibold text-[#20242B] leading-tight">
                        {c.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <motion.span
                          className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="text-xs text-[#5C6069]">{c.online}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={handleDismiss}
                    aria-label={l === 'vi' ? 'Đóng' : 'Close'}
                    className="shrink-0 p-2 rounded-full text-[#5C6069] hover:text-[#20242B] hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <p className="text-sm text-[#5C6069] leading-relaxed mb-5 whitespace-pre-line">
                  {c.subtitle}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold text-white transition-all duration-200 active:scale-95 cursor-pointer hover:opacity-95"
                    style={{
                      background: 'linear-gradient(135deg, #F26522 0%, #C94F16 100%)',
                      boxShadow: '0 8px 20px -6px rgba(242, 101, 34, 0.45)',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {c.cta}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="py-2.5 px-4 rounded-full text-sm text-[#5C6069] hover:text-[#20242B] hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    {c.dismiss}
                  </button>
                </div>
              </div>

              {/* Progress bar — shows remaining time before auto-dismiss */}
              <div className="h-0.5 bg-gray-100">
                <motion.div
                  key="progress"
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg, #2E4A9E 0%, #F26522 100%)' }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: AUTO_HIDE_MS / 1000, ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
