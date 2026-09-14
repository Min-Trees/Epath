'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'
import { X, Bot, ArrowRight, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const STORAGE_KEY = 'epath-advisory-popup-dismissed-at'
const POPUP_DELAY_MS = 15_000 // 15 seconds after page load
const COOLDOWN_HOURS = 12 // Don't show again for 12 hours after closing

export function AdvisoryLeadPopup() {
  const locale = useLocale()
  const isVi = locale === 'vi'
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if dismissed within cooldown period
    const dismissedAt = localStorage.getItem(STORAGE_KEY)
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt)
      if (elapsed < COOLDOWN_HOURS * 60 * 60 * 1000) {
        return
      }
    }

    // Also check sessionStorage so it doesn't pop up multiple times in same session
    if (sessionStorage.getItem('epath-popup-seen-session')) {
      return
    }

    timerRef.current = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem('epath-popup-seen-session', 'true')
    }, POPUP_DELAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  }

  const handleOpenChatbot = () => {
    handleClose()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('epath-wants-chat-open', '1')
      window.dispatchEvent(new CustomEvent('epath-open-chat'))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Soft Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#1E3570]/60 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Popup Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DEDDD6] z-10 flex flex-col md:flex-row"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 md:bg-[#F6F5F1] md:hover:bg-[#EAEFFB] text-white md:text-[#5C6069] flex items-center justify-center transition-all duration-200"
              aria-label={isVi ? 'Đóng thông báo' : 'Close popup'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Visual Column */}
            <div className="md:w-5/12 relative h-48 md:h-auto min-h-[190px] overflow-hidden bg-[#1E3570] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/admissions/admissions-consultation.jpg"
                alt="EPath Academic Advisory"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8DC63F] text-[#20242B] mb-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {isVi ? 'Tư Vấn Miễn Phí' : 'Free Assessment'}
                </span>
                <p className="text-xs font-semibold leading-tight text-white/95">
                  {isVi ? 'Đánh giá năng lực chuẩn Cambridge & Lộ trình Tú tài Mỹ' : 'Cambridge assessment & US High School Diploma pathways'}
                </p>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="md:w-7/12 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Định Hướng Lộ Trình 2026' : 'Academic Roadmap 2026'}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#20242B] mb-2 leading-snug">
                  {isVi
                    ? 'Bạn đang tìm lộ trình học chuẩn Quốc tế tối ưu cho con?'
                    : 'Looking for the optimal International pathway for your child?'}
                </h3>

                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-4">
                  {isVi
                    ? 'Nhận ngay bài kiểm tra năng lực tiếng Anh chuẩn Cambridge, phân tích hồ sơ học thuật và dự toán học phí tiết kiệm đến 70% so với trường quốc tế truyền thống.'
                    : 'Get a complimentary Cambridge placement test, personalized academic evaluation, and save up to 70% compared to traditional international schools.'}
                </p>

                {/* Benefits checklist */}
                <div className="space-y-1.5 mb-5 bg-[#F6F5F1] p-3 rounded-xl border border-[#DEDDD6]/80 text-xs text-[#20242B]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                    <span>{isVi ? 'Cố vấn chuyên môn 1 kèm 1 theo sát' : '1:1 dedicated Academic Advisor'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                    <span>{isVi ? 'Bằng Tú tài Mỹ Cognia & WASC công nhận toàn cầu' : 'Cognia & WASC accredited US High School Diploma'}</span>
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-[#DEDDD6]/60">
                {/* Channel 1: Open AI Chatbot 24/7 */}
                <button
                  type="button"
                  onClick={handleOpenChatbot}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#EAEFFB] text-[#2E4A9E] hover:bg-[#2E4A9E] hover:text-white transition-all duration-200 group shadow-xs cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-[#2E4A9E] group-hover:text-white transition-colors" />
                  <span>{isVi ? 'Hỏi nhanh qua Trợ lý AI (24/7)' : 'Chat with AI Academic Advisor'}</span>
                </button>

                {/* Channel 2: Register for 1:1 Consultation */}
                <Link
                  href={`/${locale}/admissions#contact`}
                  onClick={handleClose}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#F26522] hover:bg-[#C94F16] text-white transition-all duration-200 shadow-md hover:shadow-lg text-center"
                >
                  <span>{isVi ? 'Đăng ký tư vấn 1 kèm 1 với Cố vấn' : 'Book a 1:1 Consultation'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-[11px] text-[#5C6069] hover:text-[#20242B] underline cursor-pointer"
                  >
                    {isVi ? 'Để sau, tôi muốn tiếp tục xem' : 'Maybe later, continue browsing'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
