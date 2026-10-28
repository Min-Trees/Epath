'use client'

/**
 * PartnersSection – the homepage card row of partner logos.
 *
 * Source of truth: the CMS `partners` collection (logoUrl + featured
 * flag). When the CMS is empty we fall back to the i18n strings so
 * visitors never see a blank row.
 * Uses consistent data source from CMS context to prevent duplicate rendering.
 */
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { useSectionActive } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'

const partnerBadges: Record<string, { label: { vi: string; en: string }; color: string; bg: string }> = {
  edmentum: {
    label: { vi: 'Chuẩn Học Thuật Hoa Kỳ', en: 'US Accredited Curriculum' },
    color: '#2E4A9E',
    bg: '#EAEFFB',
  },
  cambridge: {
    label: { vi: 'Khảo Thí Tiếng Anh Quốc Tế', en: 'Cambridge English Qualifications' },
    color: '#5C9024',
    bg: '#EDF7E2',
  },
  fablab: {
    label: { vi: 'Không Gian Sáng Tạo STEAM', en: 'STEAM Innovation Makerspace' },
    color: '#F26522',
    bg: '#FDF0EA',
  },
  cognia: {
    label: { vi: 'Kiểm Định Giáo Dục Toàn Cầu', en: 'Global Educational Accreditation' },
    color: '#1E3570',
    bg: '#EAEFFB',
  },
}

function getPartnerKey(partner: { id?: string; name?: string }): 'edmentum' | 'cambridge' | 'fablab' | 'cognia' {
  const raw = `${partner.id || ''} ${partner.name || ''}`.toLowerCase()
  if (raw.includes('edmentum') || raw.includes('edoptions')) return 'edmentum'
  if (raw.includes('cambridge') || raw.includes('esol')) return 'cambridge'
  if (raw.includes('fablab') || raw.includes('eiu')) return 'fablab'
  if (raw.includes('cognia') || raw.includes('wasc')) return 'cognia'
  return 'edmentum'
}

import { DEFAULT_PARTNERS } from '@/lib/default-partners'

const fallbackPartners = DEFAULT_PARTNERS

export function PartnersSection() {
  const t = useTranslations('partners')
  const locale = useLocale()
  const isVi = locale === 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })
  const { data: cms } = useCmsContext()

  // Deduplicate and filter active partners (fallback to canonical partners if CMS is loading)
  const seenKeys = new Set<string>()
  const sourcePartners = cms.partners && cms.partners.length > 0 ? cms.partners : fallbackPartners
  const rawPartners = sourcePartners.filter((p) => p.isActive !== false)
  const partners = rawPartners
    .filter((p) => {
      const key = getPartnerKey(p)
      if (seenKeys.has(key)) return false
      seenKeys.add(key)
      return true
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const displayPartners = partners
  const certs = [
    { name: 'Cognia Certified', descriptionKey: 'cognia' as const },
    { name: 'WASC Accredited', descriptionKey: 'wasc' as const },
    { name: 'Edmentum Partner', descriptionKey: 'edmentumPartner' as const },
  ]

  // Dynamic balanced grid classes based on partner count to ensure perfect center alignment
  const gridLayoutClass =
    displayPartners.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : displayPartners.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
      : displayPartners.length === 3
      ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
      : displayPartners.length === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto'

  return (
    <section ref={sectionRef} className="partners-section py-16 sm:py-20 bg-[#F6F5F1] overflow-hidden border-b border-[#DEDDD6]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="partners-header text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2E4A9E]" />
            <span>{isVi ? 'Hệ sinh thái đối tác giáo dục' : 'Global Education Partners'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#20242B] mb-3 leading-tight">
            {t('title')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#5C6069] leading-relaxed max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Dynamic Centered Partner Grid */}
        {displayPartners.length > 0 && (
          <div className={`grid ${gridLayoutClass} gap-5 sm:gap-6 mb-12 items-stretch`}>
            {displayPartners.map((partner, idx) => {
              const pKey = getPartnerKey(partner)
              const badge = partnerBadges[pKey] || {
                label: { vi: 'Đối Tác Học Thuật', en: 'Academic Partner' },
                color: '#2E4A9E',
                bg: '#EAEFFB',
              }
              const desc =
                (isVi ? partner.description?.vi : partner.description?.en) ||
                partner.description?.vi ||
                partner.description?.en ||
                ''

              return (
                <div
                  key={partner.id}
                  className="partner-card bg-white rounded-3xl p-6 border border-[#DEDDD6] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-center group relative overflow-hidden"
                  style={{ ['--reveal-delay' as string]: `${idx * 0.08}s` }}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex justify-center mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        {isVi ? badge.label.vi : badge.label.en}
                      </span>
                    </div>

                    {/* Logo / Photo Avatar */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#F6F5F1] rounded-2xl flex items-center justify-center partner-icon overflow-hidden shadow-sm border border-[#DEDDD6] p-2 group-hover:scale-105 group-hover:border-[#2E4A9E] transition-all duration-300">
                      {partner.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-full h-full object-cover rounded-xl"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-extrabold text-base" style={{ color: badge.color }}>
                          {partner.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 3)}
                        </span>
                      )}
                    </div>

                    {/* Partner Name */}
                    <h3 className="font-bold text-sm sm:text-base text-[#20242B] mb-2 leading-snug group-hover:text-[#2E4A9E] transition-colors line-clamp-2 min-h-[44px]">
                      {!isVi && partner.name.includes('Trường Đại học Quốc tế Miền Đông')
                        ? partner.name.replace('Trường Đại học Quốc tế Miền Đông', 'Eastern International University')
                        : partner.name}
                    </h3>

                    {/* Partner Description */}
                    <RichTextRenderer
                      html={desc}
                      compact
                      className="text-xs text-[#5C6069] leading-relaxed line-clamp-4 mb-4 text-left sm:text-center block"
                    />
                  </div>

                  {/* Card Bottom Link */}
                  <div className="pt-3 border-t border-[#DEDDD6]/60 flex items-center justify-center">
                    <Link
                      href={`/${locale}/partners`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E4A9E] group-hover:text-[#1E3570] transition-colors"
                    >
                      <span>{isVi ? 'Tìm hiểu chi tiết' : 'Explore Partner'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Accreditation Cert Pills */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
          {certs.map((cert, idx) => (
            <div
              key={cert.name}
              className="cert-pill bg-white border border-[#DEDDD6] rounded-full px-4 py-2.5 shadow-2xs hover:shadow-sm transition-all flex items-center gap-3"
              style={{ ['--reveal-delay' as string]: `${0.4 + idx * 0.08}s` }}
            >
              <div className="w-6 h-6 bg-[#8DC63F]/20 text-[#5C9024] rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs sm:text-sm text-[#20242B]">{cert.name}</div>
                <div className="text-[11px] text-[#5C6069]">{t(cert.descriptionKey)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href={`/${locale}/partners`}
            className="pulse-ripple-btn pulse-ripple-btn--navy relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <span className="pulse-ripple-ring ring-1" aria-hidden="true" />
            <span className="pulse-ripple-ring ring-2" aria-hidden="true" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <span>{t('learnMore')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
