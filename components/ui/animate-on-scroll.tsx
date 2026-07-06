'use client'

/**
 * AnimateOnScroll Component
 * Wrapper component for scroll-triggered animations
 * Now uses the unified motion-presets for consistent, jitter-free motion.
 */

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import {
  duration,
  easeOut,
  fadeIn,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  inViewViewport,
  scaleIn,
} from '@/lib/motion-presets'

type AnimationDirection = 'up' | 'down' | 'left' | 'right' | 'none' | 'scale'
type AnimationPreset = 'fade' | 'slide' | 'scale' | 'bounce'

interface AnimateOnScrollProps {
  children: ReactNode
  direction?: AnimationDirection
  preset?: AnimationPreset
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

const directionToVariants = (direction: AnimationDirection) => {
  switch (direction) {
    case 'up':
      return fadeInUp
    case 'down':
      return fadeInDown
    case 'left':
      return fadeInRight
    case 'right':
      return fadeInLeft
    case 'scale':
      return scaleIn
    default:
      return fadeIn
  }
}

const presetToVariants = (preset: AnimationPreset) => {
  switch (preset) {
    case 'fade':
      return fadeIn
    case 'slide':
      return fadeInUp
    case 'scale':
      return scaleIn
    case 'bounce':
      return scaleIn
    default:
      return fadeInUp
  }
}

export function AnimateOnScroll({
  children,
  direction = 'up',
  preset = 'slide',
  delay = 0,
  duration: dur,
  className,
  once = true,
  amount = 0.2,
}: AnimateOnScrollProps) {
  const variants = directionToVariants(direction === 'none' ? 'none' : direction) ?? presetToVariants(preset)

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ ...inViewViewport, amount, once }}
      transition={{ duration: dur ?? duration.normal, delay, ease: easeOut }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerContainer Component
 * Container for staggered child animations
 */

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerItem Component
 * Individual item in a stagger container.
 * Must be used inside StaggerContainer.
 */

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  direction?: AnimationDirection
  delay?: number
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  delay = 0,
}: StaggerItemProps) {
  const variants = directionToVariants(direction)

  return (
    <motion.div
      variants={variants}
      transition={{ duration: duration.normal, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * AnimateInView Component
 * Simple component for fade-in on scroll
 */

interface AnimateInViewProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
}

export function AnimateInView({
  children,
  className,
  delay = 0,
  duration: dur = 0.35,
  y = 20,
}: AnimateInViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ duration: dur, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
