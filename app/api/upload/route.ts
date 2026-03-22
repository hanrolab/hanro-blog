import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2, buildFileKey } from '@/lib/r2'
import { getIsAdmin } from '@/lib/auth'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { getEnv } from '@/lib/env'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
])

const ALLOWED_FOLDERS = new Set(['blog', 'thumbnails', 'portfolio'])
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ip = getClientIp(request)
  const { allowed, retryAfter } = checkRateLimit(`upload:${ip}`, RATE_LIMITS.upload)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many uploads. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'blog'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Invalid upload folder' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 })
    }

    const key = buildFileKey(folder, file.name)
    const buffer = Buffer.from(await file.arrayBuffer())

    await uploadToR2(key, buffer, file.type)

    const env = getEnv()
    const url = env.R2_PUBLIC_URL ? `${env.R2_PUBLIC_URL}/${key}` : `/api/images/${key}`

    return NextResponse.json({ url, key })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
