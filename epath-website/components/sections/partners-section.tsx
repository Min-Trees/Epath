'use client'

import { useTranslations } from 'next-intl'
import { ExternalLink } from 'lucide-react'
import { useSectionActive } from '@/lib/motion-presets'

const partners = [
  { name: 'Edmentum International', descriptionKey: 'edmentumDesc' as const },
  { name: 'Cambridge Assessment', descriptionKey: 'cambridgeDesc' as const },
  { name: 'Cognia', descriptionKey: 'cogniaDesc' as const },
  { name: 'WASC', descriptionKey: 'wascDesc' as const },
  { name: 'FabLab EIU', descriptionKey: 'fablabDesc' as const },
  { name: 'EdOptions Academy', descriptionKey: 'edoptionsDesc' as const },
]

const certifications = [
  { name: 'Cognia Certified', descriptionKey: 'cognia' as const },
  { name: 'WASC Accredited', descriptionKey: 'wasc' as const },
  { name: 'Edmentum Partner', descriptionKey: 'edmentumPartner' as const },
]

/**
 * Performance rebuild:
 *   - Removed all framer-motion wrappers.
 *   - Stagger via CSS animation-delay (nth-child rules) so we get
 *     smooth staggering without JS.
 *   - Hover lift uses CSS transform on a GPU-promoted layer.
 */
export function PartnersSection() {
  const t = useTranslations('partners')
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="partners-section py-20 surface-alt overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="partners-header text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {partners.map((partner, idx) => (
            <div
              key={partner.name}
              className="partner-card"
              style={{ ['--reveal-delay' as string]: `${idx * 0.06}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-3 bg-[#3A53A3]/10 rounded-lg flex items-center justify-center partner-icon">
                <span className="text-[#3A53A3] font-bold text-xs">
                  {partner.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-[#231F20] mb-1">{partner.name}</h3>
              <p className="text-xs text-[#6B6B6B]">{t(partner.descriptionKey)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={cert.name}
              className="cert-pill"
              style={{ ['--reveal-delay' as string]: `${0.4 + idx * 0.08}s` }}
            >
              <div className="w-6 h-6 bg-[#8BC53F] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm text-[#231F20]">{cert.name}</div>
                <div className="text-xs text-[#6B6B6B]">{t(cert.descriptionKey)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/partners"
            className="inline-flex items-center gap-2 text-[#3A53A3] font-semibold hover:text-[#2E4389] transition-colors duration-200"
          >
            {t('learnMore')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
