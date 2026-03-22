import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import { SiSpringboot, SiKotlin, SiReact, SiTypescript, SiPostgresql, SiRedis, SiDocker } from 'react-icons/si'
import { RiRobot2Fill } from 'react-icons/ri'
import { projects } from '@/data/projects'
import { ProjectRow } from '@/components/ProjectRow'

const education = [
  { period: '2018', desc: '대입검정고시 합격' },
] as const

const career = [
  {
    period: '2026 -Present',
    title: 'B3D',
    desc: '패션/원단 회사 ERP·PLM 시스템 AI 자동화 도입 및 JSP 레거시 마이그레이션',
    tag: 'Full-Stack Developer',
    image: '🏢',
  },
  {
    period: '2026 -Present',
    title: 'Readip',
    desc: '영어 원서 번역 앱 iOS/Android 운영 중',
    tag: 'Founder & Developer',
    image: '📖',
  },
  {
    period: '2025.03 -2026.03',
    title: '멍냥로그',
    desc: '반려동물 앱 -사업자 등록 후 투자 유치 시도, 카페 병행 운영',
    tag: 'Founder',
    image: '🐾',
  },
  {
    period: '2025.03 -2026.02',
    title: '샬로우커피',
    desc: '카페 사장대리 -직원 약 10명 규모, 연매출 1억원',
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

const sectionColors: Record<string, string> = {
  '학력 사항': '#3B82F6',
  '경력 사항': '#111111',
  '자격증 / 수료증': '#D97757',
  'SKILLS': '#10B981',
}

function SectionTitle({ children }: { children: string }) {
  const color = sectionColors[children] || '#111111'
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: color }} />
      <h3 className="text-[15px] font-bold text-text-primary">{children}</h3>
    </div>
  )
}

function PeriodLabel({ period }: { period: string }) {
  const isActive = period.includes('Present')
  return (
    <span className="flex w-[140px] shrink-0 items-center gap-2 whitespace-nowrap">
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-blue-500' : 'bg-border'}`} />
      <span className="text-[14px] text-text-muted">
        {isActive
          ? <>{period.replace('Present', '')}<span className="font-semibold text-blue-500">Present</span></>
          : period
        }
      </span>
    </span>
  )
}

function InfoList({ items }: { items: readonly { period: string; desc: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.period + item.desc} className="flex gap-6">
          <PeriodLabel period={item.period} />
          <span className="text-[15px] leading-[1.6] text-text-secondary">{item.desc}</span>
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

function CertSection() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? allCerts : allCerts.slice(0, 2)

  return (
    <div>
      <SectionTitle>자격증 / 수료증</SectionTitle>
      <div className="space-y-3">
        {visible.map((cert) => (
          <div key={cert.desc} className="flex gap-6">
            <span className="w-[140px] shrink-0 text-[14px] text-text-muted whitespace-nowrap">{cert.period}</span>
            <div>
              <span className="text-[15px] leading-[1.6] text-text-secondary">{cert.desc}</span>
              <span className="ml-2 text-[13px] text-text-muted">-</span>
              <span className="ml-1 text-[13px] font-medium" style={{ color: '#D97757' }}>{cert.org}</span>
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

const pageLabels = ['INTRO', 'EXPERTISE', 'PROJECTS', 'CONTACT'] as const

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
  const savedPage = Number(sessionStorage.getItem('portfolio-page') || '0')
  const [currentPage, setCurrentPage] = useState(savedPage)
  const totalPages = pageLabels.length

  // 페이지 + 프로젝트 스크롤 복원
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    if (savedPage > 0) {
      requestAnimationFrame(() => {
        el.scrollTo({ left: savedPage * window.innerWidth, behavior: 'instant' as ScrollBehavior })
        // 프로젝트 섹션 세로 스크롤 복원
        const savedScrollY = Number(sessionStorage.getItem('portfolio-projects-scrollY') || '0')
        if (savedScrollY > 0) {
          const projectsSection = el.querySelector('[data-scroll-y]') as HTMLElement | null
          if (projectsSection) {
            projectsSection.scrollTop = savedScrollY
          }
        }
      })
    }
  }, [])

  // 페이지 변경 시 저장
  useEffect(() => {
    sessionStorage.setItem('portfolio-page', String(currentPage))
  }, [currentPage])

  // 프로젝트 섹션 세로 스크롤 저장
  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const projectsSection = el.querySelector('[data-scroll-y]') as HTMLElement | null
    if (!projectsSection) return

    const onProjectScroll = () => {
      sessionStorage.setItem('portfolio-projects-scrollY', String(projectsSection.scrollTop))
    }
    projectsSection.addEventListener('scroll', onProjectScroll, { passive: true })
    return () => projectsSection.removeEventListener('scroll', onProjectScroll)
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
    <nav className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 hidden md:flex items-center gap-2 rounded-full border border-border/60 bg-bg/80 px-4 py-2.5 backdrop-blur-md shadow-sm">
      {pageLabels.map((label, i) => (
        <button
          key={label}
          onClick={() => goToPage(i)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.05em] transition-all ${
            currentPage === i
              ? 'bg-text-primary text-bg'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>

    <main ref={mainRef} className={isMobile
      ? "min-h-screen overflow-y-auto"
      : "flex h-screen snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
    }>

      {/* ===== PAGE 1: INTRO ===== */}
      <section data-page data-scroll-y className="relative min-h-screen md:h-screen snap-start shrink-0 md:w-screen px-6 py-10 pb-24 md:py-12 md:pb-24 md:px-12 md:overflow-y-auto">
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

            <div className="mt-8 aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-2xl bg-bg-card">
              <div className="flex h-full items-center justify-center">
                <span className="text-[13px] tracking-[0.15em] text-text-muted">PHOTO</span>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="flex-1 divide-y divide-border [&>div]:py-5 [&>div:first-child]:pt-0"
          >
            <div>
              <SectionTitle>학력 사항</SectionTitle>
              <InfoList items={education} />
            </div>
            <div>
              <SectionTitle>경력 사항</SectionTitle>
              <div className="space-y-4">
                {career.map((item) => (
                  <div key={item.title} className="flex gap-6">
                    <PeriodLabel period={item.period} />
                    <div>
                      <span className="text-[16px] font-bold text-text-primary">{item.title}</span>
                      <p className="mt-0.5 text-[15px] leading-[1.5] text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <CertSection />
            <div>
              <SectionTitle>SKILLS</SectionTitle>
              <div className="flex flex-wrap gap-4">
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
                      <span className="text-[12px] text-text-muted">{skill.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
        <ScrollHint />
      </section>

      {/* ===== PAGE 2: CORE EXPERTISE ===== */}
      <section data-page className="relative flex min-h-screen md:h-screen snap-start shrink-0 md:w-screen items-center border-t border-border px-6 py-16 md:py-0 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-16 text-[13px] font-semibold tracking-[0.2em] text-text-muted">CORE EXPERTISE</h2>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { num: '01', title: 'Backend', desc: 'Spring Boot, Kotlin, Java, JPA, QueryDSL 기반의 확장 가능한 서버 아키텍처 설계' },
                { num: '02', title: 'Frontend', desc: 'React, TypeScript, Tailwind CSS, Zustand를 활용한 반응형 SPA 개발' },
                { num: '03', title: 'Database', desc: 'PostgreSQL, Redis, MinIO, Docker 기반 데이터 계층 및 인프라 구축' },
                { num: '04', title: 'AI', desc: 'Gemini AI, Spring AI를 활용한 자연어 처리 및 AI 기능 통합' },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span className="text-[13px] text-text-muted">{item.num}</span>
                  <h3 className="mt-4 font-serif text-[1.5rem] text-text-primary">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.75] text-text-secondary">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <ScrollHint />
      </section>

      {/* ===== PAGE 3: PROJECTS ===== */}
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

      {/* ===== PAGE 4: CONTACT ===== */}
      <section data-page className="relative flex min-h-screen md:h-screen snap-start shrink-0 md:w-screen items-center px-6 py-16 md:py-0 md:px-12">
        <div className="mx-auto w-full max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.2] text-text-primary">
              함께 일하고 싶으시다면<span className="italic text-text-muted">.</span>
            </p>

            <p className="mt-6 text-[16px] leading-[1.8] text-text-secondary">
              새로운 프로젝트, 기술 서적 집필, 또는 협업에 대해<br />
              편하게 연락주세요.
            </p>

            {/* Social Links */}
            <div className="mt-14 flex justify-center gap-5">
              {[
                { icon: Mail, label: 'Email', href: 'mailto:contact@example.com' },
                { icon: Github, label: 'GitHub', href: 'https://github.com/Joojinsung1017' },
                { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border text-text-muted transition-all duration-300 hover:border-text-primary hover:bg-text-primary hover:text-bg">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[12px] text-text-muted group-hover:text-text-primary transition-colors">{link.label}</span>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="mt-20 text-[13px] text-text-muted">
              &copy; {new Date().getFullYear()} Jinsung Joo
            </p>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  )
}
