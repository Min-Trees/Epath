'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { duration, easeOut } from '@/lib/motion-presets'

interface SubpageHeroProps {
  badge?: string
  title: string
  highlightText?: string
  subtitle?: string
  tags?: string[]
  backgroundImage?: string
  children?: React.ReactNode
}

export function SubpageHero({
  badge,
  title,
  highlightText,
  subtitle,
  tags = [],
  backgroundImage,
  children,
}: SubpageHeroProps) {
  return (
    <section
      className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden border-b border-[#DEDDD6]"
      style={{ backgroundColor: '#F6F5F1' }}
      aria-label={title}
    >
      {/* Background visual layers matching Homepage iSchool style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Diagonal geometric accents matching Homepage */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(141,198,63,0.3) 0%, rgba(46,74,158,0.15) 70%, transparent 100%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,74,158,0.25) 0%, rgba(240,90,40,0.1) 70%, transparent 100%)' }}
        />

        {/* Diagonal chevron bands */}
        <svg
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.035] text-[#1E3570] pointer-events-none"
          viewBox="0 0 400 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M 100,0 L 400,0 L 300,800 L 0,800 Z" fill="currentColor" />
          <path d="M 250,0 L 400,0 L 350,800 L 200,800 Z" fill="currentColor" />
        </svg>

        {/* If optional photography background is provided, render with subtle light fade */}
        {backgroundImage && (
          <div
            className="absolute inset-0 opacity-[0.06] bg-cover bg-center mix-blend-multiply"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1E3570] border border-[#DEDDD6] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
              <span>{badge}</span>
            </motion.div>
          )}

          {/* Headline with green accent matching Homepage display typography */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.08, ease: easeOut }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E3570] tracking-tight leading-[1.14]"
            style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
          >
            {title}{' '}
            {highlightText && (
              <span className="text-[#8DC63F] underline decoration-[#8DC63F]/30 decoration-wavy decoration-2">
                {highlightText}
              </span>
            )}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, delay: 0.16, ease: easeOut }}
              className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#5C6069] leading-relaxed max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Extra slot for buttons or search */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.normal, delay: 0.22, ease: easeOut }}
              className="mt-6"
            >
              {children}
            </motion.div>
          )}
        </div>

        {/* Tags ticker / marquee strip matching Homepage Layer 4 */}
        {tags && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.28, ease: easeOut }}
            className="mt-10 pt-6 border-t border-[#DEDDD6]/60 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white/90 hover:bg-white text-[#1E3570] font-semibold text-[11px] sm:text-xs tracking-wide shadow-xs border border-[#DEDDD6]/80 transition-all cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F] shadow-[0_0_6px_rgba(141,198,63,0.8)] shrink-0" />
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
