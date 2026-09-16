'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail, Clock, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { duration, easeOut } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { SubpageHero } from '@/components/subpages/subpage-hero'

export default function ContactPage() {
  const t = useTranslations('contact')
  const tFooter = useTranslations('footer')
  const locale = useLocale()
  const { data: cms } = useCmsContext()
  const contactHero = ((cms.heroContent as Record<string, Record<string, unknown> | null>).contact as Record<string, unknown>) || {}
  const heroImage = contactHero?.backgroundImage as string || ''
  const welcomeText = ((contactHero?.welcomeTitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] || (contactHero?.welcomeTitle as Record<string, string | undefined> || {})?.vi || ''
  const mainTitle = ((contactHero?.title as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] || (contactHero?.title as Record<string, string | undefined> || {})?.vi || t('hero.title')
  const heroSubtitle = ((contactHero?.subtitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] || (contactHero?.subtitle as Record<string, string | undefined> || {})?.vi || t('hero.subtitle')

  const settings = cms.siteSettings
  const address = (locale === 'en' ? settings?.addressEn : settings?.addressVi) || (settings?.addressEn as string) || (settings?.addressVi as string) || tFooter('contact.address')
  const hotline = settings?.hotline as string || tFooter('contact.phone')
  const email = settings?.contactEmail as string || tFooter('contact.email')
  const workingHours = (locale === 'en' ? settings?.workingHoursEn : settings?.workingHoursVi) || (settings?.workingHoursEn as string) || (settings?.workingHoursVi as string) || t('info.hoursValue')
  const mapEmbedUrl = settings?.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4854754843906!2d106.6573!3d10.9802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d60b6f0b1e1f%3A0x1c9a0f0b1c9a0f0b!2zMzggVHLhuqFuIFBow6o!5e0!3m2!1sen!2s!4v1234567890'

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone.trim()) return
    setIsSubmitting(true)
    try {
      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim() || 'Khách liên hệ website',
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          program: formData.subject.trim() || 'Liên hệ chung',
          message: formData.message.trim() || formData.subject.trim(),
          source: 'contact-form',
          locale,
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Contact lead submit error:', err)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          HERO BANNER – Light iSchool aesthetic matching Homepage
      ─────────────────────────────────────────────────────────────── */}
      <SubpageHero
        badge={welcomeText || (locale === 'vi' ? 'Kết nối cùng EPath' : 'Connect with EPath')}
        title={locale === 'vi' ? 'Liên Hệ & Tư Vấn' : 'Contact & Campus'}
        highlightText={locale === 'vi' ? 'Lộ Trình Học Thuật' : 'Academic Advisory'}
        subtitle={heroSubtitle}
        tags={[
          locale === 'vi' ? 'Tư Vấn 1:1 Miễn Phí' : 'Free 1:1 Consultation',
          locale === 'vi' ? 'Trải Nghiệm Campus Trực Tiếp' : 'Onsite Campus Tour',
          locale === 'vi' ? 'Hỗ Trợ Học Vụ 24/7' : '24/7 Academic Support',
          locale === 'vi' ? 'Đánh Giá Năng Lực Đầu Vào' : 'Diagnostic Testing',
        ]}
        backgroundImage={heroImage || '/images/about/about-story.jpg'}
      />

      <section className="py-12 sm:py-16 bg-[#F6F5F1] border-b border-[#DEDDD6]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#1E3570] border border-[#DEDDD6] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
                <span>{locale === 'vi' ? 'Thông Tin Trực Tiếp' : 'Direct Contacts'}</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-black text-[#1E3570] mb-6"
                style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
              >
                {t('info.title')}
              </h2>

              <div className="space-y-4 mb-8">
                {/* Address Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#DEDDD6] shadow-xs hover:shadow-md hover:border-[#2E4A9E]/40 transition-all flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2E4A9E]/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#2E4A9E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3570] text-sm sm:text-base mb-0.5">{t('info.address')}</h3>
                    <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">{address}</p>
                  </div>
                </div>

                {/* Hotline Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#DEDDD6] shadow-xs hover:shadow-md hover:border-[#8DC63F]/50 transition-all flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#8DC63F]/15 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#5C9024]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3570] text-sm sm:text-base mb-0.5">{t('info.phone')}</h3>
                    <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                      Hotline: <strong className="text-[#1E3570]">{hotline}</strong>
                    </p>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#DEDDD6] shadow-xs hover:shadow-md hover:border-[#F26522]/40 transition-all flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F26522]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#F26522]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3570] text-sm sm:text-base mb-0.5">{t('info.email')}</h3>
                    <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">{email}</p>
                  </div>
                </div>

                {/* Working Hours Card */}
                <div className="p-4 rounded-2xl bg-white border border-[#DEDDD6] shadow-xs hover:shadow-md hover:border-[#1E3570]/30 transition-all flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1E3570]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#1E3570]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3570] text-sm sm:text-base mb-0.5">{t('info.hours')}</h3>
                    <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">{workingHours}</p>
                  </div>
                </div>
              </div>

              {/* Campus Map Embed */}
              <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-[#DEDDD6] shadow-xs">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EPath Location"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#DEDDD6] p-6 sm:p-8">
              <h2
                className="text-2xl font-black text-[#1E3570] mb-6"
                style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
              >
                {t('form.title')}
              </h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: duration.normal, ease: easeOut }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-[#8BC53F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-10 h-10 text-[#8BC53F]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                    {t('form.success')}
                  </h3>
                  <p className="text-[#6B6B6B] mb-6">{t('form.successText')}</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    {t('form.sendAnother')}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label>{t('form.name')}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('form.emailField')}</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>{t('form.phone')}</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t('form.message')}</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#F05A28] hover:bg-[#E04D1A]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('form.sending') : t('form.send')}
                    <Send className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
