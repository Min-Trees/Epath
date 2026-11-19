'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Eye,
    EyeOff,
  LayoutGrid,
  Sparkles,
} from 'lucide-react'
import type { ProgramsLayoutConfig, SectionVisibility, LayoutDensity } from './types'
import { DEFAULT_LAYOUT_CONFIG } from './types'
import { duration, easeOut } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/cms-types'

interface Props {
  isOpen: boolean
  locale: Locale
  config: ProgramsLayoutConfig
  onChangeConfig: (config: ProgramsLayoutConfig) => void
  onClose: () => void
}

const SECTION_DESCRIPTIONS: Record<
  keyof SectionVisibility,
  { vi: { label: string; desc: string }; en: { label: string; desc: string } }
> = {
  intro: {
    vi: { label: 'Lời mở đầu', desc: 'Thông điệp triết lý tiếp cận bền vững của EPath' },
    en: { label: 'Intro Narrative', desc: 'Sustainable educational pathway philosophy' },
  },
  stages: {
    vi: { label: '2 Giai đoạn chính', desc: 'Giai đoạn nền tảng (Mầm non - Lớp 8) và Chuyên sâu (Lớp 9+)' },
    en: { label: '2 Core Stages', desc: 'Foundation stage (K-8) and Advanced stage (Grade 9+)' },
  },
  roadmap: {
    vi: { label: 'Lộ trình liên tục', desc: 'Timeline trực quan từ Mầm non đến THPT' },
    en: { label: 'Milestones Roadmap', desc: 'Visual timeline from Kindergarten to High School' },
  },
  catalog: {
    vi: { label: 'Danh mục khóa học', desc: 'Lưới các chương trình theo từng cấp học với tìm kiếm và lọc' },
    en: { label: 'Programs Catalog', desc: 'Catalog cards grouped by level with search & filter' },
  },
  edoptions: {
    vi: { label: 'Song bằng Hoa Kỳ EdOptions', desc: 'Chi tiết lộ trình Dual Diploma & Homeschool toàn thời gian' },
    en: { label: 'EdOptions US Programs', desc: 'Dual Diploma & Full-time US schooling comparison' },
  },
  personalized: {
    vi: { label: 'Học tập cá nhân hóa', desc: 'Định hướng năng lực và cố vấn học tập riêng' },
    en: { label: 'Personalized Learning', desc: 'Custom learning pathways and individual mentoring' },
  },
  cta: {
    vi: { label: 'Kêu gọi hành động (CTA)', desc: 'Banner liên hệ tư vấn cuối trang' },
    en: { label: 'CTA Banner', desc: 'Bottom consultation enquiry banner' },
  },
}

export function ProgramsLayoutDrawer({
  isOpen,
  locale,
  config,
  onChangeConfig,
  onClose,
}: Props) {
  // The drawer animates differently on mobile (bottom sheet) vs desktop
  // (right slide-over), so we need to know the breakpoint. Framer Motion
  // needs a static `initial`/`animate` variant, so this is resolved on
  // the client and re-evaluated when the drawer opens.
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const mq = window.matchMedia('(max-width: 639px)')
    const apply = () => setIsMobile(mq.matches)

    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [isOpen])

  if (!isOpen) return null

  const isVi = locale === 'vi'

  const toggleSection = (key: keyof SectionVisibility) => {
    const updated = {
      ...config,
      sections: {
        ...config.sections,
        [key]: !config.sections[key],
      },
    }
    onChangeConfig(updated)
  }

  const setDensity = (density: LayoutDensity) => {
    onChangeConfig({
      ...config,
      layoutDensity: density,
    })
  }

  const handleReset = () => {
    onChangeConfig(DEFAULT_LAYOUT_CONFIG)
  }

  const activeCount = Object.values(config.sections).filter(Boolean).length
  const totalCount = Object.keys(config.sections).length

  return (
    <AnimatePresence>
      <div
        className={cn(
          'fixed inset-0 z-[100] overflow-hidden flex',
          // Mobile: bottom sheet (align to bottom, panel slides up).
          // sm+: right slide-over (align to the right edge).
          isMobile ? 'items-end' : 'justify-end'
        )}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1E3570]/50 backdrop-blur-sm"
        />

        {/* Slide-over panel

            RESPONSIVE NOTE:
            The panel used to be `w-full max-w-md`, which on a phone meant
            it covered 100% of the screen — a settings drawer taking over
            the whole viewport with no visible page behind it.

            On mobile it is now a BOTTOM SHEET (slides up, max 88dvh tall)
            so the page stays visible above it. From `sm:` up it keeps the
            original right-hand slide-over behaviour.

            The animation differs per breakpoint, so we read the viewport
            width at mount time and use the matching variant. */}
        <motion.div
          initial={isMobile ? { y: '100%' } : { x: '100%' }}
          animate={isMobile ? { y: 0 } : { x: 0 }}
          exit={isMobile ? { y: '100%' } : { x: '100%' }}
          transition={{ duration: duration.slow, ease: easeOut }}
          className={cn(
            'relative bg-white shadow-2xl z-10 flex flex-col',
            isMobile
              ? // Bottom sheet on mobile: anchored to the bottom, rounded
                // top corners, scrollable, never taller than 88dvh.
                'w-full max-h-[88dvh] rounded-t-3xl border-t border-[#DEDDD6]'
              : // Slide-over panel from sm up.
                'w-full max-w-md h-full border-l border-[#DEDDD6]'
          )}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#DEDDD6] bg-[#F6F5F1] flex items-center justify-between">
            {/* Drag handle — mobile bottom-sheet affordance. */}
            {isMobile && (
              <div
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 -top-2.5 h-1 w-10 rounded-full bg-[#DEDDD6]"
              />
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E4A9E]/10 flex items-center justify-center text-[#2E4A9E] shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#20242B]">
                  {isVi ? 'Tùy biến bố cục trang' : 'Customize Page Layout'}
                </h2>
                <p className="text-xs text-[#5C6069]">
                  {isVi
                    ? `Đang bật ${activeCount}/${totalCount} khối hiển thị`
                    : `${activeCount}/${totalCount} sections visible`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-[#5C6069] hover:text-[#20242B] hover:bg-black/5 transition-colors shrink-0"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto overscroll-contain space-y-6 flex-1">
            {/* Density switch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#20242B] mb-2.5">
                {isVi ? 'Mật độ hiển thị' : 'Layout Density'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6F5F1] rounded-2xl border border-[#DEDDD6]">
                <button
                  type="button"
                  onClick={() => setDensity('comfortable')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    config.layoutDensity === 'comfortable'
                      ? 'bg-white text-[#2E4A9E] shadow-sm'
                      : 'text-[#5C6069] hover:text-[#20242B]'
                  }`}
                >
                  {isVi ? 'Rộng rãi (Mặc định)' : 'Comfortable'}
                </button>
                <button
                  type="button"
                  onClick={() => setDensity('compact')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    config.layoutDensity === 'compact'
                      ? 'bg-white text-[#2E4A9E] shadow-sm'
                      : 'text-[#5C6069] hover:text-[#20242B]'
                  }`}
                >
                  {isVi ? 'Gọn gàng' : 'Compact'}
                </button>
              </div>
            </div>

            {/* Sections toggle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#20242B]">
                  {isVi ? 'Bật / Tắt các khối nội dung' : 'Toggle Page Sections'}
                </label>
                <span className="text-xs text-[#5C6069]">
                  {isVi ? 'Click để ẩn/hiện' : 'Click to toggle'}
                </span>
              </div>

              <div className="space-y-2.5">
                {(Object.keys(config.sections) as (keyof SectionVisibility)[]).map((key) => {
                  const isVisible = config.sections[key]
                  const info = SECTION_DESCRIPTIONS[key][isVi ? 'vi' : 'en']
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleSection(key)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                        isVisible
                          ? 'bg-white border-[#2E4A9E]/30 shadow-xs'
                          : 'bg-[#F6F5F1] border-[#DEDDD6] opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isVisible ? 'bg-[#2E4A9E] text-white' : 'bg-[#DEDDD6] text-[#5C6069]'
                          }`}
                        >
                          {isVisible ? <Check className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-bold ${
                              isVisible ? 'text-[#20242B]' : 'text-[#5C6069]'
                            }`}
                          >
                            {info.label}
                          </div>
                          <div className="text-xs text-[#5C6069] truncate">
                            {info.desc}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-[#5C6069]">
                        {isVisible ? <Eye className="w-4 h-4 text-[#2E4A9E]" /> : <EyeOff className="w-4 h-4" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tip note */}
            <div className="p-4 rounded-2xl bg-[#EAEFFB] border border-[#D5DFFA] text-xs text-[#2E4A9E] leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {isVi
                  ? 'Bố cục tùy chỉnh của bạn sẽ được tự động lưu trong trình duyệt và áp dụng ngay lập tức cho trang này.'
                  : 'Your customized layout is automatically saved in your browser and applied immediately.'}
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-6 border-t border-[#DEDDD6] bg-[#F6F5F1] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-[#5C6069] hover:text-[#20242B] hover:bg-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isVi ? 'Đặt lại mặc định' : 'Reset Defaults'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isVi ? 'Hoàn tất & Đóng' : 'Done & Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
