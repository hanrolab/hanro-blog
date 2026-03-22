'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { Pencil, Trash2 } from 'lucide-react'

interface AdminControlsProps {
  slug: string
}

export function AdminControls({ slug }: AdminControlsProps) {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading || !isAdmin) return null

  const handleDelete = async () => {
    if (!confirm('정말 이 글을 삭제하시겠습니까?')) return

    const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/')
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={() => router.push(`/edit/${slug}`)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] text-text-muted transition-colors hover:border-text-primary hover:text-text-primary"
      >
        <Pencil size={13} />
        수정
      </button>
      <button
        onClick={handleDelete}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[13px] text-red-500 transition-colors hover:border-red-500 hover:bg-red-50"
      >
        <Trash2 size={13} />
        삭제
      </button>
    </div>
  )
}
