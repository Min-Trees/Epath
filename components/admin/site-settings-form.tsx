'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { SiteSettings } from '@/lib/cms-types'
import { ImagePicker } from './image-picker'

interface SiteSettingsFormProps {
  load: () => Promise<SiteSettings[]>
  update: (id: string, data: Partial<SiteSettings>) => Promise<unknown>
  create?: (data: Partial<SiteSettings>) => Promise<{ id: string }>
}

const defaultSettings: Partial<SiteSettings> = {
  address: { vi: '', en: '' },
  phone: '',
  email: '',
  zaloUrl: '',
  facebookUrl: '',
  youtubeUrl: '',
  hotline: '',
  workingHours: { vi: '', en: '' },
  mapEmbedUrl: '',
  footerDescription: { vi: '', en: '' },
  copyrightText: '',
  logoUrl: '',
  faviconUrl: '',
  ctaBackgroundImage: '',
}

export function SiteSettingsForm({ load, update, create }: SiteSettingsFormProps) {
  const [items, setItems] = useState<SiteSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Partial<SiteSettings>>(defaultSettings)
  const [activeTab, setActiveTab] = useState<'contact' | 'social' | 'branding' | 'cta'>('contact')

  useEffect(() => {
    load()
      .then((data) => {
        setItems(data)
        if (data.length > 0) {
          setForm({ ...defaultSettings, ...data[0] })
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false))
  }, [load])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      if (items.length > 0) {
        await update(items[0].id, form)
      } else if (create) {
        const created = await create(form)
        setItems([{ ...form, id: created.id } as SiteSettings])
      } else {
        throw new Error('Chưa có cấu hình và không tìm thấy hàm tạo mới.')
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const setField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="text-sm text-center py-12 text-[#868E96] bg-white rounded border border-[#E9ECEF]">
        Đang tải cấu hình trang…
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Top Tabs & Actions */}
      <div className="sticky top-[58px] z-30 bg-white p-3 rounded border border-[#E9ECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'contact'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            1. Liên hệ & Giờ làm
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'social'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            2. Mạng xã hội & Bản đồ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'branding'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            3. Logo & Footer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cta')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'cta'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            4. CTA Banner
          </button>
        </div>

        {/* Save Action */}
        <div className="flex items-center gap-2 justify-end shrink-0">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-4 rounded bg-[#1E3570] hover:bg-[#2A4B9B] text-white font-medium text-xs sm:text-sm"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm p-3 rounded border border-red-200 bg-[#FFF5F5] text-[#FA5252]">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm p-3 rounded border border-green-200 bg-[#EBFBEE] text-[#2B8A3E] font-semibold">
          Đã lưu cài đặt website thành công!
        </div>
      )}

      {/* TAB 1: Contact */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Kênh Hotline & Hỗ Trợ
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Số điện thoại và email hiển thị trên thanh Header, Footer và trang Liên hệ.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Hotline chính</Label>
                  <Input
                    value={form.hotline ?? ''}
                    onChange={(e) => setField('hotline', e.target.value)}
                    placeholder="0937 514 896"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Điện thoại cố định / Văn phòng</Label>
                  <Input
                    value={form.phone ?? ''}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="028 1234 5678"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Email tiếp nhận tư vấn</Label>
                <Input
                  value={form.email ?? ''}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="admissions@epath.edu.vn"
                  type="email"
                  className="rounded-xl border-[#CED4DA]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Địa Chỉ & Giờ Làm Việc
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Địa chỉ trụ sở (Tiếng Việt)</Label>
                  <Input
                    value={(form.address as { vi?: string })?.vi ?? ''}
                    onChange={(e) =>
                      setField('address', {
                        ...(form.address as object),
                        vi: e.target.value,
                      } as SiteSettings['address'])
                    }
                    placeholder="Tòa nhà EPath, TP. Thủ Đức, TP. Hồ Chí Minh"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Địa chỉ trụ sở (English)</Label>
                  <Input
                    value={(form.address as { en?: string })?.en ?? ''}
                    onChange={(e) =>
                      setField('address', {
                        ...(form.address as object),
                        en: e.target.value,
                      } as SiteSettings['address'])
                    }
                    placeholder="EPath Building, Thu Duc City, HCMC"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Giờ làm việc (Tiếng Việt)</Label>
                  <Input
                    value={(form.workingHours as { vi?: string })?.vi ?? ''}
                    onChange={(e) =>
                      setField('workingHours', {
                        ...(form.workingHours as object),
                        vi: e.target.value,
                      } as SiteSettings['workingHours'])
                    }
                    placeholder="Thứ 2 - Thứ 6: 8:00 - 17:30"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Giờ làm việc (English)</Label>
                  <Input
                    value={(form.workingHours as { en?: string })?.en ?? ''}
                    onChange={(e) =>
                      setField('workingHours', {
                        ...(form.workingHours as object),
                        en: e.target.value,
                      } as SiteSettings['workingHours'])
                    }
                    placeholder="Mon - Fri: 8:00 AM - 5:30 PM"
                    className="rounded-xl border-[#CED4DA]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Social & Map */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Kênh Mạng Xã Hội
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div>
                <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Zalo Official Account URL</Label>
                <Input
                  value={form.zaloUrl ?? ''}
                  onChange={(e) => setField('zaloUrl', e.target.value)}
                  placeholder="https://zalo.me/0937514896"
                  className="rounded-xl border-[#CED4DA]"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Facebook Fanpage URL</Label>
                <Input
                  value={form.facebookUrl ?? ''}
                  onChange={(e) => setField('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/epath.education"
                  className="rounded-xl border-[#CED4DA]"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-[#495057] mb-1.5 block">YouTube Channel URL</Label>
                <Input
                  value={form.youtubeUrl ?? ''}
                  onChange={(e) => setField('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/@epath.education"
                  className="rounded-xl border-[#CED4DA]"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Bản Đồ Google Maps Nhúng
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Link nhúng iframe từ Google Maps (thường bắt đầu bằng https://www.google.com/maps/embed?...).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              <Input
                value={form.mapEmbedUrl ?? ''}
                onChange={(e) => setField('mapEmbedUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="rounded-xl border-[#CED4DA]"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Branding & Footer */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Logo & Biểu Tượng (Favicon)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-6">
              <ImagePicker
                value={form.logoUrl ?? ''}
                onChange={(url) => setField('logoUrl', url)}
                label="Logo Chính Thức (SVG / PNG trong suốt)"
                folder="site"
              />
              <ImagePicker
                value={form.faviconUrl ?? ''}
                onChange={(url) => setField('faviconUrl', url)}
                label="Favicon Trình Duyệt (ICO / PNG 32x32)"
                folder="site"
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <CardTitle className="text-base text-[#1E3570] font-bold">
                Chân Trang (Footer) & Bản Quyền
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Mô tả Footer (Tiếng Việt)</Label>
                  <Textarea
                    value={(form.footerDescription as { vi?: string })?.vi ?? ''}
                    onChange={(e) =>
                      setField('footerDescription', {
                        ...(form.footerDescription as object),
                        vi: e.target.value,
                      } as SiteSettings['footerDescription'])
                    }
                    placeholder="Mô tả tóm tắt sứ mệnh EPath tại chân trang..."
                    rows={3}
                    className="rounded-xl border-[#CED4DA] text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Mô tả Footer (English)</Label>
                  <Textarea
                    value={(form.footerDescription as { en?: string })?.en ?? ''}
                    onChange={(e) =>
                      setField('footerDescription', {
                        ...(form.footerDescription as object),
                        en: e.target.value,
                      } as SiteSettings['footerDescription'])
                    }
                    placeholder="Short mission description at the footer..."
                    rows={3}
                    className="rounded-xl border-[#CED4DA] text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-[#495057] mb-1.5 block">Dòng bản quyền (Copyright)</Label>
                <Input
                  value={form.copyrightText ?? ''}
                  onChange={(e) => setField('copyrightText', e.target.value)}
                  placeholder="© 2026 EPath Education. All rights reserved."
                  className="rounded-xl border-[#CED4DA]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: CTA Banner */}
      {activeTab === 'cta' && (
        <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
          <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
            <CardTitle className="text-base text-[#1E3570] font-bold">
              Banner Kêu Gọi Hành Động (CTA Section)
            </CardTitle>
            <CardDescription className="text-xs text-[#5C6069]">
              Banner xuất hiện ở cuối trang để thúc đẩy phụ huynh đăng ký tư vấn.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <ImagePicker
              value={form.ctaBackgroundImage ?? ''}
              onChange={(url) => setField('ctaBackgroundImage', url)}
              label="Ảnh Nền Banner CTA"
              helperText="Khuyên dùng ảnh chất lượng cao hoặc dải hoa văn trang nhã."
              folder="site"
            />
          </CardContent>
        </Card>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded border border-[#E9ECEF]">
        <span className="text-xs text-[#868E96]">
          Dữ liệu cài đặt áp dụng trên toàn bộ Header, Footer và các form liên hệ của website.
        </span>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 px-5 rounded bg-[#1E3570] hover:bg-[#2A4B9B] text-white font-medium text-xs sm:text-sm"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </Button>
      </div>
    </div>
  )
}
