'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  readonly project: Project
  readonly index: number
  readonly variant?: 'large' | 'default'
}

export function ProjectCard({ project, index, variant = 'default' }: ProjectCardProps) {
  const isLarge = variant === 'large'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0, 1] }}
      className={isLarge ? 'sm:col-span-2' : ''}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group relative block overflow-hidden border border-border bg-bg-card transition-colors duration-500 hover:bg-bg-card-hover"
      >
        <div className={`p-8 ${isLarge ? 'md:p-16' : 'md:p-12'}`}>
          {/* Category + Year */}
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <span className="text-xs tracking-[0.25em] text-text-muted">
              {project.category}
            </span>
            <span className="text-xs tracking-[0.15em] text-text-muted">
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-serif leading-[0.95] tracking-tight text-text-primary ${
              isLarge ? 'text-4xl sm:text-6xl md:text-8xl' : 'text-3xl sm:text-4xl md:text-5xl'
            }`}
          >
            {project.title}
          </h3>

          {/* Subtitle */}
          <p className={`mt-4 text-text-secondary md:mt-5 ${isLarge ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
            {project.subtitle}
          </p>

          {/* Role badge */}
          <div className="mt-8 flex items-center justify-between md:mt-10">
            <span className="border border-border px-4 py-1.5 text-xs tracking-[0.15em] text-text-muted">
              {project.role}
            </span>

            <div className="flex h-10 w-10 items-center justify-center border border-border text-text-muted transition-all duration-500 group-hover:border-text-primary group-hover:bg-text-primary group-hover:text-text-white md:h-12 md:w-12">
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:h-5 md:w-5" />
            </div>
          </div>

          {/* Status indicator */}
          {project.status === 'in-progress' && (
            <div className="mt-6 flex items-center gap-2 md:mt-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-text-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-text-primary" />
              </span>
              <span className="text-xs tracking-[0.15em] text-text-muted">
                IN PROGRESS
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
