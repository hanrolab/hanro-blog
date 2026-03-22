'use client'

import { useEffect, useState } from 'react'
import { BlogHeader } from '@/components/BlogHeader'
import { TableOfContents } from '@/components/TableOfContents'
import { AdminControls } from '@/components/AdminControls'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Post } from '@/lib/types'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

interface PostDetailProps {
  slug: string
}

const CATEGORY_COLORS: Record<string, string> = {
  '개발': '#3B82F6',
  '일상': '#10B981',
  '기술': '#8B5CF6',
  '회고': '#F59E0B',
}

function parseTags(tags: string | null): string[] {
  if (!tags) return []
  try {
    const parsed = JSON.parse(tags)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // not JSON, treat as comma-separated
  }
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function PostDetail({ slug }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  // Highlight code blocks + add copy buttons after content renders
  useEffect(() => {
    if (!post) return

    document.querySelectorAll('.post-content pre code').forEach((el) => {
      hljs.highlightElement(el as HTMLElement)
    })

    document.querySelectorAll('.post-content pre').forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'code-copy-btn'
      btn.textContent = 'Copy'
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent ?? ''
        await navigator.clipboard.writeText(code)
        btn.textContent = 'Copied!'
        setTimeout(() => {
          btn.textContent = 'Copy'
        }, 2000)
      })
      pre.appendChild(btn)
    })
  }, [post])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <BlogHeader />
        <div className="mx-auto max-w-[800px] px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded bg-bg-card" />
            <div className="h-4 w-1/3 rounded bg-bg-card" />
            <div className="mt-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 rounded bg-bg-card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg">
        <BlogHeader />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-lg text-text-muted">글을 찾을 수 없습니다.</p>
          <a href="/" className="mt-4 text-sm text-text-muted hover:text-text-primary transition-colors">
            ← 블로그로 돌아가기
          </a>
        </div>
      </div>
    )
  }

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const sanitizedContent = sanitizeHtml(post.content)
  const tags = parseTags(post.tags)

  return (
    <div className="min-h-screen bg-bg">
      <BlogHeader />

      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="flex gap-10">
          {/* Main Content */}
          <article className="min-w-0 flex-1 max-w-[760px]">
            {/* Header */}
            <header className="mb-10">
              {post.category && (
                <span
                  className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[post.category] || '#1a1a1a' }}
                >
                  {post.category}
                </span>
              )}
              <h1 className="mt-3 text-[2rem] font-bold leading-tight text-text-primary sm:text-[2.5rem]">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-2 text-[14px] text-text-muted">
                <span>한로</span>
                <span>·</span>
                <time>{date}</time>
                <span>·</span>
                <span>조회 {post.views}</span>
              </div>

              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-bg-card px-2.5 py-0.5 text-[11px] font-medium text-text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <AdminControls slug={slug} />
            </header>

            {/* Content */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>

          {/* Table of Contents */}
          <aside className="hidden w-[200px] shrink-0 xl:block">
            <div className="sticky top-[80px]">
              <TableOfContents content={sanitizedContent} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
