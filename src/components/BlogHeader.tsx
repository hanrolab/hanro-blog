'use client'

import { useAuth } from '@/lib/useAuth'
import { useQuery } from '@tanstack/react-query'
import { PenLine, LogOut, EyeOff } from 'lucide-react'
import Link from 'next/link'

export function BlogHeader() {
  const { isAdmin, isLoading, logout } = useAuth()

  const { data: draftData } = useQuery({
    queryKey: ['drafts-count'],
    queryFn: async () => {
      const res = await fetch('/api/posts?status=draft&limit=1')
      return res.json() as Promise<{ totalCount: number }>
    },
    enabled: isAdmin,
  })

  const draftCount = draftData?.totalCount ?? 0

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg will-change-transform">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
        <Link href="/" className="text-[1.125rem] font-bold tracking-tight text-text-primary">
          Hanro Blog
        </Link>

        {!isLoading && isAdmin && (
          <div className="flex items-center gap-2">
            <Link
              href="/?status=draft"
              className="relative flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[0.8125rem] font-medium text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
            >
              <EyeOff size={14} />
              비공개
              {draftCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-500 px-1 text-[0.625rem] font-bold text-white">
                  {draftCount}
                </span>
              )}
            </Link>
            <Link
              href="/write"
              className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[0.8125rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <PenLine size={14} />
              새 글
            </Link>
            <button
              onClick={logout}
              className="flex items-center justify-center rounded-full p-2 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
              title="로그아웃"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
