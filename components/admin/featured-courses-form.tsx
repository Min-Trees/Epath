'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import {
  DEFAULT_FEATURED_COURSES_DATA,
  type FeaturedCoursesSectionData,
  type FeaturedCourseItemData,
} from '@/lib/featured-courses-data'
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Save, Sparkles, Check } from 'lucide-react'

const ACCENT_COLOR_PRESETS = [
  { name: 'Navy', hex: '#1E3570' },
  { name: 'Xanh Lá', hex: '#5C9024' },
  { name: 'Cam', hex: '#F26522' },
  { name: 'Xanh Dương', hex: '#3A54A4' },
  { name: 'Tím', hex: '#6366F1' },
]

interface Props {
  initialData?: FeaturedCoursesSectionData | null
  onSave?: (data: FeaturedCoursesSectionData) => Promise<void>
  isDialogMode?: boolean
}

export function FeaturedCoursesForm({ initialData, onSave, isDialogMode = false }: Props) {
  const [data, setData] = useState<FeaturedCoursesSectionData>(() => {
    return initialData?.courses && initialData.courses.length > 0
      ? initialData
      : DEFAULT_FEATURED_COURSES_DATA
  })
  const [activeCourseIdx, setActiveCourseIdx] = useState<number>(0)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If outside initialData changes
  useEffect(() => {
    if (initialData && initialData.courses && initialData.courses.length > 0) {
      setData(initialData)
    }
  }, [initialData])

  // If standalone page mode (not dialog), load current data from /api/cms/pages/sections
  useEffect(() => {
    if (!onSave && !initialData) {
      fetch('/api/cms/pages/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', pageId: 'home' }),
      })
        .then((res) => res.json())
        .then((res) => {
          const sec = (res.sections || []).find((s: any) => s.type === 'featuredCourses')
          if (sec?.data && (sec.data as FeaturedCoursesSectionData).courses?.length) {
            setData(sec.data as FeaturedCoursesSectionData)
          }
        })
        .catch((err) => console.error('Failed to load featured courses:', err))
    }
  }, [onSave, initialData])

  const courses = data.courses || []

  const updateField = (field: keyof FeaturedCoursesSectionData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCourse = (index: number, field: keyof FeaturedCourseItemData, value: any) => {
    setData((prev) => {
      const nextCourses = [...(prev.courses || [])]
      nextCourses[index] = { ...nextCourses[index], [field]: value }
      return { ...prev, courses: nextCourses }
    })
  }

  const addCourse = () => {
    const newIdx = courses.length + 1
    const newCourse: FeaturedCourseItemData = {
      id: `course-${Date.now()}`,
      title: { vi: `Khóa học mới ${newIdx}`, en: `New Course ${newIdx}` },
      levelBadge: { vi: 'Lớp 1 – 12', en: 'Grades 1 – 12' },
      badges: ['Chương trình Mỹ', 'Chứng chỉ quốc tế'],
      desc: {
        vi: 'Mô tả ngắn gọn về chương trình đào tạo và lộ trình học tập.',
        en: 'Brief description about the curriculum and academic roadmap.',
      },
      points: {
        vi: [
          'Chương trình chuẩn quốc tế linh hoạt',
          'Giáo viên & Cố vấn đồng hành 1:1',
          'Đánh giá năng lực và lộ trình cá nhân hóa',
        ],
        en: [
          'Flexible accredited international curriculum',
          'Dedicated 1:1 teachers and academic mentors',
          'Personalized roadmap and competency assessment',
        ],
      },
      image: '/images/programs/program-high.jpg',
      link: '/programs',
      accentColor: ACCENT_COLOR_PRESETS[(newIdx - 1) % ACCENT_COLOR_PRESETS.length].hex,
    }
    setData((prev) => ({ ...prev, courses: [...(prev.courses || []), newCourse] }))
    setActiveCourseIdx(courses.length)
  }

  const removeCourse = (index: number) => {
    if (courses.length <= 1) {
      alert('Phần này cần ít nhất 1 khóa học.')
      return
    }
    if (!confirm(`Xóa khóa học "${courses[index]?.title?.vi || `Số ${index + 1}`}"?`)) return
    setData((prev) => ({
      ...prev,
      courses: prev.courses?.filter((_, i) => i !== index),
    }))
    setActiveCourseIdx((prev) => Math.max(0, prev - 1))
  }

  const moveCourse = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= courses.length) return
    setData((prev) => {
      const next = [...(prev.courses || [])]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return { ...prev, courses: next }
    })
    setActiveCourseIdx(target)
  }

  const handleResetDefaults = () => {
    if (!confirm('Khôi phục về 4 khóa học mặc định ban đầu của EPath?')) return
    setData(DEFAULT_FEATURED_COURSES_DATA)
    setActiveCourseIdx(0)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSavedSuccess(false)
    try {
      if (onSave) {
        await onSave(data)
      } else {
        // Standalone mode: list sections, find featuredCourses section, and upsert
        const res = await fetch('/api/cms/pages/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list', pageId: 'home' }),
        })
        const listData = await res.json()
        const existing = (listData.sections || []).find((s: any) => s.type === 'featuredCourses')

        const sectionToSave = {
          id: existing?.id || 'home-featuredCourses',
          pageId: 'home',
          type: 'featuredCourses',
          order: existing?.order ?? 2,
          isActive: existing?.isActive ?? true,
          data,
        }

        const saveRes = await fetch('/api/cms/pages/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'upsert', section: sectionToSave }),
        })
        if (!saveRes.ok) throw new Error('Không thể lưu nội dung khóa học')
      }
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu')
    } finally {
      setSaving(false)
    }
  }

  const currentCourse = courses[activeCourseIdx] || courses[0]

  return (
    <div className="space-y-6">
      {/* Top action bar (for standalone page) */}
      {!isDialogMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded border border-[#e2e8f0] shadow-xs">
          <div>
            <h2 className="text-base font-bold text-[#1E3570]">
              Điều chỉnh Nội dung & Hình ảnh: Khóa học nổi bật (Homepage)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật hình ảnh, tiêu đề, cấp học, các gạch đầu dòng đặc điểm và đường link cho các khóa học trên trang chủ.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="h-8 text-xs gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục mặc định
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 text-xs gap-1.5 bg-[#1E3570] hover:bg-[#2E4A9E] text-white"
            >
              {saving ? (
                'Đang lưu…'
              ) : savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-300" />
                  Đã lưu thành công!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 text-xs rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {savedSuccess && isDialogMode && (
        <div className="p-3 text-xs rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu thành công nội dung khóa học nổi bật.</span>
        </div>
      )}

      {/* 1. Header & Section Level Info */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
            1. Tiêu đề & Thông điệp phần &quot;Khóa học nổi bật&quot;
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Badge */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Huy hiệu trên cùng (Pill Badge)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt (mặc định: CHƯƠNG TRÌNH ĐÀO TẠO TIÊU BIỂU)"
                value={data.badge?.vi ?? ''}
                onChange={(e) =>
                  updateField('badge', { ...(data.badge || {}), vi: e.target.value })
                }
                className="h-8 text-xs"
              />
              <Input
                placeholder="English (default: FEATURED LEARNING PROGRAMS)"
                value={data.badge?.en ?? ''}
                onChange={(e) =>
                  updateField('badge', { ...(data.badge || {}), en: e.target.value })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Tiêu đề chính (Section Title)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt (mặc định: Các khóa học nổi bật tại EPath)"
                value={data.title?.vi ?? ''}
                onChange={(e) =>
                  updateField('title', { ...(data.title || {}), vi: e.target.value })
                }
                className="h-8 text-xs"
              />
              <Input
                placeholder="English (default: Featured Programs at EPath)"
                value={data.title?.en ?? ''}
                onChange={(e) =>
                  updateField('title', { ...(data.title || {}), en: e.target.value })
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Mô tả phụ đề (Subtitle)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <textarea
                className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[60px]"
                placeholder="Tiếng Việt: Lộ trình học thuật chuẩn quốc tế..."
                value={data.subtitle?.vi ?? ''}
                onChange={(e) =>
                  updateField('subtitle', { ...(data.subtitle || {}), vi: e.target.value })
                }
              />
              <textarea
                className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[60px]"
                placeholder="English: Accredited international academic pathways..."
                value={data.subtitle?.en ?? ''}
                onChange={(e) =>
                  updateField('subtitle', { ...(data.subtitle || {}), en: e.target.value })
                }
              />
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Nút xem tất cả - Tiếng Việt</Label>
              <Input
                className="h-8 text-xs mt-1"
                placeholder="Xem tất cả chương trình học K–12"
                value={data.ctaText?.vi ?? ''}
                onChange={(e) =>
                  updateField('ctaText', { ...(data.ctaText || {}), vi: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Nút xem tất cả - English</Label>
              <Input
                className="h-8 text-xs mt-1"
                placeholder="View All K–12 Academic Programs"
                value={data.ctaText?.en ?? ''}
                onChange={(e) =>
                  updateField('ctaText', { ...(data.ctaText || {}), en: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Đường link nút</Label>
              <Input
                className="h-8 text-xs mt-1"
                placeholder="/programs"
                value={data.ctaLink ?? ''}
                onChange={(e) => updateField('ctaLink', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Course Cards Editor */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570]">
            2. Danh sách các thẻ khóa học ({courses.length} khóa học)
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addCourse}
            className="h-7 text-xs gap-1 border-slate-300 text-[#1E3570] hover:bg-slate-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm khóa học
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Course Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
            {courses.map((c, i) => {
              const isSelected = i === activeCourseIdx
              const titleVi = c.title?.vi || `Khóa học ${i + 1}`
              return (
                <button
                  key={c.id || i}
                  type="button"
                  onClick={() => setActiveCourseIdx(i)}
                  className={`h-8 px-3 rounded-t text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 ${
                    isSelected
                      ? 'border-[#1E3570] text-[#1E3570] bg-slate-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: c.accentColor || '#1E3570' }}
                  />
                  <span className="truncate max-w-[150px]">{titleVi}</span>
                </button>
              )
            })}
          </div>

          {currentCourse && (
            <div className="space-y-4 pt-2">
              {/* Toolbar for current course */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="text-xs font-bold text-slate-700">
                  Đang chỉnh sửa thẻ #{activeCourseIdx + 1}:{' '}
                  <span className="text-[#1E3570]">{currentCourse.title?.vi || 'Khóa học'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={activeCourseIdx === 0}
                    onClick={() => moveCourse(activeCourseIdx, -1)}
                    className="h-7 px-2 text-xs"
                    title="Chuyển sang trái"
                  >
                    <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={activeCourseIdx === courses.length - 1}
                    onClick={() => moveCourse(activeCourseIdx, 1)}
                    className="h-7 px-2 text-xs"
                    title="Chuyển sang phải"
                  >
                    <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCourse(activeCourseIdx)}
                    className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    title="Xóa khóa học này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Course Image & Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Image Picker */}
                <div className="md:col-span-5 space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Hình ảnh khóa học (Tải lên hoặc chọn từ Thư viện S3)
                  </Label>
                  <div className="rounded border border-slate-200 p-3 bg-slate-50">
                    <ImagePicker
                      value={currentCourse.image || ''}
                      onChange={(url) => updateCourse(activeCourseIdx, 'image', url)}
                      folder="featured-courses"
                      helperText="Ảnh hiển thị tỉ lệ 16:10 trên thẻ khóa học. Khuyến nghị ảnh rõ nét, không bị nén mờ."
                    />
                  </div>
                </div>

                {/* Right: Title & Badges */}
                <div className="md:col-span-7 space-y-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Tên khóa học</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <Input
                        placeholder="Tên tiếng Việt"
                        value={currentCourse.title?.vi ?? ''}
                        onChange={(e) =>
                          updateCourse(activeCourseIdx, 'title', {
                            ...(currentCourse.title || {}),
                            vi: e.target.value,
                          })
                        }
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Course title in English"
                        value={currentCourse.title?.en ?? ''}
                        onChange={(e) =>
                          updateCourse(activeCourseIdx, 'title', {
                            ...(currentCourse.title || {}),
                            en: e.target.value,
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-slate-700">
                      Cấp học / Độ tuổi (Level Badge)
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <Input
                        placeholder="VD: Lớp 9 – 12 (14–18 tuổi)"
                        value={currentCourse.levelBadge?.vi ?? ''}
                        onChange={(e) =>
                          updateCourse(activeCourseIdx, 'levelBadge', {
                            ...(currentCourse.levelBadge || {}),
                            vi: e.target.value,
                          })
                        }
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="VD: Grades 9 – 12 (Age 14–18)"
                        value={currentCourse.levelBadge?.en ?? ''}
                        onChange={(e) =>
                          updateCourse(activeCourseIdx, 'levelBadge', {
                            ...(currentCourse.levelBadge || {}),
                            en: e.target.value,
                          })
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-slate-700">
                      Các huy hiệu / Tags trên ảnh (phân cách bằng dấu phẩy)
                    </Label>
                    <Input
                      placeholder="VD: EdOptions Academy, Cognia & WASC, College Board AP"
                      value={
                        Array.isArray(currentCourse.badges)
                          ? currentCourse.badges.join(', ')
                          : currentCourse.badges || ''
                      }
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        updateCourse(activeCourseIdx, 'badges', arr)
                      }}
                      className="h-8 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Link chi tiết</Label>
                      <Input
                        placeholder="/programs?level=high"
                        value={currentCourse.link ?? ''}
                        onChange={(e) => updateCourse(activeCourseIdx, 'link', e.target.value)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-700">Màu chủ đạo (Accent Color)</Label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={currentCourse.accentColor || '#1E3570'}
                          onChange={(e) => updateCourse(activeCourseIdx, 'accentColor', e.target.value)}
                          className="w-8 h-8 rounded border p-0.5 cursor-pointer shrink-0"
                        />
                        <div className="flex items-center gap-1 flex-1">
                          {ACCENT_COLOR_PRESETS.map((p) => (
                            <button
                              key={p.hex}
                              type="button"
                              onClick={() => updateCourse(activeCourseIdx, 'accentColor', p.hex)}
                              title={p.name}
                              className={`w-6 h-6 rounded-full border transition-transform ${
                                currentCourse.accentColor === p.hex ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'
                              }`}
                              style={{ backgroundColor: p.hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div>
                <Label className="text-xs font-semibold text-slate-700">Mô tả ngắn gọn khóa học</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <textarea
                    className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[68px]"
                    placeholder="Mô tả tiếng Việt (khoảng 2-3 câu)..."
                    value={currentCourse.desc?.vi ?? ''}
                    onChange={(e) =>
                      updateCourse(activeCourseIdx, 'desc', {
                        ...(currentCourse.desc || {}),
                        vi: e.target.value,
                      })
                    }
                  />
                  <textarea
                    className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[68px]"
                    placeholder="English description..."
                    value={currentCourse.desc?.en ?? ''}
                    onChange={(e) =>
                      updateCourse(activeCourseIdx, 'desc', {
                        ...(currentCourse.desc || {}),
                        en: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* 3 Key Points */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-xs font-semibold text-slate-700">
                  3 Điểm nổi bật (Checklist bullet points)
                </Label>
                {[0, 1, 2].map((ptIdx) => {
                  const ptVi = currentCourse.points?.vi?.[ptIdx] || ''
                  const ptEn = currentCourse.points?.en?.[ptIdx] || ''
                  return (
                    <div key={ptIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 w-4 shrink-0">#{ptIdx + 1}</span>
                        <Input
                          placeholder={`Điểm nổi bật ${ptIdx + 1} (VI)`}
                          value={ptVi}
                          onChange={(e) => {
                            const viArr = [...(currentCourse.points?.vi || ['', '', ''])]
                            viArr[ptIdx] = e.target.value
                            updateCourse(activeCourseIdx, 'points', {
                              ...(currentCourse.points || {}),
                              vi: viArr,
                            })
                          }}
                          className="h-8 text-xs flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder={`Key highlight ${ptIdx + 1} (EN)`}
                          value={ptEn}
                          onChange={(e) => {
                            const enArr = [...(currentCourse.points?.en || ['', '', ''])]
                            enArr[ptIdx] = e.target.value
                            updateCourse(activeCourseIdx, 'points', {
                              ...(currentCourse.points || {}),
                              en: enArr,
                            })
                          }}
                          className="h-8 text-xs flex-1"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button footer (for dialog or form) */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-9 px-5 bg-[#1E3570] hover:bg-[#2E4A9E] text-white text-xs font-semibold gap-1.5"
        >
          {saving ? 'Đang lưu…' : <><Save className="w-4 h-4" /> Lưu khóa học nổi bật</>}
        </Button>
      </div>
    </div>
  )
}
