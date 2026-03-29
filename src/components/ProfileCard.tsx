'use client'

import { useEffect, useState } from 'react'
import { Github, Instagram, Linkedin } from 'lucide-react'
import type { VisitStats } from '@/lib/types'

export function ProfileCard() {
  useEffect(() => {
    fetch('/api/visits', { method: 'POST' }).catch(() => {})
  }, [])

  return (
    <div className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <img
          src="https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/profile.jpeg"
          alt="주진성"
          className="h-36 w-36 rounded-full object-cover"
        />
        <h2 className="mt-4 text-[1.25rem] font-bold text-text-primary">주진성</h2>
        <p className="text-[0.8125rem] text-text-muted">1995.10.17</p>
        <p className="mt-1 text-[1rem] text-text-secondary leading-relaxed">
          배움을 기록합니다
        </p>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-2">
        <a
          href="https://github.com/Joojinsung1017"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-bg-card p-2.5 text-[#24292e] transition-opacity hover:opacity-70"
          title="GitHub"
        >
          <Github size={22} />
        </a>
        <a
          href="https://www.instagram.com/j_m101707/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-bg-card p-2.5 text-[#E1306C] transition-opacity hover:opacity-70"
          title="Instagram"
        >
          <Instagram size={22} />
        </a>
        <a
          href="https://www.linkedin.com/in/dev-jinsung"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-bg-card p-2.5 text-[#0A66C2] transition-opacity hover:opacity-70"
          title="LinkedIn"
        >
          <Linkedin size={22} />
        </a>
      </div>

      {/* Email */}
      <p className="text-center text-[0.8125rem] text-text-muted">
        dev.jinsung1017@gmail.com
      </p>
    </div>
  )
}

export function VisitCounter() {
  const [visits, setVisits] = useState<VisitStats>({ today: 0, total: 0 })

  useEffect(() => {
    fetch('/api/visits')
      .then((res) => res.json())
      .then(setVisits)
      .catch(() => {})
  }, [])

  return (
    <div className="rounded-2xl bg-bg-card/60 px-5 py-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-wider text-text-muted">오늘</p>
          <p className="mt-1 text-[1.25rem] font-bold tabular-nums text-text-primary">{visits.today}</p>
        </div>
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-wider text-text-muted">전체</p>
          <p className="mt-1 text-[1.25rem] font-bold tabular-nums text-text-primary">{visits.total}</p>
        </div>
      </div>
    </div>
  )
}
