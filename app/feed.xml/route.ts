import { queryD1 } from '@/lib/d1'

interface FeedPost {
  title: string
  slug: string
  excerpt: string | null
  created_at: string
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const posts = await queryD1<FeedPost>(
    'SELECT title, slug, excerpt, created_at FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 20'
  )

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://hanro.blog/post/${p.slug}</link>
      <description>${escapeXml(p.excerpt ?? '')}</description>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <guid>https://hanro.blog/post/${p.slug}</guid>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>한로 블로그</title>
    <link>https://hanro.blog</link>
    <description>한로의 개발 블로그 — 배움을 기록합니다</description>
    <language>ko</language>
    <atom:link href="https://hanro.blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
