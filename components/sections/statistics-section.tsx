'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Statistic, Locale } from '@/lib/cms-types'

interface CounterProps {
  value: number
  suffix: string
  label: string
  color: string
  bgColor: string
  active: boolean
  startDelayMs: number
}

function Counter({ value, suffix, label, color, bgColor, active, startDelayMs }: CounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    let raf = 0
    let timeoutId: ReturnType<typeof setTimeout>
    const begin = (timestamp: number) => {
      beginTimestamp = timestamp
      const tick = (now: number) => {
        const elapsed = now - beginTimestamp
        const progress = Math.min(elapsed / 1500, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(value * eased))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    let beginTimestamp = 0
    timeoutId = setTimeout(() => begin(performance.now()), startDelayMs)
    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(raf)
    }
  }, [active, value, startDelayMs])

  return (
    <div ref={ref} className="stat-cell text-center">
      <div
        className="inline-flex items-baseline justify-center px-6 py-4 rounded-2xl overflow-hidden relative"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ color }}>
          {count}
        </span>
        <span className="text-3xl md:text-4xl font-bold" style={{ color }}>
          {suffix}
        </span>
      </div>
      <p className="mt-3 text-sm md:text-base font-medium" style={{ color: '#FFFFFF' }}>
        {label}
      </p>
    </div>
  )
}

const fallbackStats = [
  { value: 10, suffix: '+', statKey: 'years' },
  { value: 4, suffix: '', statKey: 'levels' },
  { value: 60, suffix: '+', statKey: 'edmentum' },
  { value: 3, suffix: '+', statKey: 'partners' },
  { value: 100, suffix: '%', statKey: 'personalized' },
]

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function StatisticsSection() {
  const t = useTranslations('stats')
  const locale = useLocale() as Locale
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.25 })
  const [active, setActive] = useState(false)
  const { data: cms } = useCmsContext()
  const cmsStats = cms.statistics || []
  const stats = cmsStats
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const update = () => setActive(el.dataset.active === 'true')
    update()
    const io = new MutationObserver(update)
    io.observe(el, { attributes: true, attributeFilter: ['data-active'] })
    return () => io.disconnect()
  }, [sectionRef])

  // Use ONLY ONE data source: CMS if available, otherwise fallback
  // Defensive dedup: collapse stats that share the same value+suffix so a
  // messy Firestore collection never produces duplicate tiles on the page.
  const displayStats = (() => {
    if (stats.length === 0) return fallbackStats
    const seen = new Set<string>()
    const out: Statistic[] = []
    for (const s of stats) {
      const key = `${String((s as Statistic).value).trim()}__${((s as Statistic).suffix || '').trim()}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(s)
    }
    return out
  })()

  return (
    <section 
      ref={sectionRef} 
      className="py-20 stats-section"
      style={{
        background: 'linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayStats.map((stat, index) => {
            const accent = accentCycle[index % accentCycle.length]
            const isUsingFallback = stats.length === 0

            const statValue = isUsingFallback
              ? (stat as { value: number }).value
              : parseInt((stat as Statistic).value) || 0
            const statSuffix = isUsingFallback
              ? (stat as { suffix: string }).suffix
              : (stat as Statistic).suffix || ''
            const statLabel = isUsingFallback
              ? t((stat as { statKey: string }).statKey)
              : pick((stat as Statistic).label, locale) || pick((stat as Statistic).label, 'vi' as Locale)

            return (
              <div key={isUsingFallback ? (stat as { statKey: string }).statKey : (stat as Statistic).id} className="relative">
                {!isUsingFallback && (stat as Statistic).imageUrl && (
                  <div className="aspect-square w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4" style={{ borderColor: accent.color }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(stat as Statistic).imageUrl}
                      alt={statLabel}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <Counter
                  value={statValue}
                  suffix={statSuffix}
                  label={statLabel}
                  color={accent.color}
                  bgColor={accent.bg}
                  active={active}
                  startDelayMs={index * 80}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
