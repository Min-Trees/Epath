'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram, Music2 } from 'lucide-react'
import { semanticColors } from '@/lib/design-tokens'
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
  const tNav = useTranslations('nav')

  // FIX: Use CMS context instead of redundant direct fetch
  // This eliminates duplicate API calls and ensures data consistency
  const { data: cms } = useCmsContext()
  const settings = cms.siteSettings

  // Bilingual fallbacks
  const defaultDesc = isVi
    ? 'EPath Education - Nơi khơi nguồn tương lai'
    : 'EPath Education - Where the Future Begins'
  const defaultAddress = isVi
    ? '38 Trần Phú, Phường Chánh Nghĩa, TP. Thủ Dầu Một, Bình Dương'
    : '38 Tran Phu Street, Chanh Nghia Ward, Thu Dau Mot City, Binh Duong'

  const address = pick(settings?.address, locale) || props.contactAddress || t('contact.address') || defaultAddress
  const phone = settings?.phone || props.contactPhone || '0937 514 896'
  const email = settings?.email || props.contactEmail || 'infor@epath.edu.vn'
  const fbUrl = settings?.facebookUrl || 'https://facebook.com'
  const ytUrl = settings?.youtubeUrl || 'https://youtube.com'
  const igUrl = settings?.instagramUrl || 'https://instagram.com'
  const tiktokUrl = settings?.tiktokUrl || ''
  const logoUrl = settings?.logoUrl || '/epath-logo-title.png'
  const footerDesc = pick(settings?.footerDescription, locale) || props.footerDescription || defaultDesc
  
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

  const programsTitle = props.programsTitle || t('programsTitle') || (isVi ? 'Chương trình học' : 'Programs')
  const quickLinksTitle = props.quickLinksTitle || (isVi ? 'Liên kết nhanh' : 'Quick Links')
  const contactTitle = props.contactTitle || t('contactTitle') || (isVi ? 'Liên hệ' : 'Contact')
  const cmsPartnersTitle = settings?.footerPartnersTitle ? pick(settings.footerPartnersTitle, locale) : ''
  const finalPartnersTitle = cmsPartnersTitle || props.partnersTitle || t('partnersTitle') || (isVi ? 'Đối tác' : 'Partners')

  const partnersToShow = settings?.partnersList && settings.partnersList.length > 0
    ? settings.partnersList
    : (props.partnersList || ['Edmentum International', 'Cambridge Assessment', 'Cognia & WASC', 'FabLab EIU'])

  const navLabels = {
    kindergarten: props.navLabels?.kindergarten || tNav('kindergarten') || (isVi ? 'Mầm non' : 'Kindergarten'),
    elementary: props.navLabels?.elementary || tNav('elementary') || (isVi ? 'Tiểu học' : 'Elementary'),
    middle: props.navLabels?.middle || tNav('middle') || (isVi ? 'THCS' : 'Middle School'),
    high: props.navLabels?.high || tNav('high') || (isVi ? 'THPT' : 'High School'),
    aboutUs: props.navLabels?.aboutUs || tNav('aboutUs') || (isVi ? 'Về chúng tôi' : 'About Us'),
    vision: props.navLabels?.vision || tNav('vision') || (isVi ? 'Tầm nhìn' : 'Vision'),
    mission: props.navLabels?.mission || tNav('mission') || (isVi ? 'Sứ mệnh' : 'Mission'),
    values: props.navLabels?.values || tNav('values') || (isVi ? 'Giá trị cốt lõi' : 'Core Values'),
    partners: props.navLabels?.partners || tNav('partners') || (isVi ? 'Đối tác' : 'Partners'),
    events: props.navLabels?.events || tNav('events') || (isVi ? 'Sự kiện' : 'Events'),
  }

  return (
    <footer 
      className="text-white" 
      style={{ backgroundColor: '#1E3570' }}
    >
      {/* Top gradient overlay */}
      <div 
        className="h-2 w-full" 
        style={{ background: 'linear-gradient(90deg, #8DC63F 0%, #2E4A9E 50%, #F26522 100%)' }} 
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="bg-white/95 rounded-lg inline-block p-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="EPath Education"
                width={160}
                height={69}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              {footerDesc}
            </p>
            <div className="flex gap-3">
              <a
                href={fbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F26522] hover:text-white transition-all duration-200 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#F26522] hover:text-white transition-all duration-200 hover:-translate-y-1"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8DC63F] hover:text-white transition-all duration-200 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#8DC63F] hover:text-white transition-all duration-200 hover:-translate-y-1"
                  aria-label="TikTok"
                >
                  <Music2 className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{programsTitle}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/programs?level=kindergarten`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.kindergarten}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=elementary`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.elementary}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=middle`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.middle}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/programs?level=high`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.high}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{quickLinksTitle}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about#vision`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.vision}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about#mission`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.mission}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about#values`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.values}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/partners`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.partners}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/events`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {navLabels.events}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">{contactTitle}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm whitespace-pre-line">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm break-all"
                >
                  {email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="font-medium text-sm mb-3 text-white/70">{finalPartnersTitle}</h4>
              <ul className="space-y-2">
                {partnersToShow.map((partner, idx) => (
                  <li key={`${partner}-${idx}`} className="text-white/60 text-xs">
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              {copyrightText}
            </p>
            <div className="flex gap-6">
              <Link
                href={`/${locale}/privacy`}
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('privacy') || 'Privacy Policy'}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                {t('terms') || 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
