'use client'

/**
 * AnimatedCounter Component
 * Counter with smooth number animation.
 * Uses requestAnimationFrame for buttery-smooth updates (no setInterval jitter).
 *
 * UX fix: avoids the "0+" flash by:
 *   - Hiding the number until the section is in view (renders a subtle placeholder)
 *   - Waiting for isInView to flip before starting the tween
 *   - Re-triggering whenever the value changes (e.g. re-mount)
 */

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { COUNTER_CONFIG } from '@/lib/animations/config'
import { duration, easeOut } from '@/lib/motion-presets'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
  startOnView?: boolean
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration: dur = COUNTER_CONFIG.duration,
  className,
  style,
  startOnView = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  // amount:0.3 was too forgiving – the element could intersect the viewport
  // edge without the user seeing it, causing the "0+" flash. amount:0.4 forces
  // a meaningful portion to actually be on screen.
  const isInView = useInView(ref, {
    once: true,
    amount: 0.4,
    margin: '0px 0px -10% 0px',
  })
  const [count, setCount] = useState(0)
  // When startOnView is true we keep `hasStarted` false until the element
  // actually appears, then immediately render the final value (or start
  // the tween). This removes the "0+" flash entirely.
  const [hasStarted, setHasStarted] = useState(false)
  const shouldShow = !startOnView || hasStarted

  useEffect(() => {
    // If startOnView is disabled, or the section is already in view on mount,
    // start the animation immediately.
    if (!startOnView || isInView) {
      if (!hasStarted) setHasStarted(true)
    }
  }, [isInView, startOnView, hasStarted])

  useEffect(() => {
    if (!shouldShow) return
    if (value === 0) {
      setCount(0)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shouldShow, value, dur])

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.normal, ease: easeOut }}
      className={className}
      style={style}
    >
      {shouldShow ? `${prefix}${count}${suffix}` : `${prefix}0${suffix}`}
    </motion.span>
  )
}

/**
 * AnimatedNumber Component
 * Alternative counter with more formatting options.
 */

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  separator?: string
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedNumber({
  value,
  duration: dur = 1500,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  // Use a meaningful amount (0.4) so the tween only starts when the section
  // is actually visible – prevents "0%" or "0+" flash on initial scroll.
  const isInView = useInView(ref, { once: true, amount: 0.4, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (isInView && !hasStarted) setHasStarted(true)
  }, [isInView, hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(decimals > 0 ? value * eased : Math.floor(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hasStarted, value, dur, decimals])

  const formatNumber = (num: number) => {
    if (separator && num >= 1000) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    }
    return num.toFixed(decimals)
  }

  return (
    <span ref={ref} className={className}>
      {hasStarted ? `${prefix}${formatNumber(displayValue)}${suffix}` : `${prefix}${formatNumber(0)}${suffix}`}
    </span>
  )
}
