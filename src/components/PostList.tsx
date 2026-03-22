'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { PostCard } from '@/components/PostCard'
import { Spinner } from '@/components/Spinner'
import type { PostListItem } from '@/lib/types'

interface PostListProps {
  category: string | null
  search?: string | null
}

export function PostList({ category, search }: PostListProps) {
  const [posts, setPosts] = useState<PostListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Reset when category/search changes
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(false)
    setLoading(true)
  }, [category, search])

  // Fetch posts
  useEffect(() => {
    const url = new URL('/api/posts', window.location.origin)
    if (category) url.searchParams.set('category', category)
    if (search) url.searchParams.set('search', search)
    url.searchParams.set('page', String(page))
    url.searchParams.set('limit', '12')

    const isFirstPage = page === 1
    if (!isFirstPage) setIsLoadingMore(true)

    fetch(url.toString(), { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const newPosts: PostListItem[] = data.posts ?? []
        setPosts((prev) => (isFirstPage ? newPosts : [...prev, ...newPosts]))
        setHasMore(data.hasMore ?? false)
      })
      .catch(() => {
        if (isFirstPage) setPosts([])
      })
      .finally(() => {
        setLoading(false)
        setIsLoadingMore(false)
      })
  }, [category, search, page])

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setPage((p) => p + 1)
    }
  }, [isLoadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-text-muted">
          {search ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
        </p>
        {!search && <p className="mt-1 text-sm text-text-muted">첫 번째 글을 작성해보세요!</p>}
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-border">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </>
  )
}
