import { NextRequest, NextResponse } from 'next/server'
import { queryD1 } from '@/lib/d1'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'

// GET /api/visits — visitor stats
export async function GET(): Promise<NextResponse> {
  const today = new Date().toISOString().split('T')[0]

  const todayResult = await queryD1<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM visits WHERE date = ?',
    [today]
  )

  const totalResult = await queryD1<{ cnt: number }>('SELECT COUNT(*) as cnt FROM visits')

  return NextResponse.json({
    today: todayResult[0]?.cnt ?? 0,
    total: totalResult[0]?.cnt ?? 0,
  })
}

// POST /api/visits — record visit (IP-based deduplication)
export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIp(request)
  const { allowed } = checkRateLimit(`visits:${ip}`, RATE_LIMITS.visits)
  if (!allowed) {
    return NextResponse.json({ success: true })
  }

  const today = new Date().toISOString().split('T')[0]

  try {
    await queryD1('INSERT OR IGNORE INTO visits (date, visitor_id) VALUES (?, ?)', [today, ip])
  } catch {
    // unique constraint — already recorded
  }

  return NextResponse.json({ success: true })
}
