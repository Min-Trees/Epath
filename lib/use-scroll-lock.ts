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
 * iOS Safari ignores `overflow: hidden` on <body> alone, so we also pin
 * the body with `position: fixed` and restore the exact scroll offset on
 * release. That combination is what makes the background truly frozen
 * on iOS while still allowing the overlay itself to scroll.
 */
let lockCount = 0
let savedOverflow = ''
let savedPosition = ''
let savedTop = ''
let savedLeft = ''
let savedRight = ''
let savedWidth = ''
let savedScrollY = 0

function lock() {
  if (typeof document === 'undefined') return

  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    savedPosition = document.body.style.position
    savedTop = document.body.style.top
    savedLeft = document.body.style.left
    savedRight = document.body.style.right
    savedWidth = document.body.style.width
    savedScrollY = window.scrollY

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
  }

  lockCount++
}

function unlock() {
  if (typeof document === 'undefined') return

  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return

  document.body.style.overflow = savedOverflow
  document.body.style.position = savedPosition
  document.body.style.top = savedTop
  document.body.style.left = savedLeft
  document.body.style.right = savedRight
  document.body.style.width = savedWidth

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
