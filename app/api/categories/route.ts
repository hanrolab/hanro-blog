import { NextRequest, NextResponse } from 'next/server'
import { queryD1 } from '@/lib/d1'
import { getIsAdmin } from '@/lib/auth'
import type { Category } from '@/lib/types'

// GET /api/categories — list with post counts
export async function GET(): Promise<NextResponse> {
  const categories = await queryD1<Category & { postCount: number }>(
    `SELECT c.*, COALESCE(p.cnt, 0) as postCount
     FROM categories c
     LEFT JOIN (SELECT category, COUNT(*) as cnt FROM posts WHERE published = 1 GROUP BY category) p
     ON c.name = p.category
     ORDER BY c.id`
  )

  const totalResult = await queryD1<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM posts WHERE published = 1'
  )

  const response = NextResponse.json({
    categories,
    totalCount: totalResult[0]?.cnt ?? 0,
  })
  response.headers.set('Cache-Control', 'no-cache')
  return response
}

// POST /api/categories — create category (admin only)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await request.json()
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
  }

  const trimmed = name.trim()
  const slug = trimmed
    .toLowerCase()
    .replace(/[가-힣]+/g, (match) => match)
    .replace(/\s+/g, '-')
    .replace(/[^\w가-힣-]/g, '')

  // Check duplicate
  const existing = await queryD1<Category>(
    'SELECT id FROM categories WHERE name = ?',
    [trimmed]
  )
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
  }

  // Random color from a nice palette
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']
  const color = colors[Math.floor(Math.random() * colors.length)]

  await queryD1(
    'INSERT INTO categories (name, slug, color) VALUES (?, ?, ?)',
    [trimmed, slug, color]
  )

  return NextResponse.json({ success: true })
}
