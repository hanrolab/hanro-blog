'use client'

import { useAuth } from '@/lib/useAuth'
import { PenLine, LogOut, LogIn } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function BlogHeader() {
  const { isAdmin, isLoading, logout } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-text-primary">
          한로
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors ${
              pathname === '/' ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            블로그
          </Link>
          <Link
            href="/portfolio"
            className={`text-sm transition-colors ${
              pathname.startsWith('/portfolio') ? 'text-text-primary font-medium' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            포트폴리오
          </Link>

          {!isLoading && (
            <>
              {isAdmin ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/write"
                    className="flex items-center gap-1.5 rounded-lg bg-text-primary px-3.5 py-1.5 text-[13px] font-medium text-bg transition-opacity hover:opacity-80"
                  >
                    <PenLine size={14} />
                    새 글 작성
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center rounded-lg p-1.5 text-text-muted transition-colors hover:text-text-primary"
                    title="로그아웃"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-lg p-1.5 text-text-muted transition-colors hover:text-text-primary"
                  title="로그인"
                >
                  <LogIn size={16} />
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
