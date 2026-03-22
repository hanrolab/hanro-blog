import { NextRequest, NextResponse } from 'next/server'
import { queryD1 } from '@/lib/d1'
import { getIsAdmin } from '@/lib/auth'
import { updatePostSchema, slugParamSchema } from '@/lib/validation'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Post } from '@/lib/types'

// GET /api/posts/[slug] — post detail + increment views
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params

  if (!slugParamSchema.safeParse(slug).success) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const posts = await queryD1<Post>('SELECT * FROM posts WHERE slug = ?', [slug])

  if (posts.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await queryD1('UPDATE posts SET views = views + 1 WHERE slug = ?', [slug])

  const response = NextResponse.json({ post: { ...posts[0], views: (posts[0].views || 0) + 1 } })
  response.headers.set('Cache-Control', 'public, max-age=300')
  return response
}

// PUT /api/posts/[slug] — update post (auth required)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  if (!slugParamSchema.safeParse(slug).success) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const body = await request.json()
  const parsed = updatePostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { title, content, thumbnail, category, tags, published } = parsed.data
  const sanitizedContent = sanitizeHtml(content)

  const excerpt = sanitizedContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)

  await queryD1(
    "UPDATE posts SET title = ?, content = ?, thumbnail = ?, category = ?, tags = ?, published = ?, excerpt = ?, updated_at = datetime('now') WHERE slug = ?",
    [title, sanitizedContent, thumbnail ?? null, category ?? null, tags ?? null, published ? 1 : 0, excerpt, slug]
  )

  return NextResponse.json({ success: true })
}

// DELETE /api/posts/[slug] — delete post (auth required)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  if (!slugParamSchema.safeParse(slug).success) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  await queryD1('DELETE FROM posts WHERE slug = ?', [slug])

  return NextResponse.json({ success: true })
}
