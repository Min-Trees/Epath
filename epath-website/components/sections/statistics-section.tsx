'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'

const stats = [
  { value: 10, suffix: '+', statKey: 'years' },
  { value: 4, suffix: '', statKey: 'levels' },
  { value: 60, suffix: '+', statKey: 'edmentum' },
  { value: 3, suffix: '+', statKey: 'partners' },
  { value: 100, suffix: '%', statKey: 'personalized' },
]

interface CounterProps {
  value: number
  suffix: string
  label: string
  color: string
  bgColor: string
  /** When the parent section becomes active, start the counter. */
  active: boolean
  /** Staggered start so the numbers appear in sequence, not at once. */
  startDelayMs: number
}

/**
 * Counter – uses rAF (no setInterval jitter) but no motion wrapper.
 * The entrance scale/fade is CSS (see .stat-cell in globals.css); we
 * only render the value itself via React state.
 */
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

export function StatisticsSection() {
  const t = useTranslations('stats')
  // Single shared observer for the whole section (was 5 before).
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.25 })
  const [active, setActive] = useState(false)

  // Bridge the observer attribute into a boolean prop that children can use.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const update = () => setActive(el.dataset.active === 'true')
    update()
    const io = new MutationObserver(update)
    io.observe(el, { attributes: true, attributeFilter: ['data-active'] })
    return () => io.disconnect()
  }, [sectionRef])

  return (
    <section ref={sectionRef} className="py-20 bg-white stats-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => {
            const accent = accentCycle[index % accentCycle.length]
            return (
              <Counter
                key={stat.statKey}
                value={stat.value}
                suffix={stat.suffix}
                label={t(stat.statKey)}
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
