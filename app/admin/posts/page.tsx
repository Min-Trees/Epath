'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { BlogPostList } from '@/components/admin/blog-post-list'
import { cms } from '@/lib/cms-client'

export default function AdminPostsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Bài viết"
      subtitle="Đăng và quản lý bài viết blog/tin tức đa ngôn ngữ"
    >
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