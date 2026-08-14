'use client'

/**
 * RichTextRenderer - SSR-safe HTML renderer for TipTap output.
 *
 * Why a dedicated component instead of `dangerouslySetInnerHTML`:
 *   - Sanitizes a small whitelist of tags/attrs (no <script>, no
 *     inline event handlers).
 *   - Adds typographic styling that matches the rest of the site
 *     (prose-like, but kept lightweight).
 *   - Supports an optional `compact` mode for short snippets
 *     (used in cards / summaries).
 */
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'a',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'code',
  'pre',
  'hr',
  'span',
])

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  span: new Set(['class']),
}

function sanitize(html: string): string {
  // Strip <script>, <style>, on* handlers, javascript: URLs.
  let safe = html
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed)[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi, '')
  // Drop tags not in the whitelist (keep inner text).
  safe = safe.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tag: string, attrs: string) => {
    const lower = tag.toLowerCase()
    if (!ALLOWED_TAGS.has(lower)) return ''
    const allowed = ALLOWED_ATTRS[lower]
    if (!allowed) return match
    // Strip attributes not in the whitelist.
    const cleaned = attrs.replace(
      /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g,
      (_, name: string, _full: string, dq?: string, sq?: string) => {
        const lname = name.toLowerCase()
        if (!allowed.has(lname)) return ''
        const value = dq ?? sq ?? ''
        return ` ${lname}="${value.replace(/"/g, '&quot;')}"`
      }
    )
    return `<${lower}${cleaned}>`
  })
  return safe
}

export interface RichTextRendererProps {
  /** HTML string produced by RichTextEditor. Empty string is OK. */
  html?: string | null
  /** Trim output to a single line (used in card summaries). */
  compact?: boolean
  className?: string
}

export function RichTextRenderer({ html, compact, className }: RichTextRendererProps) {
  const safe = useMemo(() => {
    const raw = (html ?? '').toString()
    if (!raw) return ''
    return sanitize(raw)
  }, [html])

  if (!safe) return null

  if (compact) {
    // Strip block tags to produce a short inline summary.
    const inline = safe
      .replace(/<\s*br\s*\/?\s*>/gi, ' ')
      .replace(/<\/(p|h[1-6]|li|blockquote|pre)>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return (
      <span className={cn('line-clamp-2', className)}>{inline}</span>
    )
  }

  return (
    <div
      className={cn(
        'rich-text-content',
        '[&_a]:text-[#3A53A3] [&_a]:underline [&_a:hover]:text-[#2E4389]',
        '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-[#231F20]',
        '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-[#231F20]',
        '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-[#231F20]',
        '[&_p]:my-2 [&_p]:leading-relaxed',
        '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2',
        '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2',
        '[&_li]:my-1',
        '[&_blockquote]:border-l-4 [&_blockquote]:border-[#3A53A3]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-[#6B6B6B]',
        '[&_strong]:font-bold',
        '[&_em]:italic',
        '[&_u]:underline',
        '[&_code]:bg-[#F8F9FA] [&_code]:px-1 [&_code]:rounded [&_code]:text-sm',
        className
      )}
      // Sanitized above; safe to inject.
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  )
}