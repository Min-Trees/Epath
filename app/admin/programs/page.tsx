'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList, type CrudFieldDef } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import type { Program } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields: CrudFieldDef[] = [
  { key: 'title', label: 'Tên chương trình (Song ngữ)', kind: 'text', multilang: true },
  { key: 'slug', label: 'Slug (Định danh URL)', kind: 'text' },
  {
    key: 'level',
    label: 'Cấp học',
    kind: 'select',
    options: [
      { value: 'kindergarten', label: 'Mầm non (3 – 6 tuổi)' },
      { value: 'elementary', label: 'Tiểu học (Lớp 1 – 5)' },
      { value: 'middle', label: 'Trung học cơ sở (Lớp 6 – 8)' },
      { value: 'high', label: 'Trung học phổ thông (Lớp 9 – 12) – Dual Diploma & Fulltime Homeschool' },
    ],
  },
  { key: 'shortDescription', label: 'Mô tả ngắn / Phân mục (Song ngữ)', kind: 'richtext', multilang: true },
  { key: 'content', label: 'Nội dung chi tiết (Song ngữ)', kind: 'richtext', multilang: true },
  { key: 'ageRange', label: 'Độ tuổi / Lớp học', kind: 'text' },
  { key: 'imageUrl', label: 'Hình ảnh đại diện', kind: 'image', placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'programs' },
]

const levelBadges: Record<string, { label: string; color: string; bg: string }> = {
  kindergarten: { label: 'Mầm non (3–6 tuổi)', color: '#5C9024', bg: '#8DC63F25' },
  elementary: { label: 'Tiểu học (Lớp 1–5)', color: '#2E4A9E', bg: '#2E4A9E15' },
  middle: { label: 'THCS (Lớp 6–8)', color: '#1E3570', bg: '#1E357015' },
  high: { label: 'THPT (Lớp 9–12)', color: '#F26522', bg: '#F2652215' },
}

export default function AdminProgramsPage() {
  const user = useRequireAdmin()
  const [levelFilter, setLevelFilter] = useState<'all' | 'kindergarten' | 'elementary' | 'middle' | 'high'>('all')

  if (user === undefined) return null

  const handleSeed = async () => {
    if (!confirm(`Tạo ${DEFAULT_PROGRAMS.length} chương trình mẫu vào Firestore? (Bỏ qua nếu đã có)`)) return
    for (const p of DEFAULT_PROGRAMS) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = p
        await cms.programs.create(data as never)
      } catch (err) {
        console.error('Seed program failed:', err)
      }
    }
    alert('Đã tạo xong. Tải lại trang để thấy danh sách.')
    location.reload()
  }

  const loadFiltered = async () => {
    const list = await cms.programs.list()
    if (levelFilter === 'all') return list
    return list.filter((p) => p.level === levelFilter)
  }

  return (
    <AdminLayout
      title="Chương trình học"
      subtitle="Quản lý danh mục chương trình học từ Mầm non đến THPT (Dual Diploma & Fulltime Homeschool)."
    >
      {/* Thông tin hỗ trợ THPT Dual Diploma & Fulltime Homeschool */}
      <div className="mb-4 p-4 rounded bg-slate-50 border border-slate-200 text-xs text-[#20242B]">
        <div className="font-bold text-[#1E3570] text-sm mb-1.5">
          Lộ Trình THPT EdOptions Academy (Dual Diploma & Fulltime Homeschool)
        </div>
        <p className="leading-relaxed text-[#5C6069]">
          Hai chương trình THPT chủ lực đã được tích hợp đầy đủ trong hệ thống:
        </p>
        <div className="mt-2 grid sm:grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="font-bold text-[#2E4A9E] block">1.1 Lựa chọn Dual Diploma (Song bằng)</span>
            <span className="text-[#20242B] font-medium">Dual Diploma — Song bằng THPT Việt Nam & Hoa Kỳ</span>
          </div>
          <div className="p-2.5 rounded bg-white border border-slate-200">
            <span className="font-bold text-[#F26522] block">1.2 Lựa chọn Fulltime Homeschool (Homeschool toàn phần)</span>
            <span className="text-[#20242B] font-medium">Fulltime Homeschool — Học toàn thời gian chương trình THPT Hoa Kỳ</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-[#5C6069] italic">
          * Mọi chỉnh sửa tiêu đề, mô tả và hình ảnh của 2 chương trình này tại đây sẽ tự động đồng bộ ra mục Spotlight trên website.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 border border-slate-200 bg-white p-1 rounded">
          <div className="px-2 text-xs font-semibold text-[#5C6069]">
            Cấp học:
          </div>
          <button
            type="button"
            onClick={() => setLevelFilter('all')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              levelFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-[#5C6069] hover:text-[#20242B]'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('kindergarten')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              levelFilter === 'kindergarten'
                ? 'bg-[#5C9024] text-white'
                : 'text-[#5C6069] hover:text-[#5C9024]'
            }`}
          >
            Mầm non
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('elementary')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              levelFilter === 'elementary'
                ? 'bg-[#2E4A9E] text-white'
                : 'text-[#5C6069] hover:text-[#2E4A9E]'
            }`}
          >
            Tiểu học
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('middle')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              levelFilter === 'middle'
                ? 'bg-[#1E3570] text-white'
                : 'text-[#5C6069] hover:text-[#1E3570]'
            }`}
          >
            THCS
          </button>
          <button
            type="button"
            onClick={() => setLevelFilter('high')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              levelFilter === 'high'
                ? 'bg-[#F26522] text-white'
                : 'text-[#5C6069] hover:text-[#F26522]'
            }`}
          >
            THPT (Dual & Homeschool)
          </button>
        </div>

        <Button variant="outline" size="sm" onClick={handleSeed} className="rounded">
          Tạo lại mẫu mặc định
        </Button>
      </div>

      <CrudList<Program>
        key={levelFilter}
        title="Chương trình"
        fields={fields}
        load={loadFiltered}
        create={(d) => cms.programs.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.programs.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.programs.remove}
        reorder={cms.programs.reorder}
        reviewCollection="programs"
        renderSummary={(item) => {
          const badge = levelBadges[item.level] || { label: item.level, color: '#666', bg: '#eee' }
          const title = (item.title as Record<string, string>)?.vi || (item.title as unknown as string) || ''
          const rawShortDesc = (item.shortDescription as Record<string, string>)?.vi || (item.shortDescription as unknown as string) || ''
          const shortDesc = rawShortDesc.replace(/<[^>]+>/g, '').trim()
          const isDual = item.slug === 'high-dual-diploma'
          const isFulltime = item.slug === 'high-fulltime-homeschool'

          return (
            <div className="flex items-start gap-3">
              {item.imageUrl && (
                <div className="w-16 h-12 rounded overflow-hidden shrink-0 border border-slate-200 bg-slate-100 hidden sm:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ color: badge.color, backgroundColor: badge.bg }}
                  >
                    {badge.label}
                  </span>
                  {isDual && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2E4A9E] text-white">
                      1.1 Dual Diploma (Song bằng)
                    </span>
                  )}
                  {isFulltime && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F26522] text-white">
                      1.2 Fulltime Homeschool
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    slug: {item.slug}
                  </span>
                </div>
                <div className="font-bold text-sm text-[#20242B]">
                  {title}
                </div>
                {shortDesc && (
                  <div className="text-xs text-[#5C6069] line-clamp-2 mt-0.5 leading-relaxed">
                    {shortDesc}
                  </div>
                )}
              </div>
            </div>
          )
        }}
      />
    </AdminLayout>
  )
}