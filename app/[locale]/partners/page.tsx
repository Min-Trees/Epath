'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ExternalLink, Award, ArrowRight, Check, Globe2, Sparkles } from 'lucide-react'
import { useRegistrationModal } from '@/components/registration-modal-context'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Partner, PartnersContent } from '@/lib/cms-types'
import { DEFAULT_PARTNERS, DEFAULT_PARTNERS_CONTENT } from '@/lib/default-partners'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'

const partnerImages: Record<string, string> = {
  edmentum: '/images/partners/partner-edmentum.jpg',
  cambridge: '/images/partners/partner-cambridge.jpg',
  fablab: '/images/partners/partner-fablab.jpg',
  network: '/images/partners/partner-cognia.jpg',
  other: '/images/partners/partner-cognia.jpg',
}

const partnerBadges: Record<string, { label: { vi: string; en: string }; bg: string }> = {
  edmentum: {
    label: { vi: 'Chương Trình Chuẩn Hoa Kỳ & Bằng Tú Tài Mỹ', en: 'Accredited US Curriculum & High School Diploma' },
    bg: '#2E4A9E',
  },
  cambridge: {
    label: { vi: 'Khảo Thí Tiếng Anh Quốc Tế', en: 'Cambridge English Qualifications' },
    bg: '#5C9024',
  },
  fablab: {
    label: { vi: 'Không Gian Sáng Tạo STEAM & Robotics', en: 'STEAM Makerspace & Applied Tech' },
    bg: '#F26522',
  },
  network: {
    label: { vi: 'Mạng Lưới Giáo Dục Toàn Cầu', en: 'Global Educational Network' },
    bg: '#1E3570',
  },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

function getPartnerKey(partner: Partner): 'edmentum' | 'cambridge' | 'fablab' | 'network' {
  const raw = `${partner.id || ''} ${partner.name || ''}`.toLowerCase()
  if (raw.includes('edmentum') || raw.includes('edoptions')) return 'edmentum'
  if (raw.includes('cambridge') || raw.includes('esol')) return 'cambridge'
  if (raw.includes('fablab') || raw.includes('eiu')) return 'fablab'
  return 'network'
}

export default function PartnersPage() {
  const t = useTranslations('partnersPage')
  const locale = useLocale()
  const isVi = locale === 'vi'
  const { data: cms } = useCmsContext()
  const { openRegistrationModal } = useRegistrationModal()
  const [pageContent, setPageContent] = useState<PartnersContent | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/cms/partners-content')
        const data = await res.json()
        const items: PartnersContent[] = data.items || []
        if (items.length > 0) {
          setPageContent(items[0])
        }
      } catch (e) {
        console.error('Failed to load partners-content:', e)
      }
    }
    loadContent()
  }, [])

  const content = (cms.partnersContent as PartnersContent | null) || pageContent || DEFAULT_PARTNERS_CONTENT
  const heroTitle = content?.hero?.title?.[locale as 'vi' | 'en'] || (isVi ? 'Đối tác Quốc tế' : 'International Partners')
  const heroSubtitle =
    content?.hero?.subtitle?.[locale as 'vi' | 'en'] ||
    (isVi
      ? 'EPath Education đồng hành cùng các tổ chức giáo dục, khảo thí và công nghệ hàng đầu thế giới để kiến tạo hệ sinh thái học thuật chuẩn mực, toàn diện và bền vững cho học sinh.'
      : 'EPath Education partners with premier global academic, testing, and technology organizations to provide a certified, comprehensive K-12 learning ecosystem.')

  // Deduplicate partners by semantic key to guarantee no repeated entries
  const rawPartners: Partner[] = cms.partners.length > 0 ? cms.partners : DEFAULT_PARTNERS
  const partners: Partner[] = rawPartners
    .filter((p) => p.isActive !== false)
    .filter((p, index, self) => {
      const key = getPartnerKey(p)
      return index === self.findIndex((o) => getPartnerKey(o) === key)
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. HERO HEADER SECTION
      ─────────────────────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-32 pb-10 sm:pb-14 bg-gradient-to-b from-[#F6F5F1] to-white border-b border-[#DEDDD6]/60">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#EAEFFB] text-[#2E4A9E] border border-[#2E4A9E]/20 mb-4 shadow-2xs">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{isVi ? 'Hệ sinh thái Giáo dục Chuẩn Quốc tế' : 'Accredited Global Education Ecosystem'}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E3570] mb-4 tracking-tight"
              style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
            >
              {heroTitle}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#5C6069] leading-relaxed max-w-3xl mx-auto">
              {heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. PARTNER SHOWCASE ROWS
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-12 sm:space-y-16 max-w-6xl mx-auto">
            {partners.map((partner, index) => {
              const accent = accentCycle[index % accentCycle.length]
              const partnerName =
                locale !== 'vi' && partner.name.includes('Trường Đại học Quốc tế Miền Đông')
                  ? partner.name.replace('Trường Đại học Quốc tế Miền Đông', 'Eastern International University')
                  : partner.name
              const desc = partner.description[locale as 'vi' | 'en'] || partner.description.vi
              const pKey = getPartnerKey(partner)

              // Prefer partner.imageUrl set by admin, fallback to preset images
              const partnerImg = partner.imageUrl || partnerImages[pKey] || '/images/partners/partner-edmentum.jpg'

              // Prefer partner.badgeLabel set by admin
              const customBadge =
                typeof partner.badgeLabel === 'object'
                  ? partner.badgeLabel[locale as 'vi' | 'en'] || partner.badgeLabel.vi
                  : partner.badgeLabel
              const defaultBadge = partnerBadges[pKey] || {
                label: { vi: 'Đối Tác Học Thuật', en: 'Academic Partner' },
                bg: accent.color,
              }
              const badgeLabel = customBadge || defaultBadge.label[locale as 'vi' | 'en'] || defaultBadge.label.vi
              const badgeBg = defaultBadge.bg || accent.color

              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.slow, ease: easeOut }}
                  className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
                >
                  {/* Visual Image Card with Badge & Branding */}
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''} flex flex-col`}>
                    <div className="relative rounded-2xl overflow-hidden border border-[#DEDDD6] shadow-sm hover:shadow-lg transition-all duration-500 group h-64 sm:h-72 lg:h-full min-h-[260px] bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partnerImg}
                        alt={partnerName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                      {/* Top Category Badge */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md tracking-wide"
                          style={{ backgroundColor: badgeBg }}
                        >
                          {badgeLabel}
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md p-1.5 flex items-center justify-center shrink-0 shadow-md">
                            {partner.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={partner.logoUrl} alt={partnerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="font-black text-sm" style={{ color: accent.color }}>
                                {initials(partnerName)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold text-white drop-shadow-sm block truncate">
                              {badgeLabel}
                            </span>
                            <span className="text-[11px] text-white/80 block uppercase tracking-wider">
                              {partner.category.toUpperCase()} • EPATH ACCREDITED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partner Details & Features */}
                  <div
                    className={`lg:col-span-7 bg-[#F6F5F1] hover:bg-white rounded-2xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                  >
                    {/* Watermark Numeral */}
                    <span className="absolute -top-6 -right-2 text-7xl sm:text-8xl font-black text-[#1E3570]/[0.04] pointer-events-none select-none font-mono">
                      0{index + 1}
                    </span>

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <h2
                          className="text-xl sm:text-2xl font-black text-[#1E3570] group-hover:text-[#2E4A9E] transition-colors"
                          style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
                        >
                          {partnerName}
                        </h2>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1E3570] hover:text-[#8DC63F] font-bold text-xs sm:text-sm hover:underline shrink-0 pt-1 transition-colors"
                          >
                            <span>{t('visitWebsite')}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {desc && (
                        <div className="text-[#5C6069] text-xs sm:text-sm leading-relaxed mb-5 [&_p]:mb-3 [&_p:last-child]:mb-0">
                          <RichTextRenderer html={desc} />
                        </div>
                      )}

                      {partner.features && partner.features.length > 0 && (
                        <div className="pt-4 border-t border-[#DEDDD6]">
                          <h3
                            className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
                            style={{ color: accent.color }}
                          >
                            <Award className="w-4 h-4" />
                            <span>{t('features')}</span>
                          </h3>
                          <ul className="space-y-2.5">
                            {partner.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2.5">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px]"
                                  style={{ backgroundColor: accent.color }}
                                >
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                                <span className="text-[#20242B] text-xs sm:text-sm font-medium leading-relaxed">
                                  {feat[locale as 'vi' | 'en'] || feat.vi || feat.en}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. BOTTOM CTA
      ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">
              {content?.cta?.title?.[locale as 'vi' | 'en'] || t('cta.title')}
            </h2>
            <p className="text-white/85 text-sm sm:text-base mb-6 leading-relaxed">
              {content?.cta?.subtitle?.[locale as 'vi' | 'en'] || t('cta.subtitle')}
            </p>
            <button
              type="button"
              onClick={() => openRegistrationModal({ source: 'partners-bottom-cta' })}
              className="inline-flex items-center gap-2.5 bg-[#F26522] hover:bg-[#C94F16] text-white px-7 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>{content?.cta?.buttonText?.[locale as 'vi' | 'en'] || t('cta.button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
