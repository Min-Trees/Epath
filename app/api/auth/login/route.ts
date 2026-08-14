import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminAuth } from '@/lib/firebase-admin'
import { setSessionCookie } from '@/lib/session'

const BodySchema = z.object({
  idToken: z.string().min(10),
})

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  try {
    const auth = getAdminAuth()
    const decoded = await auth.verifyIdToken(parsed.data.idToken)
    await setSessionCookie(parsed.data.idToken)
    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: (decoded as unknown as { role?: string }).role ?? 'admin',
    })
  } catch (error) {
    console.error('[auth/login]', error)
    return NextResponse.json(
      { error: 'Xác thực thất bại' },
      { status: 401 }
    )
  }
}