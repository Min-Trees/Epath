'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { AboutContent } from '@/lib/cms-types'
import { ImagePicker } from './image-picker'

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
  facultyTitle: { vi: '', en: '' },
  facultySubtitle: { vi: '', en: '' },
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
  const [activeTab, setActiveTab] = useState<'intro' | 'vision' | 'milestones'>('intro')
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi')

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
      <div className="text-sm text-center py-12 text-[#868E96] bg-white rounded border border-[#E9ECEF]">
        Đang tải nội dung About…
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-5xl">
      {/* Top Controls: Section Tabs, Language Switcher & Save Button */}
      <div className="sticky top-[58px] z-30 bg-white p-3 rounded border border-[#E9ECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Section Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'intro'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            1. Giới thiệu & Ảnh Hero
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vision')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'vision'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            2. Tầm nhìn & Sứ mệnh
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === 'milestones'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#495057] hover:bg-[#F1F3F5]'
            }`}
          >
            3. Cột mốc ({milestones.length})
          </button>
        </div>

        {/* Language Switcher & Save Button */}
        <div className="flex items-center gap-2 justify-end shrink-0">
          <div className="flex items-center p-0.5 bg-[#F1F3F5] rounded border border-[#E9ECEF]">
            <button
              type="button"
              onClick={() => setActiveLang('vi')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                activeLang === 'vi'
                  ? 'bg-white text-[#1E3570]'
                  : 'text-[#868E96] hover:text-[#20242B]'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                activeLang === 'en'
                  ? 'bg-white text-[#1E3570]'
                  : 'text-[#868E96] hover:text-[#20242B]'
              }`}
            >
              English
            </button>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 px-4 rounded bg-[#1E3570] hover:bg-[#2A4B9B] text-white font-medium text-xs sm:text-sm"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
          Đã lưu nội dung Giới thiệu thành công!
        </div>
      )}

      {/* TAB 1: Giới thiệu & Ảnh Hero */}
      {activeTab === 'intro' && (
        <div className="space-y-4">
          <Card className="rounded border-[#E9ECEF] overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] py-3 px-4">
              <CardTitle className="text-sm text-[#1E3570] font-bold">
                Ảnh Đại Diện (Hero Image)
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Ảnh này sẽ xuất hiện tại khối &ldquo;VỀ EPATH EDUCATION&rdquo; trên Trang chủ và đầu trang Giới thiệu (/about).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <ImagePicker
                value={form.heroImage ?? ''}
                onChange={(url) => setField('heroImage', url)}
                label="Tải ảnh lên S3 hoặc chọn từ thư viện"
                helperText="Khuyên dùng ảnh chụp học sinh hoặc hoạt động học thuật sắc nét (tỷ lệ 4:3 hoặc 16:9)."
                folder="about"
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-[#E9ECEF] shadow-xs overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-[#1E3570] font-bold">
                    Tiêu Đề & Nội Dung Giới Thiệu
                  </CardTitle>
                  <CardDescription className="text-xs text-[#5C6069]">
                    Đang chỉnh sửa bản: <strong className="text-[#1E3570]">{activeLang === 'vi' ? 'Tiếng Việt' : 'English'}</strong>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-[#495057] mb-1.5 block">
                  Tiêu đề giới thiệu ({activeLang.toUpperCase()})
                </Label>
                <Input
                  value={(form.introTitle as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('introTitle', activeLang, e.target.value)}
                  placeholder={activeLang === 'vi' ? 'Về EPath Education' : 'About EPath Education'}
                  className="rounded border-[#CED4DA] focus:border-[#1E3570]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="text-xs font-semibold text-[#495057]">
                    Nội dung giới thiệu ({activeLang.toUpperCase()})
                  </Label>
                  <span className="text-[11px] text-[#868E96]">
                    Hỗ trợ xuống dòng đoạn văn & bullet gạch đầu dòng
                  </span>
                </div>
                <Textarea
                  value={(form.introContent as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('introContent', activeLang, e.target.value)}
                  placeholder={
                    activeLang === 'vi'
                      ? 'Nhập các đoạn văn giới thiệu...\n\nCác bạn nhỏ trưởng thành cùng EPath Education sẽ như thế nào?\n\n- Sở hữu bằng tốt nghiệp THPT Mỹ...\n- Bổ sung nền tảng học thuật vững vàng...'
                      : 'Enter introductory content here...'
                  }
                  rows={10}
                  className="rounded border-[#CED4DA] focus:border-[#1E3570] text-sm leading-relaxed"
                />
                <div className="mt-2 p-3 rounded bg-[#F8F9FA] border border-[#E9ECEF] text-xs text-[#5C6069]">
                  <strong>Quy tắc định dạng tự động:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#868E96]">
                    <li>Mỗi đoạn văn cách nhau 2 lần Enter (dòng trống).</li>
                    <li>Các dòng bắt đầu bằng <code className="text-[#1E3570] font-bold">- </code> hoặc <code className="text-[#1E3570] font-bold">• </code> sẽ tự động biến thành thẻ danh sách có icon tích xanh.</li>
                    <li>Dòng kết thúc bằng dấu chấm hỏi <code className="text-[#1E3570] font-bold">?</code> sẽ tự động biến thành tiêu đề phân đoạn in đậm.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Tầm nhìn & Sứ mệnh */}
      {activeTab === 'vision' && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Vision */}
          <Card className="rounded border-[#E9ECEF] overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] py-3 px-4">
              <CardTitle className="text-sm text-[#1E3570] font-bold">
                Tầm Nhìn Chiến Lược (Vision)
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Bản ngữ: <strong className="text-[#1E3570]">{activeLang === 'vi' ? 'Tiếng Việt' : 'English'}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-[#495057] mb-1.5 block">
                  Tiêu đề tầm nhìn ({activeLang.toUpperCase()})
                </Label>
                <Input
                  value={(form.visionTitle as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('visionTitle', activeLang, e.target.value)}
                  placeholder={activeLang === 'vi' ? 'Tầm nhìn (Vision)' : 'Our Vision'}
                  className="rounded border-[#CED4DA]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#495057] mb-1.5 block">
                  Nội dung tầm nhìn ({activeLang.toUpperCase()})
                </Label>
                <Textarea
                  value={(form.visionContent as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('visionContent', activeLang, e.target.value)}
                  placeholder="Nhập nội dung tầm nhìn..."
                  rows={8}
                  className="rounded border-[#CED4DA] text-sm leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="rounded border-[#E9ECEF] overflow-hidden">
            <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] py-3 px-4">
              <CardTitle className="text-sm text-[#1E3570] font-bold">
                Sứ Mệnh Hành Động (Mission)
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Bản ngữ: <strong className="text-[#1E3570]">{activeLang === 'vi' ? 'Tiếng Việt' : 'English'}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-[#495057] mb-1.5 block">
                  Tiêu đề sứ mệnh ({activeLang.toUpperCase()})
                </Label>
                <Input
                  value={(form.missionTitle as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('missionTitle', activeLang, e.target.value)}
                  placeholder={activeLang === 'vi' ? 'Sứ mệnh (Mission)' : 'Our Mission'}
                  className="rounded border-[#CED4DA]"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-[#495057] mb-1.5 block">
                  Nội dung sứ mệnh ({activeLang.toUpperCase()})
                </Label>
                <Textarea
                  value={(form.missionContent as { vi?: string; en?: string } | undefined)?.[activeLang] ?? ''}
                  onChange={(e) => setLocalized('missionContent', activeLang, e.target.value)}
                  placeholder="Nhập nội dung sứ mệnh..."
                  rows={8}
                  className="rounded border-[#CED4DA] text-sm leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Milestones */}
      {activeTab === 'milestones' && (
        <Card className="rounded border-[#E9ECEF] overflow-hidden">
          <CardHeader className="bg-[#F8F9FA] border-b border-[#E9ECEF] py-3 px-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-[#1E3570] font-bold">
                Dòng Thời Gian Lịch Sử (Milestones)
              </CardTitle>
              <CardDescription className="text-xs text-[#5C6069]">
                Các mốc năm phát triển hiển thị trên trang Giới thiệu.
              </CardDescription>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addMilestone}
              className="bg-[#1E3570] hover:bg-[#2A4B9B] text-white text-xs font-medium rounded h-8 px-3"
            >
              Thêm cột mốc
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {milestones.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#868E96]">
                Chưa có cột mốc nào. Bấm &ldquo;Thêm cột mốc&rdquo; để bắt đầu.
              </div>
            ) : (
              milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded border border-[#E9ECEF] bg-[#F8F9FA] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#1E3570] text-white text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <Input
                        value={ms.year}
                        onChange={(e) => updateMilestone(idx, 'year', e.target.value)}
                        placeholder="Năm (VD: 2024)"
                        className="w-32 h-7 text-xs font-medium rounded border-[#CED4DA] bg-white"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMilestone(idx)}
                      className="h-7 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 rounded border-red-200"
                    >
                      Xóa
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-medium text-[#495057] mb-1 block">
                        Tiêu đề (Tiếng Việt)
                      </Label>
                      <Input
                        value={ms.title.vi}
                        onChange={(e) =>
                          updateMilestone(idx, 'title', { ...ms.title, vi: e.target.value })
                        }
                        placeholder="VD: Ra mắt EPath Education"
                        className="h-8 text-xs rounded border-[#CED4DA] bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-medium text-[#495057] mb-1 block">
                        Tiêu đề (English)
                      </Label>
                      <Input
                        value={ms.title.en}
                        onChange={(e) =>
                          updateMilestone(idx, 'title', { ...ms.title, en: e.target.value })
                        }
                        placeholder="VD: EPath Education Launched"
                        className="h-8 text-xs rounded border-[#CED4DA] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] font-medium text-[#495057] mb-1 block">
                        Mô tả (Tiếng Việt)
                      </Label>
                      <Textarea
                        value={ms.description.vi}
                        onChange={(e) =>
                          updateMilestone(idx, 'description', { ...ms.description, vi: e.target.value })
                        }
                        placeholder="Mô tả sự kiện bằng tiếng Việt..."
                        rows={2}
                        className="text-xs rounded border-[#CED4DA] bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-medium text-[#495057] mb-1 block">
                        Mô tả (English)
                      </Label>
                      <Textarea
                        value={ms.description.en}
                        onChange={(e) =>
                          updateMilestone(idx, 'description', { ...ms.description, en: e.target.value })
                        }
                        placeholder="Description in English..."
                        rows={2}
                        className="text-xs rounded border-[#CED4DA] bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Footer */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded border border-[#E9ECEF]">
        <span className="text-xs text-[#868E96]">
          Mọi thay đổi sẽ cập nhật trực tiếp lên Firestore và phản ánh tức thì trên website.
        </span>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 px-5 rounded bg-[#1E3570] hover:bg-[#2A4B9B] text-white font-medium text-xs sm:text-sm"
        >
          {isSaving ? 'Đang lưu dữ liệu...' : 'Lưu tất cả thay đổi'}
        </Button>
      </div>
    </div>
  )
}
