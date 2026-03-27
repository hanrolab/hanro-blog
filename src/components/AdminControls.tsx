'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/useAuth'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface AdminControlsProps {
  slug: string
  published?: number
}

export function AdminControls({ slug, published = 1 }: AdminControlsProps) {
  const { isAdmin, isLoading } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPublished, setIsPublished] = useState(published === 1)
  const [toggling, setToggling] = useState(false)

  if (isLoading || !isAdmin) return null

  const handleTogglePublish = async () => {
    setToggling(true)
    const newPublished = !isPublished
    const res = await fetch(`/api/posts/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: newPublished }),
    })
    if (res.ok) {
      setIsPublished(newPublished)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['drafts-count'] })
      toast.success(newPublished ? '공개로 전환했습니다.' : '비공개로 전환했습니다.')
    } else {
      toast.error('상태 변경에 실패했습니다.')
    }
    setToggling(false)
  }

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
        onClick={handleTogglePublish}
        disabled={toggling}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
          isPublished
            ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
            : 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
        } disabled:opacity-50`}
      >
        {isPublished ? <Eye size={13} /> : <EyeOff size={13} />}
        {isPublished ? '공개' : '비공개'}
      </button>
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
