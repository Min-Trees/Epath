/**
 * Safe date formatter that handles every shape Firestore / API can throw
 * at us: Date, ISO string, epoch ms, Firestore Timestamp
 * ({ seconds, nanoseconds } and the JSON-serialized
 * { _seconds, _nanoseconds }), or anything with a toDate() method.
 *
 * Returns '—' (or whatever placeholder you pass) when the value is
 * missing or unparseable, instead of crashing the whole page.
 */
export function toDateSafe(value: unknown): Date | null {
  if (value === null || value === undefined) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string') {
    if (!value.trim()) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>

    // Firestore Timestamp JSON shape (also seen as { _seconds, _nanoseconds }
    // when serialized through `JSON.stringify(timestamp.toJSON())`).
    const seconds =
      (obj.seconds as number | undefined) ??
      (obj._seconds as number | undefined)
    const nanoseconds =
      (obj.nanoseconds as number | undefined) ??
      (obj._nanoseconds as number | undefined)
    if (typeof seconds === 'number') {
      const ms =
        seconds * 1000 +
        (typeof nanoseconds === 'number' ? Math.floor(nanoseconds / 1_000_000) : 0)
      const d = new Date(ms)
      return Number.isNaN(d.getTime()) ? null : d
    }

    // Firestore Timestamp instance on the client.
    if (typeof (value as { toDate?: () => Date }).toDate === 'function') {
      try {
        const d = (value as { toDate: () => Date }).toDate()
        return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null
      } catch {
        return null
      }
    }
  }

  return null
}

export function formatDateVi(
  value: unknown,
  placeholder = '—',
  options: Intl.DateTimeFormatOptions = { hour12: false }
): string {
  const d = toDateSafe(value)
  if (!d) return placeholder
  return d.toLocaleString('vi-VN', options)
}
