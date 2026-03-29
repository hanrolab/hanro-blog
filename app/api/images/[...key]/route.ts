import { NextRequest, NextResponse } from 'next/server'
import { getFromR2 } from '@/lib/r2'

const ALLOWED_PREFIXES = ['blog/', 'thumbnails/', 'portfolio/']

// GET /api/images/blog/123_photo.jpg → serve from R2
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
): Promise<NextResponse> {
  const { key } = await params

  if (key.some((segment) => segment === '..' || segment === '.')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const fileKey = key.join('/')

  if (!ALLOWED_PREFIXES.some((prefix) => fileKey.startsWith(prefix))) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  try {
    const result = await getFromR2(fileKey)
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const isSvg = result.contentType === 'image/svg+xml'

    return new NextResponse(result.body as unknown as BodyInit, {
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(isSvg && { 'Content-Disposition': 'attachment' }),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
