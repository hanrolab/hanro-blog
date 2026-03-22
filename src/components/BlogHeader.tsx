'use client'

import { useAuth } from '@/lib/useAuth'
import { PenLine, LogOut } from 'lucide-react'
import Link from 'next/link'

export function BlogHeader() {
  const { isAdmin, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg will-change-transform">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
        <Link href="/" className="text-[1.125rem] font-bold tracking-tight text-text-primary">
          Hanro Blog
        </Link>

        {!isLoading && isAdmin && (
          <div className="flex items-center gap-2">
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
