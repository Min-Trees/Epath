'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react'
import { semanticColors } from '@/lib/design-tokens'
import type { SiteSettings } from '@/lib/cms-types'

interface FooterProps {
  locale: string
  // i18n fallbacks
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
    kindergarten: string
    elementary: string
    middle: string
    high: string
    aboutUs: string
    vision: string
    mission: string
    values: string
    partners: string
    events: string
  }
}

export function Footer({
  locale,
  footerDescription = 'EPath Education - Nơi khơi nguồn tương lai',
  partnersList = ['Edmentum International', 'Cambridge Assessment', 'Cognia & WASC', 'FabLab EIU'],
  contactAddress = '123 Nguyễn Trãi, Q1, TP.HCM',
  contactPhone = '0912 345 678',
  contactEmail = 'contact@epath.edu.vn',
  copyright = '© 2024 EPath Education. All rights reserved.',
  programsTitle = 'Chương trình học',
  quickLinksTitle = 'Liên kết nhanh',
  contactTitle = 'Liên hệ',
  partnersTitle = 'Đối tác',
  navLabels = {
    kindergarten: 'Mầm non',
    elementary: 'Tiểu học',
    middle: 'THCS',
    high: 'THPT',
    aboutUs: 'Về chúng tôi',
    vision: 'Tầm nhìn',
    mission: 'Sứ mệnh',
    values: 'Giá trị cốt lõi',
    partners: 'Đối tác',
    events: 'Sự kiện',
  },
}: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/cms/site-settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setSettings(data.items[0])
        }
      })
      .catch(console.error)
  }, [])

  const address = settings?.address?.vi || settings?.address?.en || contactAddress
  const phone = settings?.phone || contactPhone
  const email = settings?.email || contactEmail
  const fbUrl = settings?.facebookUrl || 'https://facebook.com'
  const ytUrl = settings?.youtubeUrl || 'https://youtube.com'
  const footerDesc = settings?.footerDescription?.vi || settings?.footerDescription?.en || footerDescription
  const copyrightText = settings?.copyrightText || copyright

  return (
    <footer className="text-white" style={{ backgroundColor: semanticColors.primary }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="bg-white/95 rounded-lg inline-block p-2 mb-4">
              <Image
                src="/epath_logo.png"
                alt="EPath Education"
                width={160}
                height={50}
                className="h-10 w-auto"
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
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#3A53A3] transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#3A53A3] transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-[#3A53A3] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
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
                <span className="text-white/70 text-sm">
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
              <h4 className="font-medium text-sm mb-3 text-white/70">{partnersTitle}</h4>
              <ul className="space-y-2">
                {partnersList.map((partner) => (
                  <li key={partner} className="text-white/60 text-xs">
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
                href="/privacy"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
