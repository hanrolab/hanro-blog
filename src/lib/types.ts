export interface Post {
  id: number
  title: string
  slug: string
  content: string
  thumbnail: string | null
  category: string | null
  tags: string | null
  published: number
  views: number
  excerpt: string | null
  created_at: string
  updated_at: string
}

export interface PostListItem {
  id: number
  title: string
  slug: string
  thumbnail: string | null
  category: string | null
  tags: string | null
  published: number
  views: number
  excerpt: string | null
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  color: string
}

export interface VisitStats {
  today: number
  total: number
}

export interface PaginatedResponse<T> {
  posts: T[]
  totalCount: number
  page: number
  limit: number
  hasMore: boolean
}
