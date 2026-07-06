'use client'

/**
 * AnimatedText Component
 * Text reveal animations.
 * Unified with motion-presets.
 */

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { duration, easeOut } from '@/lib/motion-presets'

interface AnimatedTextProps {
  children: string
  className?: string
  delay?: number
  staggerDelay?: number
  type?: 'fade' | 'slide' | 'blur' | 'wave'
  staggerChars?: boolean
}

export function AnimatedText({
  children,
  className,
  delay = 0,
  staggerDelay = 0.05,
  type = 'fade',
  staggerChars = false,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: '0px 0px -10% 0px' })

  const text = staggerChars ? children.split('') : children.split(' ')

  const getVariant = (index: number) => {
    const baseDelay = delay + index * staggerDelay
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: baseDelay, duration: duration.normal, ease: easeOut },
          },
        }
      case 'slide':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delay: baseDelay, duration: duration.slow, ease: easeOut },
          },
        }
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: {
            opacity: 1,
            filter: 'blur(0px)',
            transition: { delay: baseDelay, duration: duration.slower },
          },
        }
      case 'wave':
        return {
          hidden: { opacity: 0, y: 10 },
          visible: (_i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: delay + _i * 0.04, duration: duration.normal },
          }),
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: baseDelay },
          },
        }
    }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={container}
      className={className}
    >
      {text.map((char, index) => (
        <motion.span
          key={index}
          variants={getVariant(index)}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {staggerChars ? char : char + '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * SplitText Component
 * Splits text into words for individual animation
 */
interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  animation?: 'fade' | 'slide' | 'scale' | 'bounce'
}

export function SplitText({
  text,
  className,
  delay = 0,
  staggerDelay = 0.05,
  animation = 'slide',
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: '0px 0px -10% 0px' })

  const words = text.split(' ')

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: { delay: delay + i * staggerDelay, duration: duration.normal },
      }),
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: delay + i * staggerDelay, duration: duration.slow, ease: easeOut },
      }),
    },
    scale: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: { delay: delay + i * staggerDelay, duration: duration.normal, ease: easeOut },
      }),
    },
    bounce: {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: delay + i * staggerDelay,
          duration: duration.slow,
          type: 'spring',
          stiffness: 280,
          damping: 18,
        },
      }),
    },
  }

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={variants[animation]}
          custom={i}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

/**
 * TypewriterText Component
 * Typewriter animation effect
 */
interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  showCursor?: boolean
}

export function TypewriterText({
  text,
  className,
  delay = 0,
  speed = 50,
  showCursor = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: '0px 0px -10% 0px' })

  useEffect(() => {
    if (!isInView || displayText.length > 0) return
    const start = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        i++
        if (i <= text.length) {
          setDisplayText(text.slice(0, i))
        } else {
          setIsComplete(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(start)
  }, [isInView, text, delay, speed, displayText.length])

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  )
}
