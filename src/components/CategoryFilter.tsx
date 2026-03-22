'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'
import { useToast } from '@/lib/useToast'
import type { Category } from '@/lib/types'

interface CategoryWithCount extends Category {
  postCount: number
}

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isAdmin } = useAuth()
  const { showToast } = useToast()

  const fetchCategories = () => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories ?? [])
        setTotalCount(data.totalCount ?? 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    if (res.ok) {
      setNewName('')
      setAdding(false)
      fetchCategories()
      showToast(`'${name}' 카테고리가 추가되었습니다.`)
    } else {
      const data = await res.json()
      showToast(data.error ?? '추가 실패', 'error')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    } else if (e.key === 'Escape') {
      setAdding(false)
      setNewName('')
    }
  }

  const handleDelete = async (cat: CategoryWithCount) => {
    if (!window.confirm(`'${cat.name}' 카테고리를 삭제하시겠습니까?`)) return

    const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })

    if (res.ok) {
      if (selected === cat.name) onSelect(null)
      fetchCategories()
      showToast(`'${cat.name}' 카테고리가 삭제되었습니다.`)
    } else {
      const data = await res.json()
      showToast(data.error ?? '삭제 실패', 'error')
    }
  }

  return (
    <div>
      <h3 className="text-[0.9375rem] font-bold text-text-primary">카테고리</h3>
      <div className="mt-2 h-px bg-border" />

      <ul className="mt-3 space-y-1">
        {/* All */}
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full rounded-md px-2 py-1.5 text-left text-[0.875rem] transition-colors ${
              selected === null
                ? 'font-semibold text-[#12b886]'
                : 'text-text-secondary hover:bg-bg-card'
            }`}
          >
            전체보기{' '}
            <span className="text-text-muted">({totalCount})</span>
          </button>
        </li>

        {/* Category items */}
        {categories.map((cat) => (
          <li key={cat.id} className="group flex items-center">
            <button
              onClick={() => onSelect(cat.name === selected ? null : cat.name)}
              className={`flex-1 rounded-md px-2 py-1.5 text-left text-[0.875rem] transition-colors ${
                selected === cat.name
                  ? 'font-semibold text-[#12b886]'
                  : 'text-text-secondary hover:bg-bg-card'
              }`}
            >
              {cat.name}{' '}
              <span className="text-text-muted">({cat.postCount})</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleDelete(cat)}
                className="mr-1 hidden rounded p-1 text-text-muted opacity-0 transition-all hover:bg-bg-card hover:text-red-500 group-hover:opacity-100 sm:block"
                title="삭제"
              >
                <X size={14} />
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Admin: Add category */}
      {isAdmin && (
        <div className="mt-3">
          {adding ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!newName.trim()) {
                    setAdding(false)
                  }
                }}
                placeholder="카테고리 이름"
                className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2.5 py-1.5 text-[0.8125rem] text-text-primary outline-none placeholder:text-text-muted/50 focus:border-text-muted"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setAdding(true)
                setTimeout(() => inputRef.current?.focus(), 0)
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[0.8125rem] text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <Plus size={14} />
              카테고리 추가
            </button>
          )}
        </div>
      )}
    </div>
  )
}
