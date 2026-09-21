'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  CheckCircle,
  Send,
  Phone,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Mail,
  BookOpen,
} from 'lucide-react'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  isOpen: boolean
  initialProgram?: string
  initialTitle?: string
  source?: string
  onClose: () => void
}

const PROGRAM_OPTIONS = [
  { id: 'kindergarten', label: { vi: 'Mầm non (3 – 6 tuổi) – Tiếng Anh & Nền tảng Học thuật', en: 'Kindergarten (3–6) – English & Academic Foundation' } },
  { id: 'elementary', label: { vi: 'Tiểu học (Lớp 1 – 5) – Cambridge & Edmentum Core', en: 'Elementary (Grades 1–5) – Cambridge & Edmentum Core' } },
  { id: 'middle', label: { vi: 'THCS (Lớp 6 – 8) – Lộ trình Chuẩn bị Bằng Tú tài Mỹ', en: 'Middle School (Grades 6–8) – US Diploma Preparation' } },
  { id: 'dual-diploma', label: { vi: 'THPT: Song Bằng Mỹ – Dual Diploma (EdOptions Academy)', en: 'High School: US Dual Diploma (EdOptions Academy)' } },
  { id: 'fulltime', label: { vi: 'THPT: Bằng Tú tài Mỹ Toàn thời gian (US Fulltime Diploma)', en: 'High School: US Fulltime Diploma (Homeschool)' } },
  { id: 'ap-courses', label: { vi: 'Môn Tín Chỉ Nâng Cao AP® (Advanced Placement)', en: 'AP® Advanced Placement College Board Credits' } },
  { id: 'general-consultation', label: { vi: 'Tư vấn Tổng quan Lộ trình Học thuật K–12', en: 'General K–12 Academic Pathway Consultation' } },
]

export function RegistrationModal({
  isOpen,
  initialProgram = '',
  initialTitle = '',
  source = 'website',
  onClose,
}: Props) {
  const locale = useLocale()
  const isVi = locale === 'vi'

  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentName: '',
    studentGrade: '',
    program: initialProgram || 'general-consultation',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Sync initial program when opened
  useEffect(() => {
    if (initialProgram) {
      // Find matching option or use initialProgram string
      const matched = PROGRAM_OPTIONS.find(
        (opt) => opt.id === initialProgram || initialProgram.includes(opt.id)
      )
      setFormData((prev) => ({
        ...prev,
        program: matched ? matched.id : initialProgram,
      }))
    }
  }, [initialProgram])

  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone.trim()) return

    setIsSubmitting(true)
    try {
      // Resolve selected program label
      const selectedOpt = PROGRAM_OPTIONS.find((o) => o.id === formData.program)
      const programLabel = selectedOpt
        ? selectedOpt.label[isVi ? 'vi' : 'en']
        : initialTitle || formData.program || 'Tư vấn Tuyển sinh & Lộ trình'

      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.parentName || formData.studentName || 'Phụ huynh đăng ký tư vấn',
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          childAge: formData.studentGrade || '',
          program: programLabel,
          message: formData.message
            ? `${formData.message} (Học sinh: ${formData.studentName || 'Chưa cung cấp'}, Lớp: ${formData.studentGrade || 'Chưa cung cấp'})`
            : `Đăng ký tư vấn khóa học. Học sinh: ${formData.studentName || 'Chưa cung cấp'}, Lớp: ${formData.studentGrade || 'Chưa cung cấp'}`,
          source: 'website',
          locale,
        }),
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Registration lead submit error:', err)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-[#1E3570]/65 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DEDDD6] z-10 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-title"
          >
            {/* Header with gradient accent */}
            <div className="relative px-6 sm:px-8 pt-6 pb-4 border-b border-[#DEDDD6] bg-gradient-to-br from-[#F6F5F1] to-white flex-shrink-0">
              <button
                type="button"
                onClick={handleModalClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-[#EAEFFB] text-[#5C6069] hover:text-[#2E4A9E] flex items-center justify-center border border-[#DEDDD6] transition-all duration-200 shadow-2xs hover:scale-105"
                aria-label={isVi ? 'Đóng cửa sổ' : 'Close modal'}
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2E4A9E]/10 text-[#2E4A9E] mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#2E4A9E]" />
                <span>{isVi ? 'Đăng Ký Tư Vấn Trực Tiếp' : 'Direct Advisory Registration'}</span>
              </div>

              <h2
                id="registration-modal-title"
                className="text-xl sm:text-2xl font-black text-[#1E3570] leading-snug pr-8 tracking-tight"
                style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
              >
                {initialTitle
                  ? (isVi ? `Đăng ký: ${initialTitle}` : `Register: ${initialTitle}`)
                  : (isVi ? 'Khởi đầu hành trình học tập cùng EPath' : 'Start Your Academic Pathway with EPath')}
              </h2>

              <p className="text-xs sm:text-sm text-[#5C6069] mt-1 leading-relaxed">
                {isVi
                  ? 'Chuyên gia học vụ sẽ liên hệ tư vấn 1:1 và hướng dẫn kiểm tra năng lực đầu vào miễn phí trong 24h làm việc.'
                  : 'Our academic advisors will contact you for 1:1 counseling and complimentary diagnostic testing within 24h.'}
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1 overscroll-contain">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="text-center py-8 px-4"
                >
                  <div className="w-16 h-16 bg-[#8DC63F]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#5C9024] shadow-sm">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1E3570] mb-2">
                    {isVi ? 'Đăng Ký Thành Công!' : 'Registration Received!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6069] max-w-md mx-auto leading-relaxed mb-6">
                    {isVi
                      ? 'Cảm ơn Quý phụ huynh đã quan tâm đến chương trình đào tạo tại EPath Education. Ban Giám Đốc Học Vụ sẽ liên hệ qua điện thoại để hỗ trợ tư vấn chi tiết.'
                      : 'Thank you for your interest in EPath Education. Our academic advisory board will reach out to you shortly.'}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6] max-w-sm mx-auto mb-6 text-xs text-[#5C6069] text-left space-y-1.5">
                    <p><strong className="text-[#20242B]">{isVi ? 'Hotline hỗ trợ:' : 'Support Hotline:'}</strong> 0937 514 896</p>
                    <p><strong className="text-[#20242B]">{isVi ? 'Email:' : 'Email:'}</strong> infor@epath.edu.vn</p>
                    <p><strong className="text-[#20242B]">{isVi ? 'Thời gian làm việc:' : 'Working hours:'}</strong> Thứ 2 – Thứ 7 (08:00 – 18:00)</p>
                  </div>

                  <Button
                    onClick={handleModalClose}
                    className="rounded-full px-8 py-3 bg-[#2E4A9E] hover:bg-[#1E3570] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    {isVi ? 'Hoàn tất & Đóng' : 'Done & Close'}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Parent Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B] flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#2E4A9E]" />
                        <span>{isVi ? 'Họ tên phụ huynh *' : 'Parent Name *'}</span>
                      </Label>
                      <Input
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder={isVi ? 'Ví dụ: Nguyễn Văn A' : 'e.g. John Smith'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B] flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#F26522]" />
                        <span>{isVi ? 'Số điện thoại *' : 'Phone Number *'}</span>
                      </Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder="0912 345 678"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Student Name */}
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B] flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-[#2E4A9E]" />
                        <span>Email *</span>
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B] flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-[#5C9024]" />
                        <span>{isVi ? 'Tên học sinh & Cấp lớp' : 'Student Name & Grade'}</span>
                      </Label>
                      <Input
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder={isVi ? 'Ví dụ: Bé Minh (Lớp 3)' : 'e.g. Alex (Grade 3)'}
                      />
                    </div>
                  </div>

                  {/* Row 3: Program of Interest Dropdown */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#20242B] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#2E4A9E]" />
                      <span>{isVi ? 'Chương trình phụ huynh quan tâm' : 'Program of Interest'}</span>
                    </Label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full rounded-xl border border-[#DEDDD6] bg-white px-3 h-10 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all outline-none"
                    >
                      {PROGRAM_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label[isVi ? 'vi' : 'en']}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 4: Message / Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#20242B]">
                      {isVi ? 'Nhu cầu tư vấn cụ thể (tùy chọn)' : 'Specific Questions / Notes (optional)'}
                    </Label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-[#DEDDD6] bg-white p-3 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all outline-none resize-none"
                      placeholder={
                        isVi
                          ? 'Ví dụ: Muốn tìm hiểu bài test năng lực tiếng Anh, học phí song bằng...'
                          : 'e.g. Interested in diagnostic placement test, dual diploma tuition...'
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 h-auto rounded-xl bg-[#F26522] hover:bg-[#D95314] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>{isVi ? 'Đang gửi thông tin...' : 'Submitting...'}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isVi ? 'Gửi Đăng Ký Tư Vấn Ngay' : 'Submit Consultation Request'}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#F6F5F1] border-t border-[#DEDDD6] flex items-center justify-between text-xs text-[#5C6069] flex-shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5C9024]" />
                <span>{isVi ? 'Bảo mật thông tin 100%' : '100% Confidential'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#F26522]" />
                <span>Hotline: <strong className="text-[#20242B]">0937 514 896</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
