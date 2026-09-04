// Helper for accessing dynamic properties on unknown-typed CMS data.
// Prevents TypeScript from narrowing Record<string, unknown> to {}.
export function asRecord(val: unknown): Record<string, unknown> {
  return val as Record<string, unknown>
}
