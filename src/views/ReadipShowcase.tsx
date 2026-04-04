'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowLeft, ChevronDown, Smartphone, Shield, Zap, GitBranch, Layers, Brain, BookOpen, Globe, Github, ExternalLink, Monitor, Cpu, BookMarked, Keyboard, Bot, Lock, Cloud, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { skillIconMap } from '@/data/skillIcons'
import { ContentPipelineFlow } from './ContentPipelineFlow'

// ─── Image Carousel ───
function ImageCarousel() {
  const [current, setCurrent] = useState(0)
  const images = ['https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/readip-mobile.png']

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="mt-10"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-[#f8f9fa]">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {images.map((src, i) => (
            <motion.img
              key={i}
              src={src}
              alt={`Readip screenshot ${i + 1}`}
              className="absolute inset-0 h-full w-full object-contain p-4"
              initial={false}
              animate={{ opacity: current === i ? 1 : 0, x: current === i ? 0 : current > i ? -40 : 40 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-text-primary shadow-lg transition-all hover:bg-white/80 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-text-primary shadow-lg transition-all hover:bg-white/80 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

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
    </motion.div>
  )
}

// ─── Counter Animation ───
function CountUp({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

  return <span ref={ref}>{prefix}{count}{suffix}</span>
}

// ─── Section Header ───
function SectionHeader({ label, title, accent = '#10b981' }: { label: string; title: string; accent?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-[13px] font-bold tracking-[0.15em] uppercase" style={{ color: accent }}>{label}</span>
      <h2 className="mt-1 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-text-primary">{title}</h2>
    </motion.div>
  )
}

// ─── Code Block ───
function CodeSnippet({ code, language }: { code: string; language: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-[#1a1a2e] text-[12px] leading-[1.7]">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] text-white/30">{language}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="text-[#e2e8f0] font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  )
}

// ─── Challenge Card ───
function ChallengeCard({ challenge, index, accent }: {
  challenge: { title: string; problem: string; approach: string; solution: string; impact: string; icon: React.ReactNode; code?: { snippet: string; language: string } }
  index: number
  accent: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full rounded-2xl border text-left transition-all duration-300 ${open ? 'border-border bg-bg-card shadow-sm' : 'border-border/60 hover:border-border hover:bg-bg-card/40'}`}
      >
        <div className="flex items-start gap-4 p-6">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent + '15', color: accent }}
          >
            {challenge.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[18px] font-bold text-text-primary leading-snug">{challenge.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-text-muted line-clamp-2">{challenge.problem}</p>
          </div>
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${open ? 'border-text-primary bg-text-primary' : 'border-border'}`}>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180 text-bg' : 'text-text-muted'}`} />
          </div>
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
            <div className="px-6 pb-6 pt-0">
              <div className="ml-14 space-y-4">
                {[
                  { label: 'APPROACH', text: challenge.approach, color: '#3B82F6' },
                  { label: 'SOLUTION', text: challenge.solution, color: '#10B981' },
                  { label: 'IMPACT', text: challenge.impact, color: '#F59E0B' },
                ].map((item) => (
                  <div key={item.label}>
                    <span className="text-[12px] font-bold tracking-[0.1em]" style={{ color: item.color }}>{item.label}</span>
                    <p className="mt-1 text-[16px] leading-[1.8] text-text-secondary">{item.text}</p>
                  </div>
                ))}
                {challenge.code && (
                  <div className="mt-2">
                    <CodeSnippet code={challenge.code.snippet} language={challenge.code.language} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Architecture Diagram ───
function ArchitectureDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      {/* ── SYSTEM ARCHITECTURE ── */}
      <div className="rounded-2xl border-2 border-border p-6 md:p-8">
        <p className="mb-6 text-[15px] font-bold tracking-[0.15em] text-text-muted">SYSTEM ARCHITECTURE</p>

        {/* CI/CD Pipeline */}
        <div className="mb-6 rounded-xl border border-dashed border-text-muted/30 p-4">
          <p className="mb-3 text-[13px] font-bold tracking-[0.1em] text-text-muted">CI/CD PIPELINE</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-lg border border-border bg-bg-card/50 px-3 py-1.5 text-[14px] font-semibold text-text-secondary">Git Push (main)</span>
            <span className="text-[16px] text-text-primary/40">&#9654;</span>
            <span className="rounded-lg border border-border bg-bg-card/50 px-3 py-1.5 text-[14px] font-semibold text-text-secondary">GitHub Actions</span>
            <span className="text-[16px] text-text-primary/40">&#9654;</span>
            <span className="rounded-lg border border-border bg-bg-card/50 px-3 py-1.5 text-[14px] font-semibold text-text-secondary">Docker Build</span>
            <span className="text-[16px] text-text-primary/40">&#9654;</span>
            <span className="rounded-lg border border-border bg-bg-card/50 px-3 py-1.5 text-[14px] font-semibold text-text-secondary">GHCR Push</span>
            <span className="text-[16px] text-text-primary/40">&#9654;</span>
            <span className="rounded-lg border border-text-primary bg-text-primary/5 px-3 py-1.5 text-[14px] font-bold text-text-primary">EC2 SSH Deploy</span>
          </div>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden md:flex items-center justify-center gap-2">
          <div className="rounded-2xl border-2 border-border bg-bg-card/50 px-8 py-6 text-center min-w-[240px]">
            <img src="/icons/kmp.png" alt="KMP" className="h-14 mx-auto mb-3 rounded-lg object-contain" />
            <p className="text-[22px] font-bold text-text-primary">KMP Client</p>
            <p className="mt-2 text-[16px] text-text-secondary leading-relaxed">Compose Multiplatform<br />Orbit MVI<br />Android / iOS</p>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 px-2">
            <div className="flex items-center">
              <div className="h-[3px] w-10 bg-text-primary/30 rounded-full" />
              <span className="text-[20px] text-text-primary/50">&#9654;</span>
            </div>
            <span className="text-[14px] font-semibold text-text-muted">Ktor HTTP</span>
          </div>

          <div className="rounded-2xl border-2 border-text-primary bg-text-primary/5 px-8 py-6 text-center min-w-[280px]">
            <div className="flex items-center justify-center gap-2 mb-3">
              <img src="/icons/aws.jpeg" alt="AWS" className="h-10 rounded object-contain" />
              <img src="/icons/spring-boot.png" alt="Spring Boot" className="h-10 rounded object-contain" />
              <img src="/icons/docker.png" alt="Docker" className="h-10 rounded object-contain" />
            </div>
            <p className="text-[22px] font-bold text-text-primary">AWS EC2</p>
            <p className="mt-2 text-[16px] text-text-secondary leading-relaxed">Spring Boot 4 + Docker<br />PostgreSQL 16 + Flyway<br />JPA + QueryDSL + JWT</p>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 px-2">
            <div className="flex items-center">
              <div className="h-[3px] w-10 bg-text-primary/30 rounded-full" />
              <span className="text-[20px] text-text-primary/50">&#9654;</span>
            </div>
            <span className="text-[14px] font-semibold text-text-muted">S3 API</span>
          </div>

          <div className="rounded-2xl border-2 border-border bg-bg-card/50 px-8 py-6 text-center min-w-[240px]">
            <p className="text-[22px] font-bold text-text-primary">Cloudflare R2</p>
            <p className="mt-2 text-[16px] text-text-secondary leading-relaxed">Cover Image Storage<br />CDN Distribution</p>
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden flex flex-col items-center gap-0">
          <div className="w-full rounded-2xl border-2 border-border bg-bg-card/50 px-6 py-5 text-center">
            <p className="text-[20px] font-bold text-text-primary">KMP Client</p>
            <p className="mt-2 text-[16px] text-text-secondary">Compose Multiplatform + Orbit MVI</p>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-[3px] h-4 bg-text-primary/30 rounded-full" />
            <span className="text-[14px] font-semibold text-text-muted py-1">Ktor HTTP</span>
            <div className="w-[3px] h-2 bg-text-primary/30 rounded-full" />
            <span className="text-[18px] text-text-primary/50">&#9660;</span>
          </div>
          <div className="w-full rounded-2xl border-2 border-text-primary bg-text-primary/5 px-6 py-5 text-center">
            <p className="text-[20px] font-bold text-text-primary">AWS EC2</p>
            <p className="mt-2 text-[16px] text-text-secondary">Spring Boot 4 + Docker<br />PostgreSQL 16 + Flyway</p>
          </div>
          <div className="flex flex-col items-center py-2">
            <div className="w-[3px] h-4 bg-text-primary/30 rounded-full" />
            <span className="text-[14px] font-semibold text-text-muted py-1">S3 API</span>
            <div className="w-[3px] h-2 bg-text-primary/30 rounded-full" />
            <span className="text-[18px] text-text-primary/50">&#9660;</span>
          </div>
          <div className="w-full rounded-2xl border-2 border-border bg-bg-card/50 px-6 py-5 text-center">
            <p className="text-[20px] font-bold text-text-primary">Cloudflare R2</p>
            <p className="mt-2 text-[16px] text-text-secondary">Cover Image Storage</p>
          </div>
        </div>

        {/* External Services */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            { name: 'Gemini AI', icon: '/icons/gemini.png' },
            { name: 'RevenueCat', icon: '/icons/revenuecat.png' },
            { name: 'Next.js Admin', icon: '/icons/nextjs.png' },
            { name: 'GitHub Actions', icon: '/icons/github-actions.png' },
          ].map((s) => (
            <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-[14px] font-semibold text-text-secondary">
              <img src={s.icon} alt={s.name} className="h-5 w-5 rounded object-contain" />
              {s.name}
            </span>
          ))}
        </div>
      </div>


      {/* ── CONTENT PIPELINE ── */}
      <div className="rounded-2xl border-2 border-border p-6 md:p-8">
        <p className="mb-2 text-[15px] font-bold tracking-[0.15em] text-text-muted">CONTENT PIPELINE</p>
        <p className="mb-4 text-[15px] text-text-muted">Claude Code <code className="rounded bg-bg-card px-1.5 py-0.5 text-[14px] font-mono font-bold text-text-primary">/create-book</code> skill</p>
        <ContentPipelineFlow />
      </div>

    </motion.div>
  )
}

// ─── ADR Card ───
function ADRCard({ adr, index }: {
  adr: { question: string; options: readonly { name: string; rejected?: boolean; reason: string }[]; decision: string; tradeoff: string }
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full rounded-2xl border text-left transition-all duration-300 ${open ? 'border-border bg-bg-card/50 shadow-sm' : 'border-border/60 hover:border-border hover:bg-bg-card/40'}`}
      >
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-text-primary/10 text-[13px] font-bold text-text-primary">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="flex-1 text-[17px] font-bold text-text-primary">{adr.question}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
            <div className="px-5 pb-5 pt-0">
              <div className="ml-12 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {adr.options.map((opt) => (
                    <span
                      key={opt.name}
                      className={`rounded-full px-3 py-1 text-[13px] font-medium ${opt.rejected ? 'bg-bg-card text-text-muted line-through decoration-text-muted/40' : 'bg-[#10b981]/10 text-[#10b981] ring-1 ring-[#10b981]/20'}`}
                    >
                      {opt.name}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  {adr.options.filter(o => o.rejected).map((opt) => (
                    <p key={opt.name} className="text-[13px] text-text-muted">
                      <span className="font-semibold">{opt.name}</span> — {opt.reason}
                    </p>
                  ))}
                </div>

                <div className="rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 p-4">
                  <span className="text-[11px] font-bold tracking-[0.1em] text-[#10b981]">DECISION</span>
                  <p className="mt-1 text-[15px] leading-[1.7] text-text-primary">{adr.decision}</p>
                </div>

                <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4">
                  <span className="text-[11px] font-bold tracking-[0.1em] text-[#F59E0B]">TRADE-OFF</span>
                  <p className="mt-1 text-[15px] leading-[1.7] text-text-secondary">{adr.tradeoff}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Timeline ───
function TimelineItem({ version, title, highlights, index, isLast }: {
  version: string; title: string; highlights: readonly string[]; index: number; isLast: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-[11px] font-bold text-white">
          {version}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className={`${isLast ? 'pb-0' : 'pb-8'}`}>
        <h4 className="text-[16px] font-bold text-text-primary">{title}</h4>
        <ul className="mt-2 space-y-1">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] leading-[1.7] text-text-secondary">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#10b981]" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ─── Data (Korean) ───
const metrics = [
  { value: 80, suffix: '%+', label: '코드 공유율', desc: 'Android/iOS KMP' },
  { value: 100, suffix: '권+', label: 'CEFR 도서', desc: 'A1~C2 레벨별' },
  { value: 2000, suffix: '+', label: '사용자', desc: 'Android + iOS' },
] as const

interface ChallengeCategory {
  readonly category: string
  readonly color: string
  readonly items: readonly {
    readonly title: string
    readonly problem: string
    readonly approach: string
    readonly solution: string
    readonly impact: string
    readonly icon: React.ReactNode
    readonly code?: { readonly snippet: string; readonly language: string }
  }[]
}

const challengeCategories: readonly ChallengeCategory[] = [
  {
    category: 'Architecture',
    color: '#191f28',
    items: [
      {
        title: 'Widget-Section-Screen 아키텍처',
        problem: '694줄짜리 모놀리스 ReadipApi를 13개 화면에서 직접 호출. 상태 관리와 API 호출이 Screen composable 안에 뒤섞여 있었다.',
        approach: '2단계 리팩토링: 먼저 API를 도메인 경계로 분리(BookApi, ReadingApi, WordApi, ConfigApi, AccountApi)하고, 이후 UI를 widget/section/screen 3계층으로 추출.',
        solution: '14개 Orbit MVI ViewModel을 도입하여 State(불변 데이터) + Intent(상태 변경) + SideEffect(일회성 이벤트) 패턴 적용. 8개 Screen의 private composable을 19개 widget/section 파일로 분리.',
        impact: '관심사 분리 완료. 새 화면 추가 시 위젯 조합만으로 개발 가능. 모든 상태 변경이 intent {} 블록을 통해 추적 가능.',
        icon: <Layers className="h-5 w-5" />,
        code: {
          snippet: `// Widget: 최소 재사용 단위
@Composable fun BookGridCard(book: Book, onClick: () -> Unit)

// Section: 위젯 그룹 (화면 영역)
@Composable fun BookContentSection(state: ReaderState)

// Screen: ViewModel + Navigation
@Composable fun ReaderScreen(viewModel: ReaderViewModel) {
  val state by viewModel.collectAsState()
  BookContentSection(state)
}`,
          language: 'Kotlin (Compose)',
        },
      },
      {
        title: '홈 화면 4개 API 병렬 호출',
        problem: '홈 화면에서 이어읽기, 짧은 글, 긴 글, 통계 4개 API를 순차 호출하면 첫 화면까지 3~4초가 걸렸다.',
        approach: 'supervisorScope + async/awaitAll 패턴으로 병렬 호출. supervisorScope를 사용하여 하나의 요청이 실패해도 나머지에 영향을 주지 않도록 설계.',
        solution: '4개 요청을 동시에 보내고 awaitAll()로 모아서 한 번에 state를 갱신. 자주 변하지 않는 데이터(짧은 글, 긴 글)는 HomeViewModel에서 24시간 TTL로 캐싱.',
        impact: '홈 화면 로딩 체감 시간 대폭 단축. 앱 재진입 시 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신.',
        icon: <Zap className="h-5 w-5" />,
        code: {
          snippet: `fun loadHome() = intent {
  supervisorScope {
    val reading = async { readingApi.getContinue() }
    val short   = async { bookApi.getShortReads() }
    val long    = async { bookApi.getLongReads() }
    val stats   = async { wordApi.getStats() }
    reduce { state.copy(
      continueReading = reading.await(),
      shortReads = short.await(),
      longReads = long.await(),
      stats = stats.await()
    )}
  }
}`,
          language: 'Kotlin (Coroutines)',
        },
      },
    ],
  },
  {
    category: 'AI & Translation',
    color: '#191f28',
    items: [
      {
        title: 'Gemini AI 문맥 인식 번역',
        problem: '단어 하나만 번역하면 문맥을 무시한 결과가 나온다. "bank"가 은행인지 강둑인지 판별할 수 없었다.',
        approach: '두 가지 번역 모드 설계: 단어 번역(translateWord)은 뜻 + 품사를 JSON으로 추출, 문맥 번역(translateWithContext)은 선택 단어가 포함된 전체 문장을 함께 전송.',
        solution: 'Gemini 2.0 Flash에 구조화된 프롬프트로 JSON 응답 요청. API 응답 형식 불일치 문제(JSON 요청해도 마크다운 혼합)를 정규식 기반 JSON 추출 + raw 텍스트 파싱 2단계 폴백으로 해결. 429/5xx 에러 시 exponential backoff(1초, 2초, 3초) 재시도.',
        impact: '문맥에 따른 정확한 번역 제공. API 실패율 거의 제로 (폴백 전략으로 복구).',
        icon: <Brain className="h-5 w-5" />,
        code: {
          snippet: `// 문맥 번역: 문장 전체를 함께 전송
suspend fun translateWithContext(
  word: String,
  sentence: String,  // 주변 문장 컨텍스트
  from: String, to: String
): Translation {
  val prompt = """
    Translate "$word" in context: "$sentence"
    Return JSON: {"word":"...","meaning":"...",
                   "pos":"...","context":"..."}
  """
  return geminiCall(prompt)
    .parseJson()           // 1차: JSON 파싱
    ?: parseRawText(resp)  // 2차: 텍스트 폴백
}`,
          language: 'Kotlin',
        },
      },
      {
        title: 'AI 기반 도서 콘텐츠 생성 파이프라인',
        problem: 'CEFR A1~C2 레벨별 도서를 수동으로 번역하고 업로드하는 것은 비현실적. 70권의 원문+번역 콘텐츠를 효율적으로 생산해야 했다.',
        approach: '프로젝트 구텐베르크 등 퍼블릭 도메인 원서를 기반으로, Claude AI의 도움을 받아 한국어 번역과 CEFR 레벨 태깅을 자동화하는 파이프라인 구축.',
        solution: 'upload_books.py 스크립트로 원문(en.txt)과 번역(ko.html)을 서버에 업로드. 번역 시 HTML 태그 보존 규칙 적용 (em dash 예외, 문단/제목 구조 유지). Admin 대시보드에서 메타데이터(장르, CEFR 레벨, 표지) 관리.',
        impact: '총 70권의 CEFR 레벨별 도서 라이브러리 구축. A1~B2 각 레벨별 10쌍 이상 확보.',
        icon: <Bot className="h-5 w-5" />,
      },
    ],
  },
  {
    category: 'Reader Engine',
    color: '#191f28',
    items: [
      {
        title: 'Compose Text → WebView + CSS column 리더 전환',
        problem: '네이티브 Compose Text로 긴 HTML 콘텐츠를 렌더링하면 성능이 심각하게 떨어졌다. 볼드, 이탤릭, 제목 등 서식이 포함된 원서에서 AnnotatedString 변환 비용이 컸다.',
        approach: 'WebView에서 CSS column-width 기반 페이지네이션을 구현. HTML을 그대로 렌더링하면서 JavaScript 브릿지로 Kotlin과 양방향 통신하는 하이브리드 구조 설계.',
        solution: 'PlatformBookWebView를 도입하여 서버에서 받은 HTML을 WebView에 로드. JS 브릿지로 현재 페이지 번호와 스크롤 위치를 Kotlin에 전달. BookReaderHandle 인터페이스가 Android(WebView)와 iOS(WKWebView)를 추상화.',
        impact: 'HTML 서식 완벽 지원. 네이티브 렌더링 대비 성능 대폭 개선. 플랫폼별 동일한 API로 제어 가능.',
        icon: <BookMarked className="h-5 w-5" />,
      },
      {
        title: '서버 사이드 페이지 분할 알고리즘',
        problem: '클라이언트 CSS column 기반 페이지네이션은 기기마다 페이지 수가 달랐다. "나 지금 42페이지야"라는 대화가 기기 간에 성립하지 않았다.',
        approach: '페이지네이션을 서버로 이동. 클라이언트가 charsPerLine + linesPerPage를 전송하면, 서버가 HTML 콘텐츠를 블록 경계를 존중하며 분할.',
        solution: 'PageSplitService가 HTML을 파싱하여 태그를 제외한 실제 문자만 카운트. h2는 항상 새 페이지에서 시작. LRU 캐시(200개 엔트리)로 bookId|charsPerLine|linesPerPage 조합을 캐싱. thread-safe synchronized 블록으로 동시성 보장.',
        impact: '모든 기기에서 일관된 페이지 번호. 캐시 히트 시 즉시 반환.',
        icon: <Cpu className="h-5 w-5" />,
      },
      {
        title: '읽기 진행 저장 안정성 개선',
        problem: '사용자가 앱을 갑자기 종료하거나 화면을 이탈하면 읽기 진행률이 저장되지 않는 문제 발생.',
        approach: '로컬(DataStore) + 서버 이중 저장. 화면 이탈 시점에 서버 저장을 보장하는 메커니즘 필요.',
        solution: 'Compose의 DisposableEffect와 onDispose에서 서버 저장 호출. 스크롤 위치를 퍼센트(0.0~1.0)로 정규화하여 뷰포트에 독립적인 복원. 서버와 로컬 데이터 충돌 시 maxOf(localPage, serverPage) 정책.',
        impact: '어떤 상황에서도 읽기 진행률 유실 없음. 기기 변경 시에도 이어읽기 가능.',
        icon: <RefreshCw className="h-5 w-5" />,
      },
    ],
  },
  {
    category: 'Auth & Security',
    color: '#191f28',
    items: [
      {
        title: 'Google/Apple 멀티 프로바이더 인증',
        problem: 'Android는 Google Credential Manager, iOS는 네이티브 Apple Sign-In을 사용하는데, 두 플랫폼의 인증 흐름이 완전히 다르다.',
        approach: 'KMP의 expect/actual 패턴으로 AuthManager를 플랫폼별로 구현. 서버에서 각 프로바이더의 토큰을 독립적으로 검증.',
        solution: 'Google: tokeninfo API로 aud(audience) 검증. Apple: JWKS(JSON Web Key Set)에서 kid(Key ID)로 공개키를 찾아 JWT 서명을 RSA로 검증. Apple은 첫 로그인 시에만 이메일을 제공하므로, 인증 응답을 즉시 DB에 저장하는 로직을 최우선 배치.',
        impact: '두 플랫폼 모두 안전한 서버사이드 토큰 검증. Apple 이메일 유실 방지.',
        icon: <Lock className="h-5 w-5" />,
      },
      {
        title: '토큰 갱신 Race Condition 해결',
        problem: '홈 화면에서 5개 API를 병렬 호출. 토큰 만료 시 5개 모두 401을 받고, 5개 모두 토큰 갱신을 동시에 시도.',
        approach: 'Kotlin Coroutines Mutex로 갱신 로직을 직렬화. 첫 번째 요청만 실제 갱신, 나머지는 완료 대기 후 새 토큰으로 재시도.',
        solution: 'refreshMutex.withLock으로 보호. 잠금 획득 후 토큰 만료 여부를 재확인(double-check)하여 불필요한 갱신 방지. ApiClient 인터셉터에 내장하여 모든 API 호출에 자동 적용.',
        impact: '중복 갱신 요청 제로. 병렬 코루틴 환경에서 깔끔한 토큰 라이프사이클.',
        icon: <Shield className="h-5 w-5" />,
        code: {
          snippet: `private val refreshMutex = Mutex()
private suspend fun refreshTokenIfNeeded() {
  refreshMutex.withLock {
    if (tokenStillExpired()) {  // double-check
      val newToken = authApi.refresh(refreshToken)
      tokenStore.save(newToken)
    }
  }
}`,
          language: 'Kotlin (Coroutines)',
        },
      },
    ],
  },
  {
    category: 'Learning System',
    color: '#191f28',
    items: [
      {
        title: '받아쓰기(Dictation) 한국어 IME 문제 해결',
        problem: '받아쓰기 모드에서 한국어 키보드(IME)를 쓰면 자모가 분리되거나 입력이 씹히는 문제 발생. IME 조합(composition) 중에 상태가 커밋되면서 글자가 깨졌다.',
        approach: '문자 단위 입력 추적 시스템(List<Char?>)에서 IME 조합 상태를 별도로 관리. 조합 완료 시점에만 상태를 반영하도록 advance 로직 일원화.',
        solution: 'IME composition 이벤트를 감지하여 조합 중에는 상태 커밋을 지연. 아포스트로피/하이픈 같은 비문자는 자동 노출. 힌트 알고리즘: 틀린 글자 우선, 단어 길이에 따라 1~3개 힌트 제공. 다음 단어 전환 시 포커스를 첫 칸으로 초기화.',
        impact: '한국어/영어 키보드 모두 안정적인 입력. 3번의 연속 수정(커밋 3개)으로 최종 해결.',
        icon: <Keyboard className="h-5 w-5" />,
      },
      {
        title: 'RevenueCat 기반 Freemium 수익화',
        problem: 'Android(Google Play Billing)와 iOS(StoreKit 2)의 결제 흐름이 완전히 다르다. 프리미엄 상태를 일관되게 관리해야 한다.',
        approach: 'RevenueCat SDK로 크로스플랫폼 구독을 통합 관리. 프리미엄 판별을 3중 레이어로 설계.',
        solution: '3중 프리미엄 판별: (1) RevenueCat 구독 상태, (2) Admin 대시보드에서 수동 부여한 DB 프리미엄, (3) 서버 응답의 프리미엄 플래그. 셋 중 하나라도 true이면 프리미엄. 무료 도서 제한 수(free_book_limit)는 서버 Config에서 동적 관리.',
        impact: '플랫폼 독립적인 구독 관리. CS 대응 시 앱 재시작 없이 프리미엄 부여 가능.',
        icon: <Zap className="h-5 w-5" />,
      },
    ],
  },
  {
    category: 'Infrastructure',
    color: '#191f28',
    items: [
      {
        title: 'EC2 CI/CD 파이프라인 구축',
        problem: '수동 배포는 실수가 잦고 시간이 걸린다. Docker 빌드부터 EC2 배포까지 자동화가 필요했다.',
        approach: 'GitHub Actions 기반 파이프라인 설계. 환경 분리(local/prod)와 시크릿 관리.',
        solution: 'push to main → GitHub Actions → Docker 멀티스테이지 빌드 → GHCR 이미지 푸시 → EC2 SSH 접속 → docker pull + restart. Flyway로 DB 마이그레이션 자동 적용.',
        impact: 'git push 한 번으로 프로덕션 배포 완료. 환경별 설정 분리로 로컬/프로덕션 독립 운영.',
        icon: <Cloud className="h-5 w-5" />,
      },
      {
        title: 'Admin 대시보드 (Next.js)',
        problem: '도서 관리, 유저 관리, 태그 관리, 앱 설정을 CLI나 직접 DB 접근으로 하는 것은 비효율적.',
        approach: 'Next.js + Cloudflare Pages로 관리자 전용 웹 대시보드 구축. Cloudflare Access로 zero-trust 인증.',
        solution: '도서 CRUD + 콘텐츠 업로드, 유저별 읽기 통계 조회, AI 기반 태그 자동 추천(Gemini가 책 내용 기반 5개 태그 제안), 무료 도서 제한 수 등 앱 설정 실시간 변경, RevenueCat API 연동으로 프리미엄 수동 부여/해제.',
        impact: '서버 재시작 없이 앱 동작을 실시간 제어. 운영 효율 대폭 향상.',
        icon: <Monitor className="h-5 w-5" />,
      },
    ],
  },
] as const

const adrs = [
  {
    question: 'Flutter, React Native 대신 Kotlin Multiplatform을 선택한 이유',
    options: [
      { name: 'Flutter', rejected: true, reason: 'Dart 생태계, 네이티브 UI 아님, 백엔드(Kotlin)와 다른 언어' },
      { name: 'React Native', rejected: true, reason: 'JavaScript 브릿지 오버헤드, Kotlin 백엔드와 패러다임 불일치' },
      { name: 'Kotlin Multiplatform', rejected: false, reason: '' },
    ],
    decision: 'KMP는 네이티브 UI(Compose Multiplatform)를 사용하면서 80%+ 코드를 공유할 수 있다. Spring Boot 백엔드와 같은 언어를 쓰므로 도메인 모델, DTO, 유틸리티를 그대로 공유할 수 있다. expect/actual 패턴으로 인증, 결제 등 플랫폼 차이를 깔끔하게 처리.',
    tradeoff: 'iOS 결제 연동에 Swift 브릿지 필요 (RevenueCat SDK가 Swift 기반). Flutter보다 작은 커뮤니티. 하지만 "Kotlin Everywhere" 전략의 생산성 이점이 이 비용을 상회했다.',
  },
  {
    question: 'MVVM 대신 Orbit MVI를 선택한 이유',
    options: [
      { name: 'MVVM', rejected: true, reason: '복잡한 상태 흐름에서 여러 StateFlow 스트림이 추론하기 어려워짐' },
      { name: 'Redux/MVI (수동)', rejected: true, reason: '모바일 앱 대비 과도한 보일러플레이트' },
      { name: 'Orbit MVI', rejected: false, reason: '' },
    ],
    decision: '번역→저장→퀴즈 생성 같은 복잡한 상태 흐름에서 Intent 기반 단방향 데이터 흐름이 디버깅에 유리하다. Orbit의 Container DSL로 MVI 보일러플레이트를 거의 제로로 줄일 수 있다. SideEffect로 일회성 이벤트(토스트, 네비게이션)를 깔끔하게 처리.',
    tradeoff: 'MVI에 익숙하지 않은 컨트리뷰터에게 학습 곡선이 있다. 단순한 화면에서는 MVVM보다 약간 더 많은 코드가 필요하다. 하지만 디버깅 용이성과 상태 예측 가능성이 이를 상쇄.',
  },
  {
    question: 'Supabase를 버리고 Spring Boot 자체 서버로 전환한 이유',
    options: [
      { name: 'Supabase 유지', rejected: true, reason: 'Edge Function으로 복잡한 비즈니스 로직과 트랜잭션 처리 불가' },
      { name: 'Firebase', rejected: true, reason: 'NoSQL이 Book/Reading/Word 관계형 도메인 모델에 부적합' },
      { name: 'Spring Boot 4 + Kotlin', rejected: false, reason: '' },
    ],
    decision: '비즈니스 로직 완전 제어, JPA로 복잡한 쿼리 처리, 트랜잭션 경계 관리. RevenueCat 웹훅은 신뢰할 수 있는 서버 사이드 처리가 필수. 클라이언트와 서버 모두 Kotlin으로 통일된 개발 경험.',
    tradeoff: '인프라 운영 부담 증가 (Docker, EC2, CI/CD). Supabase 무료 티어 대비 호스팅 비용 증가. 하지만 프로덕션 수준의 안정성과 무제한 비즈니스 로직 확장성을 확보.',
  },
] as const

const timeline = [
  {
    version: '1.3',
    title: 'Orbit MVI + Widget-Section-Screen 아키텍처 전환',
    highlights: [
      '694줄 모놀리스 API → 5개 도메인 API 분리',
      '14개 Orbit MVI ViewModel (State + Intent + SideEffect)',
      '8개 Screen에서 19개 widget/section 파일 추출',
    ],
  },
  {
    version: '1.2',
    title: 'Supabase → Spring Boot 4 자체 서버 전환',
    highlights: [
      'Google/Apple 커스텀 인증 엔드포인트',
      'Flyway 마이그레이션 + Docker 멀티스테이지 빌드',
      'GitHub Actions CI/CD 파이프라인 구축',
    ],
  },
  {
    version: '1.1',
    title: 'Gemini AI 번역 엔진 도입',
    highlights: [
      '문맥 인식 번역 (전체 문장 컨텍스트 전달)',
      'JSON 파싱 실패 대비 2단계 폴백 구조',
      'Exponential backoff 재시도 (1초, 2초, 3초)',
    ],
  },
  {
    version: '1.0',
    title: 'KMP로 Android/iOS 동시 출시',
    highlights: [
      'commonMain 기반 80%+ 코드 공유',
      'RevenueCat 구독 결제 통합 (월간/연간/평생)',
      'Google Play + App Store 동시 배포',
    ],
  },
] as const

// ─── Main Component ───
export function ReadipShowcase() {
  const ACCENT = '#10b981'

  return (
    <main className="mx-auto max-w-6xl px-6 pb-32 pt-4 md:px-12 md:pt-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link
          href="/portfolio#projects"
          className="group inline-flex items-center gap-2 text-[13px] font-medium text-text-muted transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" style={{ color: ACCENT }} />
          BACK TO PROJECTS
        </Link>
      </motion.div>

      {/* ═══ HERO ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold tracking-[0.05em] text-text-muted">2026 —</span>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3182f6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3182f6] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3182f6]" />
            </span>
            운영중
          </span>
        </div>

        <h1 className="mt-2 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.05] text-text-primary">
          Readip
        </h1>
        <p className="mt-2 text-[20px] leading-relaxed text-text-secondary">
          AI 기반 영어 원서 읽기 + 어휘 학습 플랫폼
        </p>

        {/* Role + Links */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-bg-card px-4 py-2 text-[14px] font-semibold text-text-secondary">Full-Stack Developer</span>
          <span className="rounded-full bg-bg-card px-4 py-2 text-[14px] font-semibold text-text-secondary">1인 개발</span>
          <span className="rounded-full px-4 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: ACCENT }}>MOBILE APP</span>
        </div>

        {/* Image Carousel */}
        <ImageCarousel />

        {/* Metrics */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-bg-card/50 p-5 text-center">
              <p className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-text-primary">
                <CountUp end={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-1 text-[14px] font-bold text-text-primary">{m.label}</p>
              <p className="text-[13px] text-text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ═══ MOTIVATION ═══ */}
      <section className="mt-20">
        <SectionHeader label="Motivation" title="왜 만들었는가" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: <BookOpen className="h-5 w-5" />, title: '문맥 속 학습', desc: '단어장 암기는 기억에 남지 않는다. 원서를 읽으면서 문맥 속에서 만나는 단어가 진짜 내 것이 된다.' },
            { icon: <Brain className="h-5 w-5" />, title: 'AI 즉시 번역', desc: '"bank"가 은행인지 강둑인지, AI가 문맥을 보고 판단해준다. 사전을 찾는 시간을 없앴다.' },
            { icon: <Globe className="h-5 w-5" />, title: 'CEFR 레벨링', desc: '유럽 공통 언어 기준 A1~C2로 분류된 도서. 자기 수준에 맞는 책부터 시작할 수 있다.' },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-card text-text-secondary">
                {item.icon}
              </div>
              <h3 className="mt-3 text-[16px] font-bold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.8] text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ TECH STACK (Icon Style) ═══ */}
      <section className="mt-20">
        <SectionHeader label="Stack" title="기술 스택" />
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-0 md:divide-x md:divide-border md:justify-center">
          {([
            { label: 'Frontend', color: '#3B82F6', techs: ['Compose Multiplatform', 'Material 3', 'Orbit MVI', 'Koin', 'Ktor'] },
            { label: 'Backend', color: '#10B981', techs: ['Spring Boot 4', 'Kotlin', 'JPA', 'QueryDSL'] },
            { label: 'Infra', color: '#F59E0B', techs: ['PostgreSQL', 'AWS EC2', 'Docker', 'Next.js Admin'] },
          ] as const).map((category) => (
            <div key={category.label} className="px-6 first:pl-0 last:pr-0">
              <span className="text-[13px] font-bold" style={{ color: category.color }}>{category.label}</span>
              <div className="mt-3 flex flex-wrap gap-4">
                {category.techs.map((tech) => {
                  const skill = skillIconMap[tech]
                  const Icon = skill?.icon
                  const color = skill?.color || '#777'
                  return (
                    <div key={tech} className="flex flex-col items-center gap-1.5">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full border-2"
                        style={{ borderColor: color, backgroundColor: color + '12', color }}
                      >
                        {Icon ? <Icon className="h-[18px] w-[18px]" /> : <span className="text-[10px] font-bold">{tech.substring(0, 2)}</span>}
                      </div>
                      <span className="max-w-[75px] text-center text-[12px] font-semibold leading-tight text-text-secondary">{tech}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section className="mt-20">
        <SectionHeader label="Architecture" title="시스템 아키텍처" />
        <div className="mt-6">
          <ArchitectureDiagram />
        </div>
      </section>

      {/* ═══ ADR ═══ */}
      <section className="mt-20">
        <SectionHeader label="Decisions" title="기술 선택의 이유" />
        <p className="mt-2 text-[15px] text-text-muted">왜 이 기술을 선택했는가? 대안은 무엇이었는가?</p>
        <div className="mt-6 space-y-3">
          {adrs.map((adr, i) => (
            <ADRCard key={adr.question} adr={adr} index={i} />
          ))}
        </div>
      </section>

      {/* ═══ CHALLENGES (Categorized) ═══ */}
      <section className="mt-20">
        <SectionHeader label="Challenges" title="기술적 도전" />
        <p className="mt-2 text-[15px] text-text-muted">문제 인식 → 접근 방식 → 해결 → 결과</p>
        <div className="mt-8 space-y-10">
          {challengeCategories.map((cat) => (
            <div key={cat.category}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-1 w-6 rounded-full bg-text-primary" />
                <h3 className="text-[17px] font-bold text-text-primary">{cat.category}</h3>
                <span className="rounded-full bg-bg-card px-2.5 py-0.5 text-[12px] font-semibold text-text-muted">{cat.items.length}</span>
              </div>
              <div className="space-y-3">
                {cat.items.map((c, i) => (
                  <ChallengeCard key={c.title} challenge={c} index={i} accent={cat.color} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ METRICS ═══ */}
      <section className="mt-20">
        <SectionHeader label="Impact" title="핵심 성과" />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: <Smartphone className="h-5 w-5" />, value: '80%+', label: '코드 공유', desc: 'Android/iOS 단일 코드베이스' },
            { icon: <Layers className="h-5 w-5" />, value: '5', label: '도메인 분리', desc: 'Book, Reading, Word, Config, Account' },
            { icon: <Zap className="h-5 w-5" />, value: '200', label: 'LRU 캐시', desc: '페이지 분할 캐싱' },
            { icon: <GitBranch className="h-5 w-5" />, value: '14', label: 'ViewModel', desc: 'Orbit MVI 상태 관리' },
            { icon: <Shield className="h-5 w-5" />, value: '3중', label: '프리미엄 판별', desc: 'RevenueCat + DB + 서버 플래그' },
            { icon: <Globe className="h-5 w-5" />, value: '2', label: '앱스토어 배포', desc: 'Google Play + App Store' },
          ].map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border p-5 text-center"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-bg-card text-text-secondary">{m.icon}</div>
              <p className="mt-3 text-[24px] font-bold text-text-primary">{m.value}</p>
              <p className="text-[13px] font-semibold text-text-primary">{m.label}</p>
              <p className="text-[12px] text-text-muted">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ EVOLUTION ═══ */}
      <section className="mt-20">
        <SectionHeader label="Evolution" title="프로젝트 진화" />
        <div className="mt-8">
          {timeline.map((item, i) => (
            <TimelineItem
              key={item.version}
              version={item.version}
              title={item.title}
              highlights={item.highlights}
              index={i}
              isLast={i === timeline.length - 1}
            />
          ))}
        </div>
      </section>

      {/* ═══ LINKS ═══ */}
      <section className="mt-20">
        <SectionHeader label="Links" title="프로젝트 링크" />
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: 'GitHub', href: 'https://github.com/Readip/Readip-workspace', icon: <Github className="h-4 w-4" /> },
            { label: 'Google Play', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
            { label: 'App Store', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
            { label: 'Admin Dashboard', href: '#', icon: <ExternalLink className="h-4 w-4" /> },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 text-[15px] font-semibold text-text-secondary transition-all hover:border-text-primary hover:bg-bg-card hover:text-text-primary"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* ═══ DEMO BADGE ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-text-primary px-4 py-2 text-[12px] font-medium text-bg shadow-lg"
      >
        DEMO — Portfolio V2
      </motion.div>
    </main>
  )
}
