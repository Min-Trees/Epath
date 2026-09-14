'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Achievement } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
  { key: 'coverImage', label: 'Ảnh bìa', kind: 'image' as const, placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'achievements' },
  { key: 'images', label: 'URL hình ảnh bổ sung (mỗi dòng một URL)', kind: 'textarea' as const },
]

export default function AdminAchievementsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Thành tích" subtitle="Quản lý thành tích học sinh hiển thị trên trang chủ.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<Achievement>
        title="Thành tích"
        fields={fields}
        load={cms.achievements.list}
        create={(d) => cms.achievements.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.achievements.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.achievements.remove}
        reorder={cms.achievements.reorder}
        reviewCollection="achievements"
        renderSummary={(item) => (
          <div className="flex items-start gap-3">
            {item.coverImage ? (
              <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] overflow-hidden bg-white shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverImage}
                  alt={item.title.vi || item.title.en}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] bg-[#F6F5F1] shrink-0 flex items-center justify-center text-xs text-[#5C6069] font-bold">
                AWARD
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate" style={{ color: semanticColors.text }}>
                {item.title.vi || item.title.en}
              </div>
              <div className="text-xs line-clamp-2 mt-0.5" style={{ color: semanticColors.textMuted }}>
                {item.description.vi || item.description.en}
              </div>
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}