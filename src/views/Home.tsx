'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Github, Instagram, Linkedin } from 'lucide-react'
import { SiSpringboot, SiKotlin, SiReact, SiTypescript, SiPostgresql, SiRedis, SiDocker } from 'react-icons/si'
import { RiRobot2Fill } from 'react-icons/ri'
import { projects } from '@/data/projects'
import { ProjectRow } from '@/components/ProjectRow'

const education = [
  { period: '2018', desc: '대입검정고시 합격' },
] as const

const career = [
  {
    period: '2026 — 재직중',
    title: 'B3D',
    desc: '패션/원단 회사 ERP·PLM 시스템 AI 자동화 도입 및 JSP 레거시 마이그레이션',
    tag: 'Full-Stack Developer',
    image: '🏢',
  },
  {
    period: '2026 — 운영중',
    title: 'Readip',
    desc: '영어 원서 번역 앱 iOS/Android 운영 중',
    tag: 'Founder & Developer',
    image: '📖',
  },
  {
    period: '2025.03 — 2026.03',
    title: '멍냥로그',
    desc: '반려동물 앱 -사업자 등록 후 투자 유치 시도, 카페 병행 운영',
    tag: 'Founder',
    image: '🐾',
  },
  {
    period: '2025.03 — 2026.02',
    title: '샬로우커피',
    desc: '카페 사장대리 -직원 약 10명 규모, 연매출 1억원 (근무 기간 중 최저·최고 매출 달성)',
    tag: '사장대리',
    image: '☕',
  },
] as const

const skills = [
  { name: 'Spring', color: '#6DB33F', icon: SiSpringboot },
  { name: 'Kotlin', color: '#7F52FF', icon: SiKotlin },
  { name: 'React', color: '#61DAFB', icon: SiReact },
  { name: 'TypeScript', color: '#3178C6', icon: SiTypescript },
  { name: 'PostgreSQL', color: '#4169E1', icon: SiPostgresql },
  { name: 'Redis', color: '#DC382D', icon: SiRedis },
  { name: 'Docker', color: '#2496ED', icon: SiDocker },
  { name: 'AI', color: '#FF6F00', icon: RiRobot2Fill },
] as const

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-[1.125rem] font-bold text-text-primary">{children}</h3>
      <div className="mt-3 h-px bg-border" />
    </div>
  )
}

function InfoList({ items }: { items: readonly { period: string; desc: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.period + item.desc} className="flex gap-6">
          <span className="w-[150px] shrink-0 text-[0.9375rem] text-text-muted whitespace-nowrap">{item.period}</span>
          <span className="text-[1rem] leading-[1.7] text-text-secondary">{item.desc}</span>
        </div>
      ))}
    </div>
  )
}

const allCerts = [
  { period: '2026.03', desc: 'Certificate of completion: Claude 101', org: 'Anthropic' },
  { period: '2026.03', desc: 'Claude Code in Action', org: 'Anthropic' },
  { period: '2026.02', desc: 'AI Fundamentals', org: 'Google' },
  { period: '2025.12', desc: 'Spring Boot Masterclass', org: 'Udemy' },
  { period: '2025.10', desc: 'Kotlin for Backend Development', org: 'JetBrains' },
] as const

const ORG_COLORS: Record<string, string> = {
  'Anthropic': '#CC785C',
  'Google': '#4285F4',
  'Udemy': '#A435F0',
  'JetBrains': '#087CFA',
}
function orgColor(org: string): string { return ORG_COLORS[org] ?? '#3182f6' }

function CertSection() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? allCerts : allCerts.slice(0, 2)

  return (
    <div>
      <SectionTitle>자격증 / 수료증</SectionTitle>
      <div className="space-y-3">
        {visible.map((cert) => (
          <div key={cert.desc} className="flex gap-6">
            <span className="w-[150px] shrink-0 text-[0.9375rem] text-text-muted whitespace-nowrap">{cert.period}</span>
            <div>
              <span className="text-[1rem] leading-[1.7] text-text-secondary">{cert.desc}</span>
              <span className="ml-2 text-[0.875rem] text-text-muted">·</span>
              <span className="ml-1 text-[0.9375rem] font-medium" style={{ color: orgColor(cert.org) }}>{cert.org}</span>
            </div>
          </div>
        ))}
      </div>
      {allCerts.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-[14px] font-semibold text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary"
        >
          <span className="text-[13px]">{showAll ? '−' : '+'}</span>
          {showAll ? '접기' : `${allCerts.length - 2}개 더보기`}
        </button>
      )}
    </div>
  )
}

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1"
    >
      <span className="text-[11px] tracking-[0.2em] text-text-muted rotate-90 origin-center">NEXT</span>
      <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <ChevronDown className="h-4 w-4 -rotate-90 text-text-muted" />
      </motion.div>
    </motion.div>
  )
}

const pageLabels = ['INTRO', 'PROJECTS', 'CONTACT'] as const

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = pageLabels.length

  // 페이지 + 세로 스크롤 복원
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const saved = Number(sessionStorage.getItem('portfolio-page') || '0')
    setCurrentPage(saved)
    requestAnimationFrame(() => {
      if (saved > 0) {
        el.scrollTo({ left: saved * window.innerWidth, behavior: 'instant' as ScrollBehavior })
      }
      el.querySelectorAll<HTMLElement>('[data-scroll-y]').forEach((section, i) => {
        const y = Number(sessionStorage.getItem(`portfolio-scrollY-${i}`) || '0')
        if (y > 0) section.scrollTop = y
      })
    })
  }, [])

  // 페이지 변경 시 저장
  useEffect(() => {
    sessionStorage.setItem('portfolio-page', String(currentPage))
  }, [currentPage])

  // 모든 스크롤 가능 섹션의 세로 스크롤 저장
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const sections = el.querySelectorAll<HTMLElement>('[data-scroll-y]')
    const cleanups: (() => void)[] = []
    sections.forEach((section, i) => {
      const handler = () => sessionStorage.setItem(`portfolio-scrollY-${i}`, String(section.scrollTop))
      section.addEventListener('scroll', handler, { passive: true })
      cleanups.push(() => section.removeEventListener('scroll', handler))
    })
    return () => cleanups.forEach(fn => fn())
  }, [])
  const isMobile = useIsMobile()

  const goToPage = useCallback((index: number) => {
    const el = mainRef.current
    if (!el) return
    if (isMobile) {
      const sections = el.querySelectorAll('[data-page]')
      sections[index]?.scrollIntoView({ behavior: 'smooth' })
    } else {
      el.scrollTo({ left: index * window.innerWidth, behavior: 'smooth' })
    }
  }, [isMobile])

  useEffect(() => {
    const el = mainRef.current
    if (!el || isMobile) return

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement
      const scrollYSection = target.closest('[data-scroll-y]') as HTMLElement | null

      if (scrollYSection) {
        const { scrollTop, scrollHeight, clientHeight } = scrollYSection
        const atBottom = scrollTop + clientHeight >= scrollHeight - 5
        const atTop = scrollTop <= 5
        const scrollingDown = e.deltaY > 0
        const scrollingUp = e.deltaY < 0

        if (atBottom && scrollingDown) {
          e.preventDefault()
          el.scrollBy({ left: window.innerWidth, behavior: 'smooth' })
          return
        }
        if (atTop && scrollingUp) {
          e.preventDefault()
          el.scrollBy({ left: -window.innerWidth, behavior: 'smooth' })
          return
        }
        return
      }

      e.preventDefault()
      el.scrollBy({ left: e.deltaY * 3, behavior: 'smooth' })
    }

    const onScroll = () => {
      const page = Math.round(el.scrollLeft / window.innerWidth)
      setCurrentPage(page)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToPage(Math.min(currentPage + 1, totalPages - 1))
      if (e.key === 'ArrowLeft') goToPage(Math.max(currentPage - 1, 0))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [currentPage, goToPage, totalPages, isMobile])

  return (
    <>
    {/* Page indicator */}
    <nav className="glass-nav fixed bottom-8 left-1/2 z-50 -translate-x-1/2 hidden md:flex items-center gap-1 rounded-2xl p-1.5">
      {pageLabels.map((label, i) => (
        <button
          key={label}
          onClick={() => goToPage(i)}
          className="relative rounded-xl px-5 py-2.5 text-[0.75rem] font-semibold tracking-[0.04em] transition-colors duration-200"
          style={{ color: currentPage === i ? '#fff' : '#4e5968' }}
        >
          {currentPage === i && (
            <motion.div
              layoutId="nav-active"
              className="absolute inset-0 rounded-xl bg-[#191f28]"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{label}</span>
        </button>
      ))}
    </nav>

    <main ref={mainRef} className={isMobile
      ? "min-h-screen overflow-y-auto"
      : "flex h-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
    }>

      {/* ===== PAGE 1: INTRO ===== */}
      <section data-page data-scroll-y className="relative min-h-screen md:h-screen snap-start shrink-0 md:w-screen px-6 py-10 pb-40 md:py-12 md:pb-40 md:px-12 md:overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:w-[42%]"
          >
            <div className="text-[26px] leading-[1.65] text-text-primary md:text-[30px]">
              <span className="text-5xl leading-none text-text-muted">&ldquo;</span>
              <br />
              안녕하세요.
              <br />
              <span className="font-bold text-blue-600">확장성, 아키텍처, 기술 공유</span>를
              <br />
              추구하는 개발자
              <br />
              <span className="font-serif text-[34px] md:text-[40px]">주진성입니다.</span>
            </div>

            <div className="mt-8 aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl">
              <img src="/profile.jpeg" alt="주진성" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex-1 space-y-8"
          >
            <div>
              <SectionTitle>학력 사항</SectionTitle>
              <InfoList items={education} />
            </div>
            <div>
              <SectionTitle>경력 사항</SectionTitle>
              <div className="space-y-6">
                {career.map((item) => (
                  <div key={item.title} className="flex gap-6">
                    <h4 className="w-[100px] shrink-0 text-[1.125rem] font-bold text-text-primary">{item.title}</h4>
                    <div>
                      <p className="text-[0.9375rem] leading-[1.7] text-text-primary">{item.desc}</p>
                      <p className="mt-1 text-[0.8125rem] text-text-muted">
                        {item.period.includes('재직중') || item.period.includes('운영중')
                          ? <><span className="text-text-primary">{item.period.replace(/재직중|운영중/, '')}</span><span className={`font-semibold ${item.period.includes('재직중') ? 'text-[#3182f6]' : 'text-[#20c997]'}`}>{item.period.match(/재직중|운영중/)?.[0]}</span></>
                          : item.period
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CertSection />
            <div>
              <SectionTitle>SKILLS</SectionTitle>
              <div className="flex flex-wrap justify-center gap-5">
                {skills.map((skill) => {
                  const Icon = skill.icon
                  return (
                    <div key={skill.name} className="flex flex-col items-center gap-2">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2"
                        style={{ borderColor: skill.color, backgroundColor: skill.color + '12', color: skill.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[0.8125rem] text-text-muted">{skill.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
        <ScrollHint />
      </section>

      {/* ===== PAGE 2: PROJECTS ===== */}
      <section id="projects" data-page data-scroll-y className="min-h-screen md:h-screen snap-start shrink-0 md:w-screen px-6 pt-3 pb-24 md:px-12 md:pt-3 md:pb-24 md:overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-6 flex justify-end">
            <span className="rounded-full bg-bg-card px-3 py-1 text-[13px] font-medium text-text-muted">{projects.length} Projects</span>
          </div>
          <div>
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PAGE 3: CONTACT ===== */}
      <section data-page className="relative flex min-h-screen md:h-screen snap-start shrink-0 md:w-screen items-center px-6 py-16 md:py-0 md:px-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-[1.4] text-text-primary">
              누군가에게 도움이 되는<br />기술을 만들고 싶습니다.
            </p>

            {/* Social Links */}
            <div className="mt-14 flex justify-center gap-5">
              {[
                { icon: Github, href: 'https://github.com/Joojinsung1017', color: '#24292e' },
                { icon: Instagram, href: 'https://www.instagram.com/j_m101707/', color: '#E1306C' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/dev-jinsung', color: '#0A66C2' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-card transition-all hover:scale-110 hover:opacity-80"
                  style={{ color: link.color }}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>

            {/* Email */}
            <p className="mt-10 text-[0.9375rem] tracking-wide text-text-muted">
              dev.jinsung1017@gmail.com
            </p>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  )
}
