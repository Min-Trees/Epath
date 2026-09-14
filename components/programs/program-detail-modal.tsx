'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Clock,
  Award,
  Phone,
  GraduationCap,
} from 'lucide-react'
import Link from 'next/link'
import type { Program, Locale } from '@/lib/cms-types'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'
import { easeOut, duration } from '@/lib/motion-presets'

interface Props {
  program: Program | null
  locale: Locale
  levelLabel: string
  levelColor: string
  levelBgColor: string
  onClose: () => void
}

const DEFAULT_LEVEL_IMAGES: Record<string, string> = {
  kindergarten: '/images/programs/program-kindy.jpg',
  elementary: '/images/programs/program-elementary.jpg',
  middle: '/images/programs/program-middle.jpg',
  high: '/images/programs/program-high.jpg',
}

export function ProgramDetailModal({
  program,
  locale,
  levelLabel,
  levelColor,
  levelBgColor,
  onClose,
}: Props) {
  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!program) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [program, onClose])

  if (!program) return null

  const isVi = locale === 'vi'
  const title = program.title?.[locale] || program.title?.vi || ''
  const content = program.content?.[locale] || program.content?.vi || ''
  const shortDesc = program.shortDescription?.[locale] || program.shortDescription?.vi || ''
  const objectives = program.objectives || []
  const highlights = program.highlights || []

  // Safe string helper for localized items
  const getItemText = (item: unknown): string => {
    if (!item) return ''
    if (typeof item === 'string') return item
    if (typeof item === 'object') {
      const obj = item as Record<string, string | undefined>
      return obj[locale] || obj.vi || obj.en || ''
    }
    return String(item)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop with smooth blur - clicking closes modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1E3570]/60 backdrop-blur-sm cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: duration.normal, ease: easeOut }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#DEDDD6] z-10 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-detail-title"
      >
        {/* Header Bar */}
        <div className="relative px-5 sm:px-7 py-4 border-b border-[#DEDDD6] flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0 pr-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: levelBgColor, color: levelColor }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{levelLabel}</span>
            </span>

            {program.ageRange && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F6F5F1] border border-[#DEDDD6] text-[#5C6069]">
                <Clock className="w-3.5 h-3.5 text-[#F26522]" />
                <span>{program.ageRange}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F6F5F1] hover:bg-[#EAEFFB] text-[#5C6069] hover:text-[#2E4A9E] flex items-center justify-center border border-[#DEDDD6] transition-all duration-200 hover:scale-105 flex-shrink-0"
            aria-label={isVi ? 'Đóng cửa sổ' : 'Close modal'}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Content (Single scrollbar, no nested conflicts) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 overscroll-contain">
          {/* Title & Short Description */}
          <div>
            <h2
              id="program-detail-title"
              className="text-xl sm:text-2xl font-black text-[#20242B] mb-2.5 leading-snug"
            >
              {title}
            </h2>
            {shortDesc && (
              <div className="text-sm sm:text-base text-[#5C6069] leading-relaxed">
                <RichTextRenderer html={shortDesc} />
              </div>
            )}
          </div>

          {/* Program Showcase Image */}
          {(() => {
            const modalImage = program.imageUrl || DEFAULT_LEVEL_IMAGES[program.level] || '/images/programs/program-kindy.jpg'
            return (
              <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-[#F6F5F1] border border-[#DEDDD6] shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={modalImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fallback = DEFAULT_LEVEL_IMAGES[program.level] || '/images/programs/program-kindy.jpg'
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            )
          })()}

          {/* Curriculum & Detailed Content */}
          {content && (
            <div className="rounded-2xl p-5 sm:p-6 bg-[#F6F5F1]/70 border border-[#DEDDD6]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E4A9E] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2E4A9E]" />
                <span>{isVi ? 'Nội dung & Cấu trúc chương trình' : 'Curriculum & Course Structure'}</span>
              </h3>
              <div className="text-[#20242B] text-sm sm:text-base leading-relaxed space-y-3">
                <RichTextRenderer html={content} />
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {objectives.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C9024] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5C9024]" />
                <span>{isVi ? 'Mục tiêu đào tạo & Chuẩn đầu ra' : 'Learning Objectives & Outcomes'}</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {objectives.map((obj, i) => {
                  const text = getItemText(obj)
                  if (!text) return null
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#DEDDD6] text-xs sm:text-sm text-[#20242B]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5C9024] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Program Highlights */}
          {highlights.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F26522] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#F26522]" />
                <span>{isVi ? 'Ưu điểm & Điểm nổi bật' : 'Program Highlights'}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {highlights.map((hl, i) => {
                  const text = getItemText(hl)
                  if (!text) return null
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF0E9] border border-[#FDDDCF] text-xs font-semibold text-[#C94F16]"
                    >
                      <Sparkles className="w-3 h-3 text-[#F26522]" />
                      <span>{text}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with CTA */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 border-t border-[#DEDDD6] bg-[#F6F5F1] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[#5C6069] order-2 sm:order-1">
            <Phone className="w-3.5 h-3.5 text-[#F26522]" />
            <span>Hotline tư vấn: <strong className="text-[#20242B]">0937 514 896</strong></span>
          </div>

          <div className="flex items-center gap-2.5 justify-end order-1 sm:order-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#5C6069] hover:text-[#20242B] hover:bg-white transition-colors border border-transparent hover:border-[#DEDDD6]"
            >
              {isVi ? 'Đóng' : 'Close'}
            </button>
            <Link
              href={`/${locale}/admissions?program=${program.slug || program.id}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#C94F16] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span>{isVi ? 'Đăng ký tư vấn khóa học này' : 'Enquire About This Program'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
