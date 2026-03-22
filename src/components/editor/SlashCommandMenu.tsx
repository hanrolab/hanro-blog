'use client'

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import type { SlashCommandItem } from './slashCommands'

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export function SlashCommandMenu({ items, command }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  useLayoutEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % items.length)
        return true
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
        return true
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        if (items[selectedIndex]) command(items[selectedIndex])
        return true
      }
      return false
    },
    [items, selectedIndex, command],
  )

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__slashMenuKeyDown = onKeyDown
    return () => {
      delete (window as unknown as Record<string, unknown>).__slashMenuKeyDown
    }
  }, [onKeyDown])

  if (!items.length) {
    return (
      <div className="rounded-xl border border-border bg-bg p-4 text-sm text-text-muted shadow-lg">
        결과 없음
      </div>
    )
  }

  // Group by category
  const grouped: { category: string; items: { item: SlashCommandItem; globalIndex: number }[] }[] = []
  let currentCategory = ''
  items.forEach((item, i) => {
    if (item.category !== currentCategory) {
      currentCategory = item.category
      grouped.push({ category: currentCategory, items: [] })
    }
    grouped[grouped.length - 1].items.push({ item, globalIndex: i })
  })

  return (
    <div className="slash-menu max-h-[420px] w-full max-w-[480px] overflow-y-auto rounded-xl border border-border bg-bg py-1.5 shadow-xl">
      {grouped.map((group) => (
        <div key={group.category}>
          <div className="px-3 pb-1 pt-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70">
              {group.category}
            </span>
          </div>
          <div className="px-1.5">
            {group.items.map(({ item, globalIndex }) => (
              <button
                key={item.label}
                ref={(el) => { itemRefs.current[globalIndex] = el }}
                className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                  globalIndex === selectedIndex
                    ? 'bg-bg-card text-text-primary'
                    : 'text-text-secondary hover:bg-bg-card/50'
                }`}
                onClick={() => command(item)}
                onMouseEnter={() => setSelectedIndex(globalIndex)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-card border border-border/50">
                  <item.icon size={16} strokeWidth={2} className="text-text-muted" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium leading-tight">{item.label}</div>
                  <div className="mt-0.5 truncate text-[11px] leading-tight text-text-muted">
                    {item.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
