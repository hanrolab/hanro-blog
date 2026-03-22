'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { WriteView } from '@/views/WriteView'
import { BlogHeader } from '@/components/BlogHeader'
import type { Post } from '@/lib/types'

export default function EditPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data.post))
      .catch(() => setPost(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <BlogHeader />
        <div className="mx-auto max-w-[800px] px-6 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-3/4 rounded bg-bg-card" />
            <div className="h-px bg-border" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 rounded bg-bg-card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bg">
        <BlogHeader />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-lg text-text-muted">글을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return <WriteView editMode initialPost={post} />
}
