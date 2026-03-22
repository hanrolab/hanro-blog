'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/')
      } else {
        setError('비밀번호가 올바르지 않습니다.')
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">로그인</h1>
          <p className="mt-2 text-sm text-text-muted">관리자 비밀번호를 입력하세요</p>
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-text-primary outline-none transition-colors focus:border-text-primary"
            autoFocus
          />
        </div>

        {error && (
          <p className="text-center text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg bg-text-primary py-3 text-sm font-medium text-bg transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div className="text-center">
          <a href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">
            ← 블로그로 돌아가기
          </a>
        </div>
      </form>
    </main>
  )
}
