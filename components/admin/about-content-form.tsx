'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AboutContent } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

interface Milestone {
  year: string
  title: { vi: string; en: string }
  description: { vi: string; en: string }
}

interface AboutContentFormProps {
  load: () => Promise<AboutContent[]>
  update: (id: string, data: Partial<AboutContent>) => Promise<unknown>
  create: (data: Partial<AboutContent>) => Promise<{ id: string }>
}

const defaultForm: Partial<AboutContent> = {
  introTitle: { vi: '', en: '' },
  introContent: { vi: '', en: '' },
  visionTitle: { vi: '', en: '' },
  visionContent: { vi: '', en: '' },
  missionTitle: { vi: '', en: '' },
  missionContent: { vi: '', en: '' },
  milestones: '[]',
  heroImage: '',
}

export function AboutContentForm({ load, update, create }: AboutContentFormProps) {
  const [items, setItems] = useState<AboutContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Partial<AboutContent>>(defaultForm)
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    load()
      .then((data) => {
        setItems(data)
        if (data.length > 0) {
          const item = data[0]
          setForm({ ...defaultForm, ...item })
          try {
            setMilestones(JSON.parse(item.milestones ?? '[]'))
          } catch {
            setMilestones([])
          }
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
      const payload = {
        ...form,
        milestones: JSON.stringify(milestones),
      }
      if (items.length > 0) {
        await update(items[0].id, payload)
      } else {
        await create(payload as AboutContent)
      }
      const data = await load()
      setItems(data)
      if (data.length > 0) {
        setForm({ ...defaultForm, ...data[0] })
      }
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const setField = <K extends keyof AboutContent>(key: K, value: AboutContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const setLocalized = <K extends keyof AboutContent>(
    key: K,
    lang: 'vi' | 'en',
    value: string
  ) => {
    const current = form[key] as { vi: string; en: string } | undefined
    setForm((prev) => ({
      ...prev,
      [key]: {
        vi: lang === 'vi' ? value : (current?.vi ?? ''),
        en: lang === 'en' ? value : (current?.en ?? ''),
      },
    }))
  }

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { year: '', title: { vi: '', en: '' }, description: { vi: '', en: '' } },
    ])
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: string | { vi: string; en: string }) => {
    setMilestones((prev) => {
      const next = [...prev]
      if (field === 'year') {
        next[index] = { ...next[index], year: value as string }
      } else {
        next[index] = { ...next[index], [field]: value }
      }
      return next
    })
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  if (isLoading) {
    return (
      <div className="text-sm" style={{ color: semanticColors.textMuted }}>
        Đang tải…
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
          <CardTitle className="text-base">Hình ảnh Hero</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Hero Image URL</Label>
            <Input
              value={form.heroImage ?? ''}
              onChange={(e) => setField('heroImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Giới thiệu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tiêu đề giới thiệu (VN)</Label>
            <Input
              value={(form.introTitle as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('introTitle', 'vi', e.target.value)}
              placeholder="Về EPath Education"
            />
          </div>
          <div>
            <Label>Tiêu đề giới thiệu (EN)</Label>
            <Input
              value={(form.introTitle as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('introTitle', 'en', e.target.value)}
              placeholder="About EPath Education"
            />
          </div>
          <div>
            <Label>Nội dung giới thiệu (VN)</Label>
            <Textarea
              value={(form.introContent as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('introContent', 'vi', e.target.value)}
              placeholder="Nội dung giới thiệu..."
              rows={5}
            />
          </div>
          <div>
            <Label>Nội dung giới thiệu (EN)</Label>
            <Textarea
              value={(form.introContent as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('introContent', 'en', e.target.value)}
              placeholder="Introduction content..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tầm nhìn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tiêu đề tầm nhìn (VN)</Label>
            <Input
              value={(form.visionTitle as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('visionTitle', 'vi', e.target.value)}
              placeholder="Tầm nhìn của chúng tôi"
            />
          </div>
          <div>
            <Label>Tiêu đề tầm nhìn (EN)</Label>
            <Input
              value={(form.visionTitle as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('visionTitle', 'en', e.target.value)}
              placeholder="Our Vision"
            />
          </div>
          <div>
            <Label>Nội dung tầm nhìn (VN)</Label>
            <Textarea
              value={(form.visionContent as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('visionContent', 'vi', e.target.value)}
              placeholder="Nội dung tầm nhìn..."
              rows={4}
            />
          </div>
          <div>
            <Label>Nội dung tầm nhìn (EN)</Label>
            <Textarea
              value={(form.visionContent as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('visionContent', 'en', e.target.value)}
              placeholder="Vision content..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sứ mệnh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tiêu đề sứ mệnh (VN)</Label>
            <Input
              value={(form.missionTitle as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('missionTitle', 'vi', e.target.value)}
              placeholder="Sứ mệnh của chúng tôi"
            />
          </div>
          <div>
            <Label>Tiêu đề sứ mệnh (EN)</Label>
            <Input
              value={(form.missionTitle as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('missionTitle', 'en', e.target.value)}
              placeholder="Our Mission"
            />
          </div>
          <div>
            <Label>Nội dung sứ mệnh (VN)</Label>
            <Textarea
              value={(form.missionContent as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('missionContent', 'vi', e.target.value)}
              placeholder="Nội dung sứ mệnh..."
              rows={4}
            />
          </div>
          <div>
            <Label>Nội dung sứ mệnh (EN)</Label>
            <Textarea
              value={(form.missionContent as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('missionContent', 'en', e.target.value)}
              placeholder="Mission content..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Cột mốc phát triển</CardTitle>
            <Button size="sm" variant="outline" onClick={addMilestone}>
              <Plus className="w-4 h-4 mr-1" /> Thêm cột mốc
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-sm" style={{ color: semanticColors.textMuted }}>
              Chưa có cột mốc nào. Bấm "Thêm cột mốc" để bắt đầu.
            </div>
          ) : (
            milestones.map((m, i) => (
              <div
                key={i}
                className="p-4 border rounded-lg space-y-3"
                style={{ borderColor: 'rgba(35,31,32,0.1)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cột mốc #{i + 1}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMilestone(i)}
                    style={{ color: '#dc2626' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Năm</Label>
                    <Input
                      value={m.year}
                      onChange={(e) => updateMilestone(i, 'year', e.target.value)}
                      placeholder="2024"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Tiêu đề (VN)</Label>
                  <Input
                    value={m.title.vi}
                    onChange={(e) =>
                      updateMilestone(i, 'title', { ...m.title, vi: e.target.value })
                    }
                    placeholder="Tiêu đề cột mốc"
                  />
                </div>
                <div>
                  <Label className="text-xs">Tiêu đề (EN)</Label>
                  <Input
                    value={m.title.en}
                    onChange={(e) =>
                      updateMilestone(i, 'title', { ...m.title, en: e.target.value })
                    }
                    placeholder="Milestone title"
                  />
                </div>
                <div>
                  <Label className="text-xs">Mô tả (VN)</Label>
                  <Textarea
                    value={m.description.vi}
                    onChange={(e) =>
                      updateMilestone(i, 'description', { ...m.description, vi: e.target.value })
                    }
                    placeholder="Mô tả cột mốc..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs">Mô tả (EN)</Label>
                  <Textarea
                    value={m.description.en}
                    onChange={(e) =>
                      updateMilestone(i, 'description', { ...m.description, en: e.target.value })
                    }
                    placeholder="Milestone description..."
                    rows={2}
                  />
                </div>
              </div>
            ))
          )}
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
