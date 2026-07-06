'use client'

/**
 * EPath Animation System - Custom Hooks
 * Reusable hooks for common animation patterns
 */

import { useEffect, useState, useRef, RefObject } from 'react'
import { motion, useInView, MotionValue, useSpring, useTransform, scroll, useScroll } from 'framer-motion'
import { COUNTER_CONFIG } from './config'

// framer-motion v11 MarginType: `${number}px` or `${number}%` (1-4 values)
type MarginValue = `${number}${'px' | '%'}`
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

/**
 * Hook for scroll-triggered animations
 * Returns refs and inView state
 */
export function useScrollReveal(options?: {
  threshold?: number
  margin?: MarginType
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? '-50px',
    amount: options?.threshold ?? 0.2,
  })

  return { ref, isInView }
}

/**
 * Hook for staggered children animations
 */
export function useStaggerContainer(itemCount: number, delay: number = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * delay,
        duration: 0.4,
        ease: [0, 0, 0.2, 1] as const,
      },
    }),
  }

  return { ref, isInView, childVariants }
}

// ============================================
// COUNTER ANIMATIONS
// ============================================

/**
 * Hook for animated number counters
 */
export function useCounter(
  value: number,
  isActive: boolean,
  options?: {
    duration?: number
    steps?: number
  }
) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isActive && !hasAnimated) {
      setHasAnimated(true)
      
      const duration = options?.duration ?? COUNTER_CONFIG.duration
      const steps = options?.steps ?? COUNTER_CONFIG.steps
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isActive, value, hasAnimated, options?.duration, options?.steps])

  return count
}

/**
 * Smooth counter with spring physics
 */
export function useSpringCounter(value: number, isActive: boolean) {
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
  })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isActive) {
      springValue.set(value)
    }
  }, [isActive, value, springValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (v) => {
      setDisplayValue(Math.round(v))
    })
    return unsubscribe
  }, [springValue])

  return displayValue
}

// ============================================
// INTERACTION ANIMATIONS
// ============================================

/**
 * Hook for hover state management
 */
export function useHoverScale(initialScale: number = 1) {
  const [isHovered, setIsHovered] = useState(false)

  return {
    isHovered,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered ? `scale(${initialScale * 1.05})` : `scale(${initialScale})`,
      transition: 'transform 0.2s ease',
    },
  }
}

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface UseStaggerResult {
  ref: RefObject<HTMLDivElement>
  isInView: boolean
  childVariants: {
    hidden: { opacity: number; y: number }
    visible: (i: number) => {
      opacity: number
      y: number
      transition: {
        delay: number
        duration: number
        ease: readonly [number, number, number, number]
      }
    }
  }
}

export interface UseCounterResult {
  count: number
  ref: RefObject<HTMLDivElement>
  isInView: boolean
}
