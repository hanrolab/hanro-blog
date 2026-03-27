'use client'

import { useEffect, useState, useCallback } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ contentReady }: { readonly contentReady?: boolean }) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  const buildToc = useCallback(() => {
    const postContent = document.querySelector('.post-content')
    if (!postContent) return null

    const domHeadings = postContent.querySelectorAll('h1, h2, h3')
    if (domHeadings.length === 0) return null

    const items: TocItem[] = []
    const usedIds = new Set<string>()

    domHeadings.forEach((el, index) => {
      const level = parseInt(el.tagName[1])
      const text = el.textContent?.trim() || ''
      let id =
        text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w가-힣-]/g, '') || `heading-${index}`

      if (usedIds.has(id)) {
        let i = 2
        while (usedIds.has(`${id}-${i}`)) i++
        id = `${id}-${i}`
      }
      usedIds.add(id)
      el.id = id
      items.push({ id, text, level })
    })

    return { items, domHeadings }
  }, [])

  useEffect(() => {
    const result = buildToc()
    if (!result) return

    setHeadings(result.items)

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

    result.domHeadings.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [contentReady, buildToc])

  if (headings.length === 0) return null

  return (
    <nav className="relative border-l-2 border-border pl-4">
      {headings.map((item) => {
        const isActive = activeId === item.id
        return (
          <div key={item.id} className="relative">
            {isActive && (
              <div className="absolute -left-[calc(1rem+2px)] top-0 h-full w-[2px] bg-text-primary" />
            )}
            <a
              href={`#${item.id}`}
              className={`block truncate text-[0.8125rem] leading-7 transition-colors ${
                item.level === 2 ? 'pl-3' : item.level === 3 ? 'pl-6' : ''
              } ${
                isActive
                  ? 'font-medium text-text-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              title={item.text}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.text}
            </a>
          </div>
        )
      })}
    </nav>
  )
}
