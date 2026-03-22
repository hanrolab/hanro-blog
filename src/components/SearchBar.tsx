'use client'

import { useRef, useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { Spinner } from '@/components/Spinner'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [searching, setSearching] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timerRef.current)
      setSearching(true)
      const query = e.target.value
      timerRef.current = setTimeout(() => {
        onSearch(query)
        setSearching(false)
      }, 300)
    },
    [onSearch]
  )

  return (
    <div className="relative w-[220px]">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        onChange={handleChange}
        placeholder="검색어를 입력하세요"
        className="w-full rounded-xl border border-border bg-bg-card/40 py-2 pl-9 pr-9 text-[0.8125rem] text-text-primary outline-none transition-all placeholder:text-text-muted/60 focus:border-accent/30 focus:bg-bg focus:shadow-sm"
      />
      {searching && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  )
}
