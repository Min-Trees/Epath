'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SiteSettings } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

interface SiteSettingsFormProps {
  load: () => Promise<SiteSettings[]>
  update: (id: string, data: Partial<SiteSettings>) => Promise<unknown>
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
}

export function SiteSettingsForm({ load, update }: SiteSettingsFormProps) {
  const [items, setItems] = useState<SiteSettings[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Partial<SiteSettings>>(defaultSettings)

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
    if (items.length === 0) {
      setError('Vui lòng tạo ít nhất một bản ghi cài đặt trước.')
      return
    }
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      await update(items[0].id, form)
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
      <div className="text-sm" style={{ color: semanticColors.textMuted }}>
        Đang tải…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-sm" style={{ color: semanticColors.textMuted }}>
        Chưa có dữ liệu cài đặt. Vui lòng liên hệ developer để khởi tạo.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm p-3 rounded" style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm p-3 rounded" style={{ color: '#16a34a', backgroundColor: '#f0fdf4' }}>
          Đã lưu thành công!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Địa chỉ (VN)</Label>
              <Input
                value={(form.address as { vi: string })?.vi ?? ''}
                onChange={(e) => setField('address', { ...form.address as object, vi: e.target.value } as SiteSettings['address'])}
                placeholder="123 Nguyễn Trãi, Q1, TP.HCM"
              />
            </div>
            <div>
              <Label>Địa chỉ (EN)</Label>
              <Input
                value={(form.address as { en: string })?.en ?? ''}
                onChange={(e) => setField('address', { ...form.address as object, en: e.target.value } as SiteSettings['address'])}
                placeholder="123 Nguyen Trai, District 1, HCMC"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Điện thoại</Label>
              <Input
                value={form.phone ?? ''}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="0912 345 678"
              />
            </div>
            <div>
              <Label>Hotline</Label>
              <Input
                value={form.hotline ?? ''}
                onChange={(e) => setField('hotline', e.target.value)}
                placeholder="1900 xxxx"
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={form.email ?? ''}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="contact@epath.edu.vn"
              type="email"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mạng xã hội</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Zalo URL</Label>
            <Input
              value={form.zaloUrl ?? ''}
              onChange={(e) => setField('zaloUrl', e.target.value)}
              placeholder="https://zalo.me/xxx"
            />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <Input
              value={form.facebookUrl ?? ''}
              onChange={(e) => setField('facebookUrl', e.target.value)}
              placeholder="https://facebook.com/xxx"
            />
          </div>
          <div>
            <Label>YouTube URL</Label>
            <Input
              value={form.youtubeUrl ?? ''}
              onChange={(e) => setField('youtubeUrl', e.target.value)}
              placeholder="https://youtube.com/@xxx"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bản đồ & Giờ làm việc</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Google Maps Embed URL</Label>
            <Input
              value={form.mapEmbedUrl ?? ''}
              onChange={(e) => setField('mapEmbedUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Giờ làm việc (VN)</Label>
              <Input
                value={(form.workingHours as { vi: string })?.vi ?? ''}
                onChange={(e) => setField('workingHours', { ...form.workingHours as object, vi: e.target.value } as SiteSettings['workingHours'])}
                placeholder="Thứ 2 - Thứ 6: 8:00 - 18:00"
              />
            </div>
            <div>
              <Label>Giờ làm việc (EN)</Label>
              <Input
                value={(form.workingHours as { en: string })?.en ?? ''}
                onChange={(e) => setField('workingHours', { ...form.workingHours as object, en: e.target.value } as SiteSettings['workingHours'])}
                placeholder="Mon - Fri: 8:00 AM - 6:00 PM"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mô tả footer (VN)</Label>
            <Textarea
              value={(form.footerDescription as { vi: string })?.vi ?? ''}
              onChange={(e) => setField('footerDescription', { ...form.footerDescription as object, vi: e.target.value } as SiteSettings['footerDescription'])}
              placeholder="Mô tả ngắn về EPath..."
            />
          </div>
          <div>
            <Label>Mô tả footer (EN)</Label>
            <Textarea
              value={(form.footerDescription as { en: string })?.en ?? ''}
              onChange={(e) => setField('footerDescription', { ...form.footerDescription as object, en: e.target.value } as SiteSettings['footerDescription'])}
              placeholder="Short description about EPath..."
            />
          </div>
          <div>
            <Label>Copyright text</Label>
            <Input
              value={form.copyrightText ?? ''}
              onChange={(e) => setField('copyrightText', e.target.value)}
              placeholder="© 2024 EPath Education. All rights reserved."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  )
}
