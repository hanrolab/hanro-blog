'use client'

import { useMemo, useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  const headings = useMemo(() => {
    const items: TocItem[] = []
    const regex = /<h([12])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[12]>/gi
    let match

    const usedIds = new Set<string>()
    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1])
      const text = match[3].replace(/<[^>]*>/g, '').trim()
      let id = match[2] || text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `heading-${items.length}`
      // Deduplicate IDs
      if (usedIds.has(id)) {
        let i = 2
        while (usedIds.has(`${id}-${i}`)) i++
        id = `${id}-${i}`
      }
      usedIds.add(id)
      items.push({ id, text, level })
    }

    return items
  }, [content])

  // IntersectionObserver for active heading
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    // Add IDs to headings in the DOM if missing
    const postContent = document.querySelector('.post-content')
    if (postContent) {
      const domHeadings = postContent.querySelectorAll('h1, h2')
      domHeadings.forEach((el) => {
        if (!el.id) {
          el.id = el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
        }
        observer.observe(el)
      })
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-1">
      <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-text-muted">
        목차
      </p>
      {headings.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`block text-[13px] leading-relaxed transition-colors ${
            item.level === 2 ? 'pl-3' : ''
          } ${
            activeId === item.id
              ? 'text-text-primary font-medium'
              : 'text-text-muted hover:text-text-primary'
          }`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
