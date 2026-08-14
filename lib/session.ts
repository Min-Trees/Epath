// Server-side helpers for the admin session cookie.
import 'server-only'
import { cookies } from 'next/headers'
import { getAdminAuth } from './firebase-admin'

export const SESSION_COOKIE_NAME = '__epath_session'
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000 // 7 days

export interface SessionUser {
  uid: string
  email: string | null
  name: string | null
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
}

export async function createSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth()
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS })
}

export async function verifySessionCookie(
  cookie: string
): Promise<SessionUser | null> {
  try {
    const auth = getAdminAuth()
    const decoded = await auth.verifySessionCookie(cookie, true)
    const claims = (decoded as unknown as { role?: string }).role
    const role = (claims as SessionUser['role']) ?? 'admin'
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
      role,
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(idToken: string): Promise<void> {
  const session = await createSessionCookie(idToken)
  const store = await cookies()
  store.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS / 1000,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE_NAME)
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const cookie = store.get(SESSION_COOKIE_NAME)?.value
  if (!cookie) return null
  return verifySessionCookie(cookie)
}