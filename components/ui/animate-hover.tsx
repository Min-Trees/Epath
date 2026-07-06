'use client'

/**
 * AnimateHover Component
 * Hover animations for interactive elements
 * Unified with motion-presets for smooth, non-jittery hover state.
 */

import React, { useRef, useState } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { duration, easeOut } from '@/lib/motion-presets'

type HoverPreset = 'scale' | 'lift' | 'glow' | 'wiggle'

interface AnimateHoverProps {
  children: ReactNode
  preset?: HoverPreset
  scaleAmount?: number
  yAmount?: number
  className?: string
  whileHover?: boolean
  whileTap?: boolean
}

export function AnimateHover({
  children,
  preset = 'scale',
  scaleAmount = 1.05,
  yAmount = -4,
  className,
  whileHover = true,
  whileTap = true,
}: AnimateHoverProps) {
  const getVariants = (): MotionProps['variants'] => {
    switch (preset) {
      case 'scale': {
        return {
          rest: { scale: 1 },
          hover: whileHover
            ? { scale: scaleAmount, transition: { duration: duration.fast, ease: easeOut } }
            : {},
          tap: whileTap
            ? { scale: 0.97, transition: { duration: duration.instant } }
            : {},
        }
      }
      case 'lift': {
        return {
          rest: { y: 0, boxShadow: '0 4px 16px -4px rgba(35, 31, 32, 0.08)' },
          hover: whileHover
            ? {
                y: yAmount,
                boxShadow: '0 12px 28px -8px rgba(35, 31, 32, 0.18)',
                transition: { duration: duration.fast, ease: easeOut },
              }
            : {},
          tap: whileTap ? { y: yAmount / 2 } : {},
        }
      }
      case 'wiggle': {
        return {
          rest: { rotate: 0 },
          hover: whileHover
            ? {
                rotate: [-2, 2, -2, 0],
                transition: { duration: 0.4, ease: easeOut },
              }
            : {},
          tap: whileTap ? { scale: 0.95 } : {},
        }
      }
      case 'glow': {
        return {
          rest: { boxShadow: '0 0 0 0 rgba(58, 83, 163, 0)' },
          hover: whileHover
            ? {
                boxShadow: '0 0 24px rgba(58, 83, 163, 0.35)',
                transition: { duration: 0.3, ease: easeOut },
              }
            : {},
          tap: whileTap ? { scale: 0.97 } : {},
        }
      }
      default:
        return undefined
    }
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={getVariants()}
      transition={{ duration: duration.fast, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * MagneticButton Component
 * Button with magnetic hover effect
 */
interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  strength?: number
  className?: string
  href?: string
  disabled?: boolean
}

export function MagneticButton({
  children,
  onClick,
  strength = 0.3,
  className,
  href,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} disabled={disabled} type="button">
      {content}
    </button>
  )
}
