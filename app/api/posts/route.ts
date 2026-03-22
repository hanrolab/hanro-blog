import { NextRequest, NextResponse } from 'next/server'
import { queryD1 } from '@/lib/d1'
import { getIsAdmin } from '@/lib/auth'
import { createPostSchema } from '@/lib/validation'
import { sanitizeHtml } from '@/lib/sanitize'
import type { PostListItem } from '@/lib/types'

// GET /api/posts — paginated post list with optional category/search filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))
  const offset = (page - 1) * limit

  let whereClauses = 'WHERE published = 1'
  const params: unknown[] = []

  if (category) {
    whereClauses += ' AND category = ?'
    params.push(category)
  }

  if (search) {
    whereClauses += ' AND (title LIKE ? OR excerpt LIKE ?)'
    const term = `%${search}%`
    params.push(term, term)
  }

  const [countResult, posts] = await Promise.all([
    queryD1<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM posts ${whereClauses}`,
      params
    ),
    queryD1<PostListItem>(
      `SELECT id, title, slug, thumbnail, category, tags, published, views, excerpt, created_at FROM posts ${whereClauses} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
  ])
  const totalCount = countResult[0]?.cnt ?? 0

  const response = NextResponse.json({
    posts,
    totalCount,
    page,
    limit,
    hasMore: offset + posts.length < totalCount,
  })
  response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  return response
}

// POST /api/posts — create post (auth required)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { title, slug, content, thumbnail, category, tags, published } = parsed.data
  const sanitizedContent = sanitizeHtml(content)

  const excerpt = sanitizedContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)

  await queryD1(
    'INSERT INTO posts (title, slug, content, thumbnail, category, tags, published, excerpt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, slug, sanitizedContent, thumbnail ?? null, category ?? null, tags ?? null, published ? 1 : 0, excerpt]
  )

  return NextResponse.json({ success: true })
}
