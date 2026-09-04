import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const content = readFileSync(join(process.cwd(), '.env.local'), 'utf8')
    const hasS3 = content.includes('S3_ENDPOINT')
    const lines = content.split('\n').length
    
    return NextResponse.json({
      contentLength: content.length,
      lineCount: lines,
      hasS3Endpoint: hasS3,
      // Show first 500 chars
      preview: content.slice(0, 500),
      // Show last 200 chars
      end: content.slice(-200),
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}
