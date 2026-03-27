import Link from 'next/link'
import Image from 'next/image'
import type { PostListItem } from '@/lib/types'

interface PostCardProps {
  post: PostListItem
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const isDraft = !post.published

  // With thumbnail
  if (post.thumbnail) {
    return (
      <Link href={`/post/${post.slug}`} className="group block py-10">
        <article>
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-bg-card shadow-sm transition-shadow duration-300 group-hover:shadow-md">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
          <div className="mt-5">
            <h2 className="text-[1.375rem] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
              {isDraft && <span className="mr-2 inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-700">비공개</span>}
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-2.5 text-[0.9375rem] leading-[1.8] text-text-secondary line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <time className="mt-4 block text-[0.8125rem] text-text-muted">{date}</time>
          </div>
        </article>
      </Link>
    )
  }

  // Without thumbnail
  return (
    <Link href={`/post/${post.slug}`} className="group block py-10">
      <article>
        <h2 className="text-[1.375rem] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent">
          {isDraft && <span className="mr-2 inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-700">비공개</span>}
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-2.5 text-[0.9375rem] leading-[1.8] text-text-secondary line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <time className="mt-4 block text-[0.8125rem] text-text-muted">{date}</time>
      </article>
    </Link>
  )
}
