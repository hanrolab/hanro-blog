'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { projects } from '@/data/projects'
import { skillIconMap } from '@/data/skillIcons'

function ChapterToggle({ num, title, count, children }: { num: string; title: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-5 rounded-lg px-4 py-5 text-left transition-all duration-300 ${open ? 'bg-bg-card' : 'hover:bg-bg-card/40'}`}
      >
        <span className="text-[22px] font-bold text-text-muted">{num}</span>
        <span className="flex-1 text-[20px] font-bold text-text-primary">{title}</span>
        <span className="rounded-full bg-bg-card px-3 py-0.5 text-[13px] font-medium text-text-muted">{count}개</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-full border border-border transition-all duration-300 ${open ? 'bg-text-primary border-text-primary' : ''}`}>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-bg' : 'text-text-muted'}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ToggleItem {
  readonly title: string
  readonly content: string
}

function ItemToggleList({ items }: { items: readonly ToggleItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="border-b border-border/60 last:border-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center gap-3 py-3 text-left"
          >
            <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-text-muted transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
            <span className="text-[16px] leading-[1.5] text-text-primary">{item.title}</span>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mb-4 ml-7 rounded-lg bg-bg-card px-5 py-4 text-[14px] leading-[1.8] text-text-secondary">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// 임시 데이터 - 나중에 프로젝트별로 분리
const changelogData: Record<string, readonly ToggleItem[]> = {
  'b3d-ods': [
    { title: 'v2.1 — AI 자연어 조회 기능 도입', content: 'Gemini AI를 활용하여 사용자가 자연어로 데이터를 조회할 수 있는 기능을 추가했습니다. 복잡한 필터 대신 "패딩 봉제 가능한 거래처 찾아줘" 같은 질문으로 데이터를 검색할 수 있습니다.' },
    { title: 'v2.0 — SaaS 멀티 컴퍼니 전환', content: '단일 회사 구조에서 멀티 컴퍼니 SaaS 구조로 전환했습니다. companyId 기반 데이터 격리, 회사별 설정 관리, 역할 기반 접근 제어를 구현했습니다.' },
    { title: 'v1.5 — JSP → React 마이그레이션', content: '레거시 JSP 기반 프론트엔드를 React 19 + TypeScript로 완전 마이그레이션했습니다. shadcn/ui 컴포넌트 시스템 도입으로 개발 속도가 크게 향상되었습니다.' },
  ],
  'readip': [
    { title: 'v1.1 — Gemini AI 번역 엔진 도입', content: 'Google Translate에서 Gemini AI로 번역 엔진을 전환하여 문맥 인식 번역 품질을 향상시켰습니다.' },
    { title: 'v1.0 — iOS/Android 동시 출시', content: 'Kotlin Multiplatform으로 개발하여 Android와 iOS에 동시 출시했습니다. 코드 80% 이상을 공유합니다.' },
  ],
}

const improvementData: Record<string, readonly ToggleItem[]> = {
  'b3d-ods': [
    { title: '쿼리 최적화로 응답시간 40% 단축', content: 'QueryDSL을 활용한 동적 쿼리 최적화와 Redis 캐싱 도입으로 평균 API 응답시간을 200ms에서 120ms로 단축했습니다.' },
    { title: 'Redis 캐싱 도입', content: '권한 정보, 자주 조회되는 코드 데이터를 Redis에 캐싱하여 DB 부하를 줄이고 응답 속도를 개선했습니다.' },
  ],
}

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative overflow-hidden rounded-xl bg-bg-card border border-border">
      {/* Image */}
      <div ref={containerRef} className="relative aspect-[16/9] w-full overflow-hidden">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`${title} screenshot ${i + 1}`}
            className="absolute inset-0 h-full w-full object-contain p-4"
            initial={false}
            animate={{ opacity: current === i ? 1 : 0, x: current === i ? 0 : current > i ? -40 : 40 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${current === i ? 'w-6 bg-text-primary' : 'w-2 bg-text-muted/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectDetail({ id }: { readonly id: string }) {
  const project = projects.find((p) => p.id === id)

  if (!project) {
    redirect('/portfolio')
  }

  const galleryImages: string[] = []
  if (project.images?.desktop) galleryImages.push(project.images.desktop)
  if (project.images?.tablet) galleryImages.push(project.images.tablet)
  if (project.images?.mobile) galleryImages.push(project.images.mobile)

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-4 md:px-12 md:pt-6">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/portfolio#projects"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          BACK TO PROJECTS
        </Link>
      </motion.div>

      {/* Header - same layout as ProjectRow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 text-[13px] font-medium text-text-muted">
          <span>{project.year}</span>
          {project.status === 'in-progress' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-green-600">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                진행중
              </span>
            </>
          )}
        </div>

        <div className="mt-1 flex items-end gap-3">
          <h1 className="text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.08] text-text-primary">
            {project.title}
          </h1>
          <span
            className="mb-1 shrink-0 text-[12px] font-semibold tracking-[0.02em]"
            style={{ color: project.accent || '#555' }}
          >
            {project.category}
          </span>
        </div>
      </motion.div>

      {/* Image Carousel */}
      {galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10"
        >
          <ImageCarousel images={galleryImages} title={project.title} />
        </motion.div>
      )}

      {/* Content */}
      <div className="mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="mb-5 flex items-center gap-3 text-[16px] font-bold tracking-[0.05em] text-text-primary">
            <span className="h-5 w-[3px] rounded-full bg-text-primary" />
            PROJECT OVERVIEW
          </h2>
          <p className="text-[17px] leading-[1.9] text-text-secondary">
            {project.description}
          </p>

          {/* Tech Stack - 카테고리별 가로 나열 */}
          {project.techDetail && (
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-0 md:divide-x md:divide-border md:justify-center">
              {(['frontend', 'backend', 'infra'] as const).map((category) => {
                const items = project.techDetail?.[category]
                if (!items) return null
                const labelColor = category === 'frontend' ? '#3B82F6' : category === 'backend' ? '#10B981' : '#F59E0B'
                const label = category === 'frontend' ? 'Frontend' : category === 'backend' ? 'Backend' : 'Infra'
                return (
                  <div key={category} className="px-6 first:pl-0 last:pr-0">
                    <span className="text-[12px] font-semibold" style={{ color: labelColor }}>{label}</span>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {items.map((tech) => {
                        const skill = skillIconMap[tech]
                        const Icon = skill?.icon
                        const color = skill?.color || '#777'
                        return (
                          <div key={tech} className="flex flex-col items-center gap-1">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full border-2"
                              style={{ borderColor: color, backgroundColor: color + '12', color }}
                            >
                              {Icon ? <Icon className="h-4 w-4" /> : <span className="text-[9px] font-bold">{tech.substring(0, 2)}</span>}
                            </div>
                            <span className="max-w-[70px] text-center text-[12px] font-semibold text-text-secondary leading-tight">{tech}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Project Details */}
          <div className="mt-14">
            <h2 className="mb-5 flex items-center gap-3 text-[16px] font-bold tracking-[0.05em] text-text-primary">
              <span className="h-5 w-[3px] rounded-full bg-text-primary" />
              PROJECT DETAILS
            </h2>
          <div className="border-t border-border">
            {/* Chapter 01: 주요 기능 */}
            <ChapterToggle
              num="01"
              title="주요 기능"
              count={project.highlights.length}
            >
              <ItemToggleList items={project.highlights.map((h) => ({
                title: h,
                content: '상세 내용을 여기에 작성하세요.'
              }))} />
            </ChapterToggle>

            {/* Chapter 02: 변경 사항 */}
            {changelogData[project.id] && (
              <ChapterToggle
                num="02"
                title="변경 사항"
                count={changelogData[project.id].length}
              >
                <ItemToggleList items={changelogData[project.id]} />
              </ChapterToggle>
            )}

            {/* Chapter 03: 개선 사항 */}
            {improvementData[project.id] && (
              <ChapterToggle
                num="03"
                title="개선 사항"
                count={improvementData[project.id].length}
              >
                <ItemToggleList items={improvementData[project.id]} />
              </ChapterToggle>
            )}
          </div>
          </div>
        </motion.div>

      </div>
    </main>
  )
}
