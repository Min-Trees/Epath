'use client'

import { useState } from 'react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PageSectionsEditor } from '@/components/admin/page-sections-editor'
import { semanticColors } from '@/lib/design-tokens'
import type { PageSlug } from '@/lib/pages-repo'

const PAGES: { id: PageSlug; title: string; subtitle: string }[] = [
  { id: 'home', title: 'Trang chủ', subtitle: 'Sắp xếp và bật/tắt các section hiển thị trên Trang chủ.' },
  { id: 'about', title: 'Trang Giới thiệu', subtitle: 'Sắp xếp và cấu hình các section trang Giới thiệu.' },
  { id: 'programs', title: 'Trang Chương trình học', subtitle: 'Sắp xếp section trang Chương trình học.' },
  { id: 'admissions', title: 'Trang Tuyển sinh', subtitle: 'Sắp xếp section trang Tuyển sinh K-12.' },
  { id: 'events', title: 'Trang Sự kiện', subtitle: 'Sắp xếp section trang Sự kiện học thuật.' },
  { id: 'partners', title: 'Trang Đối tác', subtitle: 'Sắp xếp section trang Đối tác chiến lược.' },
]

export default function AdminPageBuilderIndexPage() {
  const user = useRequireAdmin()
  const [selected, setSelected] = useState<PageSlug>('home')

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Bố Cục Trang (Page Builder)"
      subtitle="Kéo thả hoặc thay đổi thứ tự và trạng thái bật/tắt các section cho từng trang."
    >
      {/* Sleek Underline Tabs - Height 36px, text-only, no icons */}
      <div className="flex items-center gap-1 border-b border-[#e2e8f0] mb-5 overflow-x-auto scrollbar-none">
        {PAGES.map((p) => {
          const isActive = selected === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p.id)}
              className={`h-9 px-3 text-sm font-medium transition-all inline-flex items-center whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? 'border-[#1e3a8a] text-[#1e3a8a] font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{p.title}</span>
            </button>
          )
        })}
      </div>

      {PAGES.filter((p) => p.id === selected).map((p) => (
        <PageSectionsEditor
          key={p.id}
          pageId={p.id}
          title={p.title}
          subtitle={p.subtitle}
        />
      ))}
    </AdminLayout>
  )
}