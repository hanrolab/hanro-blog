import Link from 'next/link'
import Image from 'next/image'
import type { PostListItem } from '@/lib/types'

interface PostCardProps {
  post: PostListItem
}

function parseTags(tags: string | null): string[] {
  if (!tags) return []
  try {
    const parsed = JSON.parse(tags)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // not JSON, treat as comma-separated
  }
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function PostMeta({ date, views }: { date: string; views: number }) {
  return (
    <div className="flex items-center gap-1.5 text-[0.8125rem] text-text-muted">
      <time>{date}</time>
      {views > 0 && (
        <>
          <span className="text-border">·</span>
          <span>{views}개의 조회</span>
        </>
      )}
    </div>
  )
}

function PostTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="text-[0.8125rem] text-[#12b886]">
          {tag}
        </span>
      ))}
    </div>
  )
}

export function PostCard({ post }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const tags = parseTags(post.tags)

  // With thumbnail — image on top, content below
  if (post.thumbnail) {
    return (
      <Link href={`/post/${post.slug}`} className="group block py-8">
        <article className="transition-transform duration-200 hover:-translate-y-1">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-bg-card">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>

          <div className="mt-4 space-y-2">
            <h2 className="text-[1.25rem] font-bold leading-snug text-text-primary sm:text-[1.5rem]">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-[0.9375rem] leading-relaxed text-text-muted line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <PostTags tags={tags} />
            <PostMeta date={date} views={post.views} />
          </div>
        </article>
      </Link>
    )
  }

  // Without thumbnail — clean text-only (Velog style)
  return (
    <Link href={`/post/${post.slug}`} className="group block py-10">
      <article>
        <h2 className="text-[1.25rem] font-bold leading-snug text-text-primary sm:text-[1.5rem]">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="mt-3 text-[0.9375rem] leading-[1.8] text-text-secondary line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4">
          <PostTags tags={tags} />
        </div>
        <div className="mt-3">
          <PostMeta date={date} views={post.views} />
        </div>
      </article>
    </Link>
  )
}
