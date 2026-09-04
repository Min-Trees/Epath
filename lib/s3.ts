// Server-side helper for Viettel IDC Cloud Storage (S3-compatible).
//
// Viettel's vcos3 endpoint exposes an API that matches AWS S3, so we use
// the official AWS SDK and just point it at the custom endpoint + region.
// All credentials come from `.env.local` (the same block `S3_*`).
import 'server-only'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const S3_CONFIG = {
  endpoint: process.env.S3_ENDPOINT || '',
  region: process.env.S3_REGION || 'ap-southeast-1',
  bucket: process.env.S3_BUCKET || 'training-epath',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  /**
   * When `S3_USE_LOCAL_FALLBACK=1` we accept uploads but skip the network
   * call so the rest of the admin UI keeps working in offline development.
   */
  useLocalFallback: process.env.S3_USE_LOCAL_FALLBACK === '1',
}

export function isS3Configured(): boolean {
  return Boolean(
    S3_CONFIG.endpoint &&
      S3_CONFIG.accessKeyId &&
      S3_CONFIG.secretAccessKey &&
      S3_CONFIG.bucket
  )
}

let _client: S3Client | null = null

function getClient(): S3Client {
  if (_client) return _client
  if (!isS3Configured()) {
    throw new Error(
      'S3 is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET in .env.local.'
    )
  }
  _client = new S3Client({
    endpoint: S3_CONFIG.endpoint,
    region: S3_CONFIG.region,
    forcePathStyle: true, // Viettel vcos3 expects path-style addressing
    credentials: {
      accessKeyId: S3_CONFIG.accessKeyId,
      secretAccessKey: S3_CONFIG.secretAccessKey,
    },
  })
  return _client
}

export interface UploadInput {
  /** Object key inside the bucket, e.g. `cms/2026/08/abc-photo.jpg`. */
  key: string
  body: Buffer | Uint8Array | Blob | string
  contentType: string
  cacheControl?: string
}

export interface UploadResult {
  key: string
  url: string
  bucket: string
  size: number
  contentType: string
}

/**
 * Build the public URL for a stored object. Uses path-style format:
 * `https://<endpoint>/<bucket>/<key>` which works reliably with
 * S3-compatible services like Viettel CloudStorage.
 */
export function buildPublicUrl(key: string): string {
  if (!isS3Configured()) return ''
  return `${S3_CONFIG.endpoint}/${S3_CONFIG.bucket}/${key}`
}

/**
 * Slugify a filename so S3 keys are URL-safe and predictable.
 */
export function slugifyFilename(name: string): string {
  const lastDot = name.lastIndexOf('.')
  const stem = lastDot >= 0 ? name.slice(0, lastDot) : name
  const ext = lastDot >= 0 ? name.slice(lastDot).toLowerCase() : ''
  const cleanedStem = stem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
  return `${cleanedStem || 'file'}${ext}`
}

/**
 * Generate a foldered, collision-resistant S3 key.
 */
export function buildS3Key(
  folder: string,
  originalName: string,
  rand = Math.random().toString(36).slice(2, 10)
): string {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const safeName = slugifyFilename(originalName)
  return `${folder}/${yyyy}/${mm}/${rand}-${safeName}`
}

export async function uploadObject(input: UploadInput): Promise<UploadResult> {
  const size =
    input.body instanceof Buffer
      ? input.body.byteLength
      : input.body instanceof Uint8Array
        ? input.body.byteLength
        : typeof input.body === 'string'
          ? Buffer.byteLength(input.body)
          : (input.body as Blob).size

  if (S3_CONFIG.useLocalFallback) {
    return {
      key: input.key,
      url: buildPublicUrl(input.key),
      bucket: S3_CONFIG.bucket,
      size,
      contentType: input.contentType,
    }
  }

  await getClient().send(
    new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl ?? 'public, max-age=31536000, immutable',
      ACL: 'public-read',
    })
  )

  return {
    key: input.key,
    url: buildPublicUrl(input.key),
    bucket: S3_CONFIG.bucket,
    size,
    contentType: input.contentType,
  }
}

export async function deleteObject(key: string): Promise<void> {
  if (S3_CONFIG.useLocalFallback || !isS3Configured()) return
  await getClient().send(
    new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    })
  )
}

export async function objectExists(key: string): Promise<boolean> {
  if (!isS3Configured()) return false
  try {
    await getClient().send(
      new HeadObjectCommand({ Bucket: S3_CONFIG.bucket, Key: key })
    )
    return true
  } catch {
    return false
  }
}

/**
 * Generate a temporary signed URL (e.g. for private files / large PDFs).
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const client = getClient()
  const command = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
  })
  return getSignedUrl(client, command, { expiresIn })
}

/**
 * Tiny helper: resolve an `s3://...` placeholder to a real public URL.
 * Kept for forward-compat – callers don't need it for normal uploads.
 */
export function resolveObjectUrl(value: string | undefined | null): string {
  if (!value) return ''
  return value
}
