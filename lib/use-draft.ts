'use client'

/**
 * useDraft - per-field draft persistence to localStorage.
 *
 * State machine per draftKey:
 *
 *   empty  ──edit──▶  hasDraft  ──markSaved()/discard()──▶  empty
 *                       │
 *                       └─ restore() loads draft into the editor
 *
 * - `value` is the "live" current content (from the editor).
 * - `initialValue` is the last saved value (CMS / props).
 * - A draft exists when `value !== initialValue`.
 *
 * When `value` differs from `initialValue`, we auto-write to
 * localStorage on every change (debounced to ~150ms to avoid thrash).
 *
 * On mount, if there's already a draft in localStorage AND the live
 * `value` matches `initialValue` (e.g. user reloaded after saving),
 * we surface it via `hasDraft` so the editor can offer Restore/Discard.
 *
 * `markSaved()` should be called when the user clicks Save / when the
 * content has been successfully persisted to Firestore - it clears the
 * localStorage entry.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'epath-cms-draft:'

function readDraft(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

function writeDraft(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, value)
  } catch {
    // quota exceeded / private mode - silently ignore
  }
}

function clearDraft(key: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* noop */
  }
}

export interface UseDraftOptions<T extends string> {
  /** Unique namespace key (e.g. "faqs:abc123:answer:vi"). */
  key: string
  /** Current value from the editor. */
  value: T
  /** Last persisted value (used to detect edits). */
  initialValue: T
  /** Disable all draft logic. */
  enabled?: boolean
}

export interface UseDraftResult<T extends string> {
  /** True when a draft exists in localStorage that differs from current. */
  hasDraft: boolean
  /** Replace the editor content with the saved draft. */
  restore: () => T
  /** Discard the saved draft. */
  discard: () => void
  /** Clear the draft (called after a successful save). */
  markSaved: () => void
}

export function useDraft<T extends string>({
  key,
  value,
  initialValue,
  enabled = true,
}: UseDraftOptions<T>): UseDraftResult<T> {
  const [hasDraft, setHasDraft] = useState(false)
  const lastWrittenRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: check whether there's an orphan draft waiting for us.
  useEffect(() => {
    if (!enabled) return
    const existing = readDraft(key)
    if (existing !== null && existing !== initialValue) {
      setHasDraft(true)
    }
  }, [key, initialValue, enabled])

  // Watch value changes - auto-save as a draft (debounced).
  useEffect(() => {
    if (!enabled) return
    if (value === initialValue) {
      // value reverted to saved form -> remove any draft
      clearDraft(key)
      lastWrittenRef.current = null
      setHasDraft(false)
      return
    }
    if (value === lastWrittenRef.current) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      writeDraft(key, value)
      lastWrittenRef.current = value
    }, 150)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, initialValue, key, enabled])

  const restore = useCallback((): T => {
    const existing = readDraft(key)
    if (existing === null) return value
    lastWrittenRef.current = existing
    setHasDraft(false)
    // The parent editor is expected to read this back from us via the
    // returned value; for consumers that want to drive state, the caller
    // simply passes the returned HTML into onChange.
    return existing as T
  }, [key, value])

  const discard = useCallback(() => {
    clearDraft(key)
    lastWrittenRef.current = null
    setHasDraft(false)
  }, [key])

  const markSaved = useCallback(() => {
    clearDraft(key)
    lastWrittenRef.current = null
    setHasDraft(false)
  }, [key])

  return { hasDraft, restore, discard, markSaved }
}