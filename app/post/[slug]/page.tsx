import type { Metadata } from 'next'
import { PostDetail } from '@/views/PostDetail'
import { queryD1 } from '@/lib/d1'

interface PageProps {
  params: Promise<{ slug: string }>
}

interface PostMeta {
  title: string
  excerpt: string | null
  thumbnail: string | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const posts = await queryD1<PostMeta>(
    'SELECT title, excerpt, thumbnail FROM posts WHERE slug = ?',
    [slug]
  )
  const post = posts[0]

  if (!post) {
    return { title: '글을 찾을 수 없습니다 | 한로 블로그' }
  }

  return {
    title: `${post.title} | 한로 블로그`,
    description: post.excerpt ?? '',
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      type: 'article',
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? '',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  return <PostDetail slug={slug} />
}
