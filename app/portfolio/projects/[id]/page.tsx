'use client'

import { use } from 'react'
import { ProjectDetail } from '@/views/ProjectDetail'

export default function ProjectDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="flex-1">
      <ProjectDetail id={id} />
    </div>
  )
}
