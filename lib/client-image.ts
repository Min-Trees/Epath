/**
 * Client-side image compression and optimization utility.
 * Automatically resizes and compresses high-resolution photos (e.g. from mobile cameras or raw exports)
 * before uploading to the server to prevent HTTP 413 (Payload Too Large) and speed up uploads.
 */

export interface CompressOptions {
  /** Maximum width in pixels (default: 2048) */
  maxWidth?: number
  /** Maximum height in pixels (default: 2048) */
  maxHeight?: number
  /** Compression quality between 0.1 and 1.0 (default: 0.85) */
  quality?: number
  /** Max file size threshold in bytes where compression kicks in (default: 1MB) */
  thresholdBytes?: number
  /** Hard upper limit in bytes for the server payload (default: 4.2MB, safely under Vercel's 4.5MB limit) */
  maxAllowedBytes?: number
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.85,
  thresholdBytes: 1024 * 1024, // 1 MB
  maxAllowedBytes: Math.floor(4.2 * 1024 * 1024), // 4.2 MB
}

/**
 * Compresses an image File if necessary.
 * - SVGs and animated GIFs are kept as-is (rasterizing would destroy vectors/animation).
 * - JPEGs, PNGs, and WebPs are downscaled if dimensions > 2048px or file > thresholdBytes.
 * - If the compressed file is still > maxAllowedBytes, throws a helpful error.
 */
export async function compressImageForUpload(
  file: File,
  customOptions?: CompressOptions
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...customOptions }

  // Only run in the browser
  if (typeof window === 'undefined') return file

  // SVG: vector format, cannot and should not be rasterized via canvas
  if (file.type === 'image/svg+xml') {
    if (file.size > opts.maxAllowedBytes) {
      throw new Error(
        `Tệp SVG quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là ${(opts.maxAllowedBytes / (1024 * 1024)).toFixed(1)}MB.`
      )
    }
    return file
  }

  // GIF: animated, canvas drawing only captures the first frame
  if (file.type === 'image/gif') {
    if (file.size > opts.maxAllowedBytes) {
      throw new Error(
        `Tệp GIF quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB). Giới hạn tối đa là ${(opts.maxAllowedBytes / (1024 * 1024)).toFixed(1)}MB.`
      )
    }
    return file
  }

  // If not a standard compressible image format, check size limit
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'].includes(file.type)) {
    if (file.size > opts.maxAllowedBytes) {
      throw new Error(
        `Dung lượng tệp vượt quá giới hạn ${(opts.maxAllowedBytes / (1024 * 1024)).toFixed(1)}MB.`
      )
    }
    return file
  }

  try {
    const compressed = await performCompression(file, opts)
    return compressed
  } catch (err) {
    console.warn('[compressImageForUpload] Failed to compress, checking raw size:', err)
    if (file.size > opts.maxAllowedBytes) {
      throw new Error(
        `Dung lượng tệp (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn của máy chủ (${(opts.maxAllowedBytes / (1024 * 1024)).toFixed(1)}MB). Vui lòng chọn tệp nhỏ hơn.`
      )
    }
    return file
  }
}

async function performCompression(file: File, opts: Required<CompressOptions>): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl)
      try {
        let { naturalWidth: width, naturalHeight: height } = img

        // If file is already small AND dimensions are within bounds, keep original
        if (
          file.size <= opts.thresholdBytes &&
          width <= opts.maxWidth &&
          height <= opts.maxHeight
        ) {
          resolve(file)
          return
        }

        // Calculate aspect-ratio preserving dimensions
        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height)
          width = Math.max(1, Math.round(width * ratio))
          height = Math.max(1, Math.round(height * ratio))
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Decide output MIME type:
        // PNG with transparency -> webp retains alpha and compresses up to 80-90% smaller.
        // JPEG/JPG -> image/jpeg.
        // WebP -> image/webp.
        let outputType = file.type === 'image/png' ? 'image/webp' : file.type
        if (outputType !== 'image/jpeg' && outputType !== 'image/webp') {
          outputType = 'image/jpeg'
        }

        let blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, outputType, opts.quality)
        )

        // Fallback to jpeg if webp canvas export failed
        if (!blob && outputType === 'image/webp') {
          outputType = 'image/jpeg'
          blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, outputType, opts.quality)
          )
        }

        if (!blob) {
          resolve(file)
          return
        }

        // If compressed blob is larger than original file and original is within limit, keep original
        if (blob.size >= file.size && file.size <= opts.maxAllowedBytes) {
          resolve(file)
          return
        }

        // If still exceeds maxAllowedBytes, do a second more aggressive pass
        if (blob.size > opts.maxAllowedBytes) {
          const secondPassWidth = Math.max(1, Math.round(width * 0.75))
          const secondPassHeight = Math.max(1, Math.round(height * 0.75))
          canvas.width = secondPassWidth
          canvas.height = secondPassHeight
          ctx.drawImage(img, 0, 0, secondPassWidth, secondPassHeight)
          const secondBlob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, outputType, 0.7)
          )
          if (secondBlob && secondBlob.size <= opts.maxAllowedBytes) {
            const finalName = renameExtension(file.name, outputType)
            resolve(new File([secondBlob], finalName, { type: outputType }))
            return
          }
          if (secondBlob && secondBlob.size > opts.maxAllowedBytes) {
            reject(
              new Error(
                `Ảnh quá lớn (${(file.size / (1024 * 1024)).toFixed(1)}MB) và không thể nén xuống dưới ${(opts.maxAllowedBytes / (1024 * 1024)).toFixed(1)}MB. Vui lòng chọn ảnh nhỏ hơn.`
              )
            )
            return
          }
        }

        const finalName = renameExtension(file.name, outputType)
        const finalFile = new File([blob], finalName, { type: outputType })
        resolve(finalFile)
      } catch (e) {
        reject(e)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Không thể đọc tệp hình ảnh'))
    }

    img.src = objectUrl
  })
}

function renameExtension(originalName: string, mimeType: string): string {
  const lastDot = originalName.lastIndexOf('.')
  const stem = lastDot >= 0 ? originalName.slice(0, lastDot) : originalName
  if (mimeType === 'image/webp') return `${stem}.webp`
  if (mimeType === 'image/jpeg') return `${stem}.jpg`
  return originalName
}
