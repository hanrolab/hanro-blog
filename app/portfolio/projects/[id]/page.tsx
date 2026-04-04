'use client'

import { use } from 'react'
import { ProjectDetail } from '@/views/ProjectDetail'
import { ReadipShowcase } from '@/views/ReadipShowcase'

export default function ProjectDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = use(params)

  if (id === 'readip') {
    return (
      <div className="flex-1">
        <ReadipShowcase />
      </div>
    )
  }

  return (
    <div className="flex-1">
      <ProjectDetail id={id} />
    </div>
  )
}
