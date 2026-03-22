'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { DeviceMockup } from '@/components/DeviceMockup'

interface ProjectRowProps {
  readonly project: Project
  readonly index: number
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col lg:flex-row lg:gap-16 py-10 md:py-12 border-b border-border">
        {/* Left: Info */}
        <div className="flex-1 lg:max-w-[55%]">
          {/* Year + Status */}
          <div className="flex items-center gap-2 text-[13px] font-medium text-text-muted">
            <span>{project.year}</span>
            {(project.status === 'in-progress' || project.status === 'operating') && (
              <>
                <span>·</span>
                <span className={`flex items-center gap-1.5 ${project.status === 'operating' ? 'text-[#3182f6]' : 'text-green-600'}`}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${project.status === 'operating' ? 'bg-[#3182f6]' : 'bg-green-500'}`} />
                    <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${project.status === 'operating' ? 'bg-[#3182f6]' : 'bg-green-500'}`} />
                  </span>
                  {project.status === 'operating' ? '운영중' : '진행중'}
                </span>
              </>
            )}
          </div>

          {/* Title + Category */}
          <div className="mt-1 flex items-end gap-3">
            <h3 className="font-serif text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.08] text-text-primary">
              {project.title}
            </h3>
            <span
              className="mb-1 shrink-0 text-[12px] font-semibold tracking-[0.02em]"
              style={{ color: project.accent || '#555' }}
            >
              {project.category}
            </span>
          </div>

          {/* Subtitle */}
          <p className="mt-2 text-[17px] leading-[1.8] text-text-secondary">
            {project.subtitle}
          </p>

          {/* Tech stack by category */}
          <div className="mt-8 space-y-2 text-[15px]">
            {project.techDetail ? (
              <>
                {project.techDetail.frontend && (
                  <div className="flex gap-2">
                    <span className="w-[80px] shrink-0 font-semibold text-[#3B82F6]">Frontend</span>
                    <span className="text-text-secondary">{project.techDetail.frontend.join(', ')}</span>
                  </div>
                )}
                {project.techDetail.backend && (
                  <div className="flex gap-2">
                    <span className="w-[80px] shrink-0 font-semibold text-[#10B981]">Backend</span>
                    <span className="text-text-secondary">{project.techDetail.backend.join(', ')}</span>
                  </div>
                )}
                {project.techDetail.infra && (
                  <div className="flex gap-2">
                    <span className="w-[80px] shrink-0 font-semibold text-[#F59E0B]">Infra</span>
                    <span className="text-text-secondary">{project.techDetail.infra.join(', ')}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {project.techStack.slice(0, 6).map((tech) => (
                  <span key={tech} className="rounded-full border border-border px-4 py-1.5 text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          <div className="mt-10">
            <Link
              href={`/portfolio/projects/${project.id}`}
              className="inline-flex h-14 items-center gap-2 rounded-md bg-text-primary px-10 text-[14px] font-medium text-bg transition-opacity hover:opacity-80"
            >
              READ MORE
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Right: Device Mockup */}
        <div className="mt-10 flex items-center justify-center lg:mt-0 lg:flex-1">
          <DeviceMockup type={project.mockupType} title={project.title} accent={project.accent} images={project.images} noDeviceFrame={project.noDeviceFrame} />
        </div>
      </div>
    </motion.div>
  )
}
