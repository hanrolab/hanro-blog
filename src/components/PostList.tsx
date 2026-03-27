'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostCard } from '@/components/PostCard'
import { Spinner } from '@/components/Spinner'
import type { PostListItem } from '@/lib/types'

interface PostListProps {
  category: string | null
  status?: string | null
}

const LIMIT = 5

interface PostsResponse {
  posts: PostListItem[]
  totalCount: number
  page: number
  limit: number
  hasMore: boolean
}

async function fetchPosts({ category, status, pageParam }: { category: string | null; status?: string | null; pageParam: number }): Promise<PostsResponse> {
  const url = new URL('/api/posts', window.location.origin)
  if (category) url.searchParams.set('category', category)
  if (status) url.searchParams.set('status', status)
  url.searchParams.set('page', String(pageParam))
  url.searchParams.set('limit', String(LIMIT))
  const res = await fetch(url.toString())
  return res.json()
}

export function PostList({ category, status }: PostListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', category, status],
    queryFn: ({ pageParam }) => fetchPosts({ category, status, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  })

  const posts = data?.pages.flatMap((p) => p.posts) ?? []

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '300px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-text-muted">아직 작성된 글이 없습니다.</p>
        <p className="mt-1 text-sm text-text-muted">첫 번째 글을 작성해보세요!</p>
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
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}
    </>
  )
}
