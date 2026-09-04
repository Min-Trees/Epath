'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import type { Program } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tên chương trình', kind: 'text' as const, multilang: true },
  { key: 'slug', label: 'Slug', kind: 'text' as const },
  {
    key: 'level',
    label: 'Cấp học',
    kind: 'select' as const,
    options: [
      { value: 'kindergarten', label: 'Mầm non' },
      { value: 'elementary', label: 'Tiểu học' },
      { value: 'middle', label: 'Trung học cơ sở' },
      { value: 'high', label: 'Trung học phổ thông' },
    ],
  },
  { key: 'shortDescription', label: 'Mô tả ngắn', kind: 'richtext' as const, multilang: true },
  { key: 'content', label: 'Nội dung chi tiết', kind: 'richtext' as const, multilang: true },
  { key: 'ageRange', label: 'Độ tuổi / lớp', kind: 'text' as const },
  { key: 'imageUrl', label: 'Hình ảnh', kind: 'image' as const, placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'programs' },
]

export default function AdminProgramsPage() {
  const user = useRequireAdmin()
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

  return (
    <AdminLayout
      title="Chương trình học"
      subtitle="Quản lý các chương trình và cấp học. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <div
        className="mb-4 p-4 rounded-lg flex items-center justify-between gap-3"
        style={{ backgroundColor: semanticColors.primaryBg, border: '1px solid rgba(58,83,163,0.2)' }}
      >
        <div>
          <div className="font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Chưa có chương trình nào?
          </div>
          <div className="text-sm" style={{ color: semanticColors.textMuted }}>
            Tạo nhanh 4 chương trình mẫu (Kindergarten, Elementary, Middle, High) để bắt đầu.
          </div>
        </div>
        <Button onClick={handleSeed}>
          <Sparkles className="w-4 h-4 mr-2" />
          Tạo mẫu
        </Button>
      </div>

      <CrudList<Program>
        title="Chương trình"
        fields={fields}
        load={cms.programs.list}
        create={(d) => cms.programs.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.programs.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.programs.remove}
        reorder={cms.programs.reorder}
        reviewCollection="programs"
        renderSummary={(item) => (
          <div>
            <div
              className="text-xs px-2 py-1 rounded inline-block mb-1"
              style={{
                color: semanticColors.primary,
                backgroundColor: semanticColors.primaryBg,
              }}
            >
              {item.level}
            </div>
            <div className="font-medium" style={{ color: semanticColors.text }}>
              {item.title.vi}
            </div>
            <div className="text-sm line-clamp-2" style={{ color: semanticColors.textMuted }}>
              {item.shortDescription.vi}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}