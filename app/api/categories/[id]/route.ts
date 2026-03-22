import { NextRequest, NextResponse } from 'next/server'
import { queryD1 } from '@/lib/d1'
import { getIsAdmin } from '@/lib/auth'

// DELETE /api/categories/[id] — delete category (admin only, blocked if in use)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const isAdmin = await getIsAdmin()
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const categoryId = parseInt(id, 10)
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
  }

  // Get category name to check usage
  const categories = await queryD1<{ name: string }>(
    'SELECT name FROM categories WHERE id = ?',
    [categoryId]
  )
  if (categories.length === 0) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  // Check if any published posts use this category
  const usage = await queryD1<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM posts WHERE category = ? AND published = 1',
    [categories[0].name]
  )
  if ((usage[0]?.cnt ?? 0) > 0) {
    return NextResponse.json(
      { error: `이 카테고리를 사용 중인 글이 ${usage[0].cnt}개 있어 삭제할 수 없습니다.` },
      { status: 409 }
    )
  }

  await queryD1('DELETE FROM categories WHERE id = ?', [categoryId])

  return NextResponse.json({ success: true })
}
