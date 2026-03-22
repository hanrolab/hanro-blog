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
  '개발': '#3182f6',
  '일상': '#20c997',
  '기술': '#845ef7',
  '회고': '#fab005',
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

  return (
    <div className="min-h-screen bg-bg">
      <BlogHeader />

      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="flex gap-0">
          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Header */}
            <header className="mb-12">
              {post.category && (
                <span
                  className="inline-block rounded-full px-3 py-1 text-[0.75rem] font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[post.category] || '#3182f6' }}
                >
                  {post.category}
                </span>
              )}
              <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.3] tracking-tight text-text-primary sm:text-[2.5rem]">
                {post.title}
              </h1>
              <div className="mt-5 flex items-center gap-2 text-[0.875rem] text-text-muted">
                <span className="font-medium text-text-secondary">한로</span>
                <span>·</span>
                <time>{date}</time>
              </div>

              <AdminControls slug={slug} />
            </header>

            {/* Content */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>

          {/* TOC — sticky sidebar */}
          <aside className="hidden w-[200px] shrink-0 pl-10 xl:block">
            <div className="sticky top-[80px]">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
