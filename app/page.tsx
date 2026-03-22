import { Suspense } from 'react'
import { Blog } from '@/views/Blog'

export default function BlogPage() {
  return (
    <Suspense>
      <Blog />
    </Suspense>
  )
}
