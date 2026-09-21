'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail, Clock, Facebook, Youtube, Instagram, Music2 } from 'lucide-react'
import { useCmsContext } from '@/lib/cms-context'
import type { Locale } from '@/lib/cms-types'

interface FooterProps {
  locale?: string
  footerDescription?: string
  partnersList?: string[]
  contactAddress?: string
  contactPhone?: string
  contactEmail?: string
  copyright?: string
  programsTitle?: string
  quickLinksTitle?: string
  contactTitle?: string
  partnersTitle?: string
  navLabels?: {
    kindergarten?: string
    elementary?: string
    middle?: string
    high?: string
    aboutUs?: string
    vision?: string
    mission?: string
    values?: string
    partners?: string
    events?: string
  }
}

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function Footer(props: FooterProps) {
  let currentLocale: string | undefined
  try {
    currentLocale = useLocale()
  } catch {
    // In case called outside NextIntlClientProvider
  }
  const locale = ((props.locale || currentLocale || 'vi') as Locale)
  const isVi = locale === 'vi'
  const t = useTranslations('footer')

  const { data: cms } = useCmsContext()
  const settings = cms.siteSettings

  // Bilingual fallbacks
  const defaultDesc = isVi
    ? 'EPath Education — Hệ sinh thái giáo dục chuẩn quốc tế tiên phong, đồng hành cùng học sinh Việt Nam kiến tạo lộ trình học thuật Hoa Kỳ và Cambridge vững chắc. Nơi khơi nguồn tri thức, nuôi dưỡng tư duy độc lập và bứt phá năng lực hội nhập toàn cầu.'
    : 'EPath Education — A pioneering international education ecosystem accompanying Vietnamese students with accredited US and Cambridge academic pathways. Inspiring minds, nurturing independent thinkers, and empowering global readiness.'
  const defaultAddress = isVi
    ? '38 Trần Phú, Phường Thủ Dầu Một, Hồ Chí Minh'
    : '38 Tran Phu Street, Thu Dau Mot Ward, Ho Chi Minh City'

  const address = pick(settings?.address, locale) || props.contactAddress || t('contact.address') || defaultAddress
  const phone = settings?.phone || props.contactPhone || t('contact.phone') || '0937 514 896'
  const email = settings?.email || props.contactEmail || t('contact.email') || 'infor@epath.edu.vn'
  const workingHours = pick(settings?.workingHours, locale) || t('workingHours') || (isVi ? 'Thứ 2 – Thứ 7: 08:00 – 18:00' : 'Mon – Sat: 08:00 AM – 06:00 PM')
  const fbUrl = settings?.facebookUrl || 'https://facebook.com'
  const ytUrl = settings?.youtubeUrl || 'https://youtube.com'
  const igUrl = settings?.instagramUrl || 'https://instagram.com'
  const tiktokUrl = settings?.tiktokUrl || ''
  const logoUrl = settings?.logoUrl || '/epath-logo-title.png'
  const footerDesc = pick(settings?.footerDescription, locale) || props.footerDescription || t('description') || defaultDesc
  
  let copyrightText = settings?.copyrightText || props.copyright
  if (!copyrightText) {
    try {
      copyrightText = t('copyright', { year: new Date().getFullYear() })
    } catch {
      copyrightText = isVi
        ? `© ${new Date().getFullYear()} EPath Education. Bảo lưu mọi quyền.`
        : `© ${new Date().getFullYear()} EPath Education. All rights reserved.`
    }
  }

  const programsTitle = props.programsTitle || t('programsTitle') || (isVi ? 'Chương trình đào tạo' : 'Academic Programs')
  const quickLinksTitle = props.quickLinksTitle || t('quickLinksTitle') || (isVi ? 'Về EPath Education' : 'Explore EPath')
  const contactTitle = props.contactTitle || t('contactTitle') || (isVi ? 'Thông tin liên hệ' : 'Contact Us')
  const cmsPartnersTitle = settings?.footerPartnersTitle ? pick(settings.footerPartnersTitle, locale) : ''
  const finalPartnersTitle = cmsPartnersTitle || props.partnersTitle || t('partnersTitle') || (isVi ? 'Đối tác học thuật' : 'Academic Partners')

  const defaultPartners = isVi
    ? [
        'Edmentum International (Hoa Kỳ)',
        'EdOptions Academy (Cognia & WASC)',
        'Cambridge Assessment English (Anh Quốc)',
        'FabLab EIU — ĐH Quốc tế Miền Đông',
      ]
    : [
        'Edmentum International (USA)',
        'EdOptions Academy (Cognia & WASC)',
        'Cambridge Assessment English (UK)',
        'FabLab EIU — Eastern International University',
      ]

  const partnersToShow = settings?.partnersList && settings.partnersList.length > 0
    ? settings.partnersList
    : (props.partnersList || defaultPartners)

  return (
    <footer 
      className="text-white" 
      style={{ backgroundColor: '#1E3570' }}
    >
      {/* Top brand gradient line */}
      <div 
        className="h-1.5 w-full" 
        style={{ background: 'linear-gradient(90deg, #8DC63F 0%, #2E4A9E 50%, #F26522 100%)' }} 
      />
      
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand & Mission Statement (4 cols on lg) */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="inline-block bg-white rounded-xl p-2.5 mb-4 shadow-sm hover:opacity-95 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="EPath Education"
                width={160}
                height={69}
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-white/80 text-xs sm:text-sm mb-6 leading-relaxed">
              {footerDesc}
            </p>
            <div className="flex gap-2.5">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#2E4A9E] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F26522] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8DC63F] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8DC63F] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="TikTok"
                >
                  <Music2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Academic Programs (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-sm sm:text-base mb-4 text-[#8DC63F] uppercase tracking-wider">
              {programsTitle}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href={`/${locale}/programs?level=kindergarten`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('programs.kindergarten')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=elementary`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('programs.elementary')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=middle`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('programs.middle')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=high`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('programs.high')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/admissions?program=dual-diploma#form-tu-van`}
                  className="text-white/75 hover:text-[#8DC63F] transition-colors duration-200 inline-block hover:translate-x-1 transition-transform font-medium"
                >
                  {t('programs.dual')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm sm:text-base mb-4 text-[#8DC63F] uppercase tracking-wider">
              {quickLinksTitle}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about#vision`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.vision')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about#values`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.values')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/partners`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.partners')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/admissions`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.admissions')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/events`}
                  className="text-white/75 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 transition-transform"
                >
                  {t('quickLinks.events')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Strategic Partners (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-sm sm:text-base mb-4 text-[#8DC63F] uppercase tracking-wider">
              {contactTitle}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8DC63F] shrink-0 mt-0.5" />
                <span className="text-white/80 leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8DC63F] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-white/80 hover:text-white transition-colors duration-200 font-semibold"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8DC63F] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-white/80 hover:text-white transition-colors duration-200 break-all"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#8DC63F] shrink-0" />
                <span className="text-white/80">
                  {workingHours}
                </span>
              </li>
            </ul>

            {/* Strategic Partners List */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-2.5 text-white/90">
                {finalPartnersTitle}
              </h4>
              <ul className="space-y-1.5">
                {partnersToShow.map((partner, idx) => (
                  <li key={`${partner}-${idx}`} className="text-white/65 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F]/70 shrink-0" />
                    <span>{partner}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="border-t border-white/10 bg-black/15">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/60">
            <p>
              {copyrightText}
            </p>
            <div className="flex gap-5">
              <Link
                href={`/${locale}/privacy`}
                className="hover:text-white transition-colors duration-200"
              >
                {t('privacy')}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="hover:text-white transition-colors duration-200"
              >
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
