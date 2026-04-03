import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED_PATHS = ['/write', '/edit', '/portfolio']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  let response: NextResponse

  if (isProtected) {
    const token = request.cookies.get('hanro_token')?.value

    if (!token) {
      response = NextResponse.redirect(new URL('/admin/login', request.url))
    } else {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        await jwtVerify(token, secret)
        response = NextResponse.next()
      } catch {
        response = NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  } else {
    response = NextResponse.next()
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
        "img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com",
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
        "connect-src 'self' https://api.cloudflare.com",
        "frame-src 'self' https://www.youtube.com",
      ].join('; ')
    )
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.svg|feed\\.xml).*)'],
}
