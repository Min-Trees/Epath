import { NextResponse } from 'next/server'
import { isS3Configured, S3_CONFIG } from '@/lib/s3'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    configured: isS3Configured(),
    hasEndpoint: !!S3_CONFIG.endpoint,
    hasAccessKey: !!S3_CONFIG.accessKeyId,
    hasSecretKey: !!S3_CONFIG.secretAccessKey,
    hasBucket: !!S3_CONFIG.bucket,
    bucket: S3_CONFIG.bucket,
    endpoint: S3_CONFIG.endpoint,
    region: S3_CONFIG.region,
    useLocalFallback: S3_CONFIG.useLocalFallback,
    allEnvKeys: Object.keys(process.env).filter(k => k.startsWith('S3_')),
    rawEndpoint: process.env.S3_ENDPOINT || null,
    rawBucket: process.env.S3_BUCKET || null,
    rawAccessKey: process.env.S3_ACCESS_KEY_ID || null,
  })
}
