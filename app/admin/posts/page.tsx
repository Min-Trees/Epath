'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { BlogPostList } from '@/components/admin/blog-post-list'
import { cms } from '@/lib/cms-client'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminPostsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Bài viết"
      subtitle="Đăng và quản lý bài viết blog/tin tức đa ngôn ngữ"
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      <BlogPostList
        title="Bài viết"
        fields={[]}
        load={cms.blogPosts.list}
        create={cms.blogPosts.create}
        update={cms.blogPosts.update as (id: string, data: Parameters<typeof cms.blogPosts.update>[1]) => ReturnType<typeof cms.blogPosts.update>}
        remove={cms.blogPosts.remove}
        reorder={cms.blogPosts.reorder}
        reviewCollection="blogPosts"
      />
    </AdminLayout>
  )
}