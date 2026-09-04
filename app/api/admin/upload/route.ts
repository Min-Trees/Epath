// Admin-only endpoints for uploading / deleting media on Viettel S3.
//
//   POST   /api/admin/upload        form-data: file + folder
//   GET    /api/admin/upload        list of recent media (uses CMS media collection)
//   DELETE /api/admin/upload?key=…  remove a single uploaded object
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import {
  buildPublicUrl,
  buildS3Key,
  deleteObject,
  isS3Configured,
  uploadObject,
} from '@/lib/s3'
import { listCollection, createDocument, deleteDocument } from '@/lib/cms-repo'
import { CollectionNames } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Không giới hạn dung lượng ảnh – tệp có thể lớn tùy ý.
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
])

const QuerySchema = z.object({
  key: z.string().min(1).optional(),
})

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const items = await listCollection<{
      id: string
      key: string
      url: string
      bucket: string
      fileName: string
      mimeType: string
      size: number
      folder: string
      uploadedBy: string
      uploaderEmail: string
      uploadedAt: string
    }>(CollectionNames.media)
    // Newest first
    items.sort((a, b) =>
      (b.uploadedAt || '').localeCompare(a.uploadedAt || '')
    )
    return NextResponse.json({ configured: isS3Configured(), items })
  } catch (err) {
    console.error('[admin/upload] list failed:', err)
    return NextResponse.json(
      { error: 'Failed to list media' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isS3Configured()) {
    return NextResponse.json(
      { error: 'S3 chưa được cấu hình (thiếu S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET).' },
      { status: 500 }
    )
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json(
      { error: 'Body phải là multipart/form-data' },
      { status: 400 }
    )
  }

  const file = formData.get('file')
  const folderRaw = (formData.get('folder') as string | null) || 'cms'
  const folder = folderRaw.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 60) || 'cms'

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Thiếu trường `file`' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Định dạng ${file.type || 'không xác định'} không được phép` },
      { status: 400 }
    )
  }

  try {
    const arrayBuf = await file.arrayBuffer()
    const body = Buffer.from(arrayBuf)
    const key = buildS3Key(folder, file.name || 'image')
    const result = await uploadObject({
      key,
      body,
      contentType: file.type,
    })

    const mediaId = await createDocument(CollectionNames.media, {
      key: result.key,
      url: result.url,
      bucket: result.bucket,
      fileName: file.name || result.key.split('/').pop() || 'image',
      mimeType: file.type,
      size: result.size,
      folder,
      uploadedBy: user.uid,
      uploaderEmail: user.email || '',
      uploaderName: user.name || '',
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      ok: true,
      media: { id: mediaId, ...result, fileName: file.name, mimeType: file.type, size: result.size, folder },
    })
  } catch (err) {
    console.error('[admin/upload] upload failed:', err)
    return NextResponse.json(
      { error: (err as Error).message || 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const parsed = QuerySchema.safeParse({ key: url.searchParams.get('key') || undefined })
  if (!parsed.success || !parsed.data.key) {
    return NextResponse.json({ error: 'Thiếu `key`' }, { status: 400 })
  }

  try {
    // Delete from S3
    await deleteObject(parsed.data.key)

    // Delete from Firestore media collection
    const mediaItems = await listCollection<{ id: string; key: string }>(CollectionNames.media)
    const mediaDoc = mediaItems.find(m => m.key === parsed.data.key)
    if (mediaDoc) {
      await deleteDocument(CollectionNames.media, mediaDoc.id)
    }

    return NextResponse.json({ ok: true, url: buildPublicUrl(parsed.data.key) })
  } catch (err) {
    console.error('[admin/upload] delete failed:', err)
    return NextResponse.json(
      { error: (err as Error).message || 'Delete failed' },
      { status: 500 }
    )
  }
}
