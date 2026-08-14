import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createIntlMiddleware({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'always',
})

const SESSION_COOKIE = '__epath_session'

// Edge-safe combined middleware. Firebase Admin cannot run here, so we
// only check for the presence of the session cookie. Actual verification
// happens in API routes and /api/auth/me.
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin area: never run next-intl, enforce session cookie.
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next()
    }
    const cookie = req.cookies.get(SESSION_COOKIE)?.value
    if (!cookie) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Everything else: let next-intl handle locale routing.
  return intlMiddleware(req)
}

export const config = {
  // Skip API, _next, admin (handled above), and static files.
  matcher: ['/', '/(vi|en)/:path*', '/admin/:path*'],
}