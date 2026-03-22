'use client'

import { useState, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/useAuth'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

interface CategoryWithCount extends Category {
  postCount: number
}

interface CategoriesResponse {
  categories: CategoryWithCount[]
  totalCount: number
}

interface CategoryFilterProps {
  selected: string | null
  onSelect: (category: string | null) => void
}

async function fetchCategories(): Promise<CategoriesResponse> {
  const res = await fetch('/api/categories')
  return res.json()
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const categories = data?.categories ?? []
  const totalCount = data?.totalCount ?? 0

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  }

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
      invalidate()
      toast.success(`'${name}' 카테고리가 추가되었습니다.`)
    } else {
      const d = await res.json()
      toast.error(d.error ?? '추가 실패')
    }
  }

  const handleDelete = async (cat: CategoryWithCount) => {
    if (!window.confirm(`'${cat.name}' 카테고리를 삭제하시겠습니까?`)) return
    const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
    if (res.ok) {
      if (selected === cat.name) onSelect(null)
      invalidate()
      toast.success(`'${cat.name}' 카테고리가 삭제되었습니다.`)
    } else {
      const d = await res.json()
      toast.error(d.error ?? '삭제 실패')
    }
  }

  return (
    <div>
      <h3 className="text-[0.9375rem] font-bold text-text-primary">카테고리</h3>
      <div className="mt-2 h-px bg-border" />

      <ul className="mt-3 space-y-1">
        <li>
          <button
            onClick={() => { onSelect(null); window.scrollTo(0, 0) }}
            className={`w-full rounded-md px-2 py-1.5 text-left text-[0.875rem] transition-colors ${
              selected === null
                ? 'font-semibold text-[#12b886]'
                : 'text-text-secondary hover:bg-bg-card'
            }`}
          >
            전체보기 <span className="text-text-muted">({totalCount})</span>
          </button>
        </li>

        {categories.map((cat) => (
          <li key={cat.id} className="group flex items-center">
            <button
              onClick={() => { onSelect(cat.name === selected ? null : cat.name); window.scrollTo(0, 0) }}
              className={`flex-1 rounded-md px-2 py-1.5 text-left text-[0.875rem] transition-colors ${
                selected === cat.name
                  ? 'font-semibold text-[#12b886]'
                  : 'text-text-secondary hover:bg-bg-card'
              }`}
            >
              {cat.name} <span className="text-text-muted">({cat.postCount})</span>
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

      {isAdmin && (
        <div className="mt-3">
          {adding ? (
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
                if (e.key === 'Escape') { setAdding(false); setNewName('') }
              }}
              onBlur={() => { if (!newName.trim()) setAdding(false) }}
              placeholder="카테고리 이름"
              className="min-w-0 w-full rounded-md border border-border bg-bg px-2.5 py-1.5 text-[0.8125rem] text-text-primary outline-none placeholder:text-text-muted/50 focus:border-text-muted"
              autoFocus
            />
          ) : (
            <button
              onClick={() => { setAdding(true); setTimeout(() => inputRef.current?.focus(), 0) }}
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
