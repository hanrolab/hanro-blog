'use client'

import { useState } from 'react'
import { BlogHeader } from '@/components/BlogHeader'
import { ProfileCard } from '@/components/ProfileCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { PostList } from '@/components/PostList'
import { SearchBar } from '@/components/SearchBar'

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  const handleSearch = (query: string) => {
    setSearchQuery(query || null)
  }

  return (
    <div className="min-h-screen bg-bg">
      <BlogHeader />

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden w-[200px] shrink-0 lg:block">
            <div className="sticky top-[80px] space-y-8">
              <ProfileCard />
              <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Profile + Category */}
            <div className="mb-6 lg:hidden">
              <ProfileCard />
              <div className="mt-4">
                <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
              </div>
            </div>

            {/* Search — right aligned */}
            <div className="mb-6 flex justify-end">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Post List */}
            <PostList category={selectedCategory} search={searchQuery} />
          </main>
        </div>
      </div>
    </div>
  )
}
