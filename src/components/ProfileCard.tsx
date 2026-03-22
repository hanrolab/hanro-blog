'use client'

import { useEffect, useState } from 'react'
import { Github, Mail } from 'lucide-react'
import type { VisitStats } from '@/lib/types'

export function ProfileCard() {
  const [visits, setVisits] = useState<VisitStats>({ today: 0, total: 0 })

  useEffect(() => {
    // Record visit (IP-based deduplication on server)
    fetch('/api/visits', { method: 'POST' }).catch(() => {})

    // Fetch stats
    fetch('/api/visits')
      .then((res) => res.json())
      .then(setVisits)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="h-24 w-24 rounded-full bg-bg-card flex items-center justify-center text-3xl">
          🧑‍💻
        </div>
        <h2 className="mt-3 text-lg font-bold text-text-primary">한로</h2>
        <p className="mt-1 text-sm text-text-muted leading-relaxed">
          풀스택 개발자<br />
          배움을 기록합니다
        </p>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-3">
        <a
          href="https://github.com/jinsungjoo"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
        >
          <Github size={18} />
        </a>
        <a
          href="mailto:hanro@example.com"
          className="flex items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
        >
          <Mail size={18} />
        </a>
      </div>

      {/* Visit Counter */}
      <div className="rounded-xl bg-bg-card p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-text-muted">오늘</p>
            <p className="mt-0.5 text-lg font-bold text-text-primary">{visits.today}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">전체</p>
            <p className="mt-0.5 text-lg font-bold text-text-primary">{visits.total}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
