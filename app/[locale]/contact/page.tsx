'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { duration, easeOut } from '@/lib/motion-presets'

export default function ContactPage() {
  const t = useTranslations('contact')
  const tFooter = useTranslations('footer')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <>
      <section
        className="pt-32 pb-20"
        style={{
          background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20 surface-alt">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#231F20] mb-8">{t('info.title')}</h2>
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#3A53A3]/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-[#3A53A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20] mb-1">{t('info.address')}</h3>
                    <p className="text-[#6B6B6B]">{tFooter('contact.address')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#8BC53F]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-7 h-7 text-[#8BC53F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20] mb-1">{t('info.phone')}</h3>
                    <p className="text-[#6B6B6B]">
                      Hotline: {tFooter('contact.phone')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#F05A28]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-7 h-7 text-[#F05A28]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20] mb-1">{t('info.email')}</h3>
                    <p className="text-[#6B6B6B]">{tFooter('contact.email')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-[#3A53A3]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-7 h-7 text-[#3A53A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20] mb-1">{t('info.hours')}</h3>
                    <p className="text-[#6B6B6B]">
                      {t('info.hoursValue')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-[#3A53A3]/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4854754843906!2d106.6573!3d10.9802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d60b6f0b1e1f%3A0x1c9a0f0b1c9a0f0b!2zMzggVHLhuqFuIFBow6o!5e0!3m2!1sen!2s!4v1234567890"
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

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#231F20] mb-6">{t('form.title')}</h2>
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
