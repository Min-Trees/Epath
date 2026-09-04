// Settings field access helpers to avoid TypeScript narrowing {}.
export function getSettingStr(settings: Record<string, unknown> | null | undefined, key: string): string {
  return String((settings?.[key] as string) || '')
}

export function getSettingLocalized(
  settings: Record<string, unknown> | null | undefined,
  viKey: string,
  enKey: string,
  locale: string
): string {
  if (locale === 'en') {
    return String((settings?.[enKey] as string) || (settings?.[viKey] as string) || '')
  }
  return String((settings?.[viKey] as string) || (settings?.[enKey] as string) || '')
}
