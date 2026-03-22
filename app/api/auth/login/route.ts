import { NextRequest, NextResponse } from 'next/server'
import { createToken, COOKIE_NAME } from '@/lib/auth'
import { loginSchema } from '@/lib/validation'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { getEnv } from '@/lib/env'

async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const [sig1, sig2] = await Promise.all([
    crypto.subtle.sign('HMAC', key, encoder.encode(a)),
    crypto.subtle.sign('HMAC', key, encoder.encode(b)),
  ])
  const arr1 = new Uint8Array(sig1)
  const arr2 = new Uint8Array(sig2)
  if (arr1.length !== arr2.length) return false
  let result = 0
  for (let i = 0; i < arr1.length; i++) {
    result |= arr1[i] ^ arr2[i]
  }
  return result === 0
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request)
  const { allowed, retryAfter } = checkRateLimit(`login:${ip}`, RATE_LIMITS.login)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const body = await request.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const env = getEnv()
  const isValid = await constantTimeCompare(parsed.data.password, env.ADMIN_PASSWORD)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = await createToken()

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return response
}
