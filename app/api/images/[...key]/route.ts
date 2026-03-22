import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getEnv } from '@/lib/env'

let _s3: S3Client | null = null

function getS3(): S3Client {
  if (!_s3) {
    const env = getEnv()
    _s3 = new S3Client({
      region: 'auto',
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return _s3
}

// GET /api/images/blog/123_photo.jpg → serve from R2
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
): Promise<NextResponse> {
  const { key } = await params
  const fileKey = key.join('/')

  try {
    const env = getEnv()
    const command = new GetObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: fileKey })
    const response = await getS3().send(command)

    const body = await response.Body?.transformToByteArray()
    if (!body) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(body as unknown as BodyInit, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
