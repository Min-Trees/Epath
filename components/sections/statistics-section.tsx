'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import type { Statistic } from '@/lib/cms-types'

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
      const tick = (now: number) => {
        const elapsed = now - beginTimestamp
        const progress = Math.min(elapsed / 1500, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(value * eased))
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      beginTimestamp = timestamp
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
        className="inline-flex items-baseline justify-center px-6 py-4 rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-4xl md:text-5xl font-bold tabular-nums" style={{ color }}>
          {count}
        </span>
        <span className="text-3xl md:text-4xl font-bold" style={{ color }}>
          {suffix}
        </span>
      </div>
      <p className="mt-3 text-sm md:text-base font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  )
}

// Fallback stats for when CMS is empty
const fallbackStats = [
  { value: 10, suffix: '+', statKey: 'years' },
  { value: 4, suffix: '', statKey: 'levels' },
  { value: 60, suffix: '+', statKey: 'edmentum' },
  { value: 3, suffix: '+', statKey: 'partners' },
  { value: 100, suffix: '%', statKey: 'personalized' },
]

export function StatisticsSection() {
  const t = useTranslations('stats')
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.25 })
  const [active, setActive] = useState(false)
  const [stats, setStats] = useState<Statistic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/statistics')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setStats(data.items.filter((s: Statistic) => s.isActive).sort((a: Statistic, b: Statistic) => a.order - b.order))
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const update = () => setActive(el.dataset.active === 'true')
    update()
    const io = new MutationObserver(update)
    io.observe(el, { attributes: true, attributeFilter: ['data-active'] })
    return () => io.disconnect()
  }, [sectionRef])

  const displayStats = stats.length > 0 ? stats : fallbackStats

  return (
    <section ref={sectionRef} className="py-20 bg-white stats-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayStats.map((stat, index) => {
            const accent = accentCycle[index % accentCycle.length]
            const isFallback = stats.length === 0
            const statValue = isFallback
              ? (stat as { value: number }).value
              : parseInt((stat as Statistic).value) || 0
            const statSuffix = isFallback
              ? (stat as { suffix: string }).suffix
              : (stat as Statistic).suffix || ''
            const statLabel = isFallback
              ? t((stat as { statKey: string }).statKey)
              : (stat as Statistic).label?.vi || (stat as Statistic).label?.en || ''

            return (
              <Counter
                key={isFallback ? (stat as { statKey: string }).statKey : (stat as Statistic).id}
                value={statValue}
                suffix={statSuffix}
                label={statLabel}
                color={accent.color}
                bgColor={accent.bg}
                active={active}
                startDelayMs={index * 80}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
