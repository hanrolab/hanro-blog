'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'
import { BlogHeader } from '@/components/BlogHeader'
import { TableOfContents } from '@/components/TableOfContents'
import { AdminControls } from '@/components/AdminControls'
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
  const [mobileTocOpen, setMobileTocOpen] = useState(false)

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

    // Wrap tables in scrollable container for mobile
    document.querySelectorAll('.post-content table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-scroll-wrapper')) return
      const wrapper = document.createElement('div')
      wrapper.className = 'table-scroll-wrapper'
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
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
  return (
    <div className="min-h-screen bg-bg">
      <BlogHeader />

      <div className="mx-auto max-w-[1280px] px-6 py-12">
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

              <AdminControls slug={slug} published={post.published} />
            </header>

            {/* Content */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* TOC — sticky sidebar */}
          <aside className="hidden w-[160px] shrink-0 pl-4 xl:block">
            <div className="sticky top-[80px] max-h-[calc(100vh-120px)] overflow-y-auto">
              <TableOfContents contentReady={!!post} />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile TOC FAB */}
      <button
        onClick={() => setMobileTocOpen(!mobileTocOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-text-primary text-bg shadow-lg xl:hidden"
        aria-label="Table of Contents"
      >
        <List className="h-5 w-5" />
      </button>

      {/* Mobile TOC Overlay */}
      {mobileTocOpen && (
        <div className="fixed inset-0 z-30 xl:hidden" onClick={() => setMobileTocOpen(false)}>
          <div
            className="absolute bottom-20 right-4 w-64 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-bg p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-[0.75rem] font-semibold tracking-wider text-text-muted">ON THIS PAGE</p>
            <TableOfContents contentReady={!!post} onNavigate={() => setMobileTocOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
