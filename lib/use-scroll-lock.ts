'use client'

import { useEffect, useRef } from 'react'

/**
 * Global, reference-counted body scroll lock.
 *
 * Why a shared counter instead of save/restore per component:
 *   Multiple overlays can be open at the same time (mobile menu + modal,
 *   advisory popup + registration modal). If each component stored and
 *   restored `body.style.overflow` independently, the last one to unmount
 *   would restore a stale value and either leave the page permanently
 *   frozen or unlock it while another overlay is still open.
 *
 * The counter guarantees the lock is only released when the LAST
 * overlay closes.
 *
 * ── CRITICAL: why we do NOT use `position: fixed` on <body> ──────────────
 * The classic iOS scroll-lock trick is `body { position: fixed; top: -Ypx }`.
 * It DOES freeze the background — but it also breaks every nested scroll
 * container on the page:
 *
 *   When <body> is `position: fixed`, the browser promotes the document
 *   element to the ONLY scroll container. Nested `overflow-y: auto` boxes
 *   stop receiving touch gestures entirely, because the swipe is handed
 *   to the (now frozen, zero-height) document scroller instead.
 *
 *   Measured in this repo: with the body pinned, `documentElement.
 *   scrollHeight` collapsed from 8481px to 690px (viewport height only),
 *   so the mobile nav panel had NO scrollable ancestor left to scroll —
 *   `panel.scrollTop = 300` worked programmatically but a real finger
 *   swipe never moved it. That is exactly the "menu mobile không cuộn
 *   được" symptom.
 *
 * Instead we lock with `overflow: hidden` on BOTH <html> and <body>:
 *   - <html> is the real document scroller, so hiding its overflow stops
 *     the background from scrolling.
 *   - <body> overflow:hidden stops iOS Safari from scrolling the body.
 *   - `overscroll-behavior: none` prevents scroll chaining / rubber-band
 *     from leaking the gesture back to the page.
 *   - The document keeps its full scroll height, so nested overlays
 *     (mobile nav panel, modal bodies) scroll perfectly.
 *
 * We still capture and restore the scroll offset so closing an overlay
 * never leaves the user at a different position than where they started.
 */
let lockCount = 0
let savedHtmlOverflow = ''
let savedBodyOverflow = ''
let savedHtmlOverscroll = ''
let savedBodyOverscroll = ''
let savedScrollY = 0

function lock() {
  if (typeof document === 'undefined') return

  if (lockCount === 0) {
    const html = document.documentElement
    const body = document.body

    savedHtmlOverflow = html.style.overflow
    savedBodyOverflow = body.style.overflow
    savedHtmlOverscroll = html.style.overscrollBehavior
    savedBodyOverscroll = body.style.overscrollBehavior
    savedScrollY = window.scrollY

    // Lock the document scroller + the body. No `position: fixed` so that
    // nested scroll containers keep receiving touch gestures.
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
  }

  lockCount++
}

function unlock() {
  if (typeof document === 'undefined') return

  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return

  const html = document.documentElement
  const body = document.body

  html.style.overflow = savedHtmlOverflow
  body.style.overflow = savedBodyOverflow
  html.style.overscrollBehavior = savedHtmlOverscroll
  body.style.overscrollBehavior = savedBodyOverscroll

  // Restore the scroll position captured at lock time. Without this the
  // page jumps back to the top whenever an overlay closes.
  window.scrollTo(0, savedScrollY)
}

/**
 * Lock the body scroll while `locked` is true.
 *
 * @param locked Whether the scroll lock should be active.
 */
export function useScrollLock(locked: boolean) {
  const isLocked = useRef(false)

  useEffect(() => {
    if (locked && !isLocked.current) {
      lock()
      isLocked.current = true
    } else if (!locked && isLocked.current) {
      unlock()
      isLocked.current = false
    }
  }, [locked])

  // Safety net: release the lock if the component unmounts while locked.
  useEffect(() => {
    return () => {
      if (isLocked.current) {
        unlock()
        isLocked.current = false
      }
    }
  }, [])
}
