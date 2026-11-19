'use client'

import { useEffect } from 'react'

/**
 * Toggle a `body` class while an overlay is open.
 *
 * Used to hide the floating Preny chatbot widget while a full-screen
 * overlay (mobile nav panel, modal, advisory popup) is showing. The
 * widget is `position: fixed` in the bottom-right corner, which is
 * exactly where the mobile nav panel's "Đăng ký ngay" CTA sits — so it
 * blocks taps there and swallows swipe gestures in that corner, making
 * the panel appear to only scroll when dragging along the screen edge.
 *
 * The widget is injected by a third-party script into <body> and renders
 * inside a shadow root, so it cannot be toggled with React state. A body
 * class + CSS is the simplest reliable way to hide it.
 *
 * @param active Whether the overlay is currently open.
 * @param className The body class to toggle. Defaults to 'epath-overlay-open'.
 */
export function useBodyClass(active: boolean, className = 'epath-overlay-open') {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const body = document.body
    body.classList.add(className)

    return () => {
      body.classList.remove(className)
    }
  }, [active, className])
}
