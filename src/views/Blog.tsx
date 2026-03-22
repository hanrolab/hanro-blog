'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { BlogHeader } from '@/components/BlogHeader'
import { ProfileCard, VisitCounter } from '@/components/ProfileCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { PostList } from '@/components/PostList'

export function Blog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedCategory = searchParams.get('category')

  const handleCategorySelect = useCallback((category: string | null) => {
    if (category) {
      router.replace(`/?category=${encodeURIComponent(category)}`, { scroll: false })
    } else {
      router.replace('/', { scroll: false })
    }
  }, [router])

  return (
    <div className="min-h-screen bg-bg">
      <BlogHeader />

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-[200px] shrink-0 lg:block">
            <div className="sticky top-[80px] space-y-6 pt-8">
              <ProfileCard />
              <CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />
              <VisitCounter />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 lg:hidden">
              <ProfileCard />
              <div className="mt-4">
                <CategoryFilter selected={selectedCategory} onSelect={handleCategorySelect} />
              </div>
            </div>

            <PostList category={selectedCategory} />
          </main>
        </div>
      </div>
    </div>
  )
}
