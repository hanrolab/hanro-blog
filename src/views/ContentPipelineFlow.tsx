'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ArrowRight, ArrowDown } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────

type NodeVariant = 'default' | 'ai' | 'branch' | 'branch-a' | 'branch-b'

interface PipelineStepData {
  id: string
  num?: string
  title: string
  desc: string
  variant: NodeVariant
  badge?: string
  sub?: string
  detail?: string
}

interface ModalData {
  title: string
  badge?: string
  detail: string
}

// ─── Shared Step Data ────────────────────────────────────

const STEPS: PipelineStepData[] = [
  { id: '01', num: '01', title: '원서 수집', variant: 'default', desc: 'Standard Ebooks 퍼블릭 도메인 원서 다운로드. XHTML → Clean HTML 변환.', detail: `curl -o /tmp/raw.xhtml "https://standardebooks.org/ebooks/{author}/{title}/text/single-page"\n\n허용 태그: h2, p, em, i, blockquote, br\n제거: epub:type, section, span, abbr` },
  { id: '02', num: '02', title: 'CEFR 분석', variant: 'ai', badge: 'AI', desc: '단어 수 + 내용 난이도 기반 CEFR 레벨 및 장르 자동 판단.', detail: `단편 (~3,500w) → A1/A2\n장편 (5,000w+) → B1 이상\n\n장르 11종: thriller, romance, fantasy, classic, sci-fi, mystery, coming-of-age, adventure, slice-of-life, horror, historical` },
  { id: '03', num: '03', title: 'info.md', variant: 'default', desc: '제목(EN/KO), 작가, CEFR, 장르, 소개, 커버 AI 프롬프트.', detail: `# Title (한국어제목)\n| **작가** | Author |\n| **CEFR** | A2 |\n| **장르** | romance |\n\n## 책 소개 (EN) / (KO)\n## 커버 이미지 AI 프롬프트` },
  { id: '04', num: '04', title: 'CEFR 분기', variant: 'branch', desc: 'CEFR 레벨에 따라 리라이팅 여부 결정.', detail: `A1/A2 + 단편 → Claude AI 리라이팅\nB1+ → 원문 그대로\n\n예외: 원문이 쉬우면 리라이팅 생략 가능` },
  { id: 'a12', title: 'Claude AI 리라이팅', variant: 'branch-a', badge: 'A1/A2', sub: '단편 ~3,500w', desc: '쉬운 단어/짧은 문장으로 다시 작성. 원문 스토리 100% 유지.', detail: `1. HTML 태그: <h2>, <p>, <em>\n2. em dash 금지 → 쉼표\n3. 원문 스토리 100% 유지\n4. → en.html (본문만)\n\n주의: 원문 em dash는 삭제 금지` },
  { id: 'b1', title: '원문 그대로 사용', variant: 'branch-b', badge: 'B1+', sub: '장편 5,000w+', desc: 'XHTML → Clean HTML 변환만. 문학적 표현 보존.', detail: `<h2 epub:type="ordinal">I</h2> → <h2>I</h2>\n<abbr>Mr.</abbr> → Mr.\n\n원문 em dash 보존 (삭제 금지)\nMr. ——, 18— 등 유지` },
  { id: '05', num: '05', title: '커버 생성', variant: 'ai', badge: 'Gemini', desc: 'info.md 프롬프트 기반 AI 커버 이미지. WebP 2:3.', detail: `python3 generate_covers.py {path}\n\n1. info.md 프롬프트 추출\n2. Gemini API 호출\n3. Base64 → PIL → WebP (q=85)\n4. 2:3 세로 비율` },
  { id: '06', num: '06', title: '한국어 번역', variant: 'ai', badge: 'Claude Opus', desc: '5~6K 청크 N개 에이전트 병렬. HTML 태그 100% 유지.', detail: `반드시 Opus 모델\n1. en.html → N파트 (5~6K)\n2. 병렬 번역 → 합치기\n\nHTML 태그 절대 변경 금지\nem dash → 쉼표\n<h2> 챕터 제목도 번역` },
  { id: '07', num: '07', title: '검증', variant: 'default', desc: 'HTML 태그 구조, em dash, 헤딩, 문장 잘림 검사.', detail: `☑ HTML 태그 en=ko 일치\n☑ em dash 없는지\n☑ 헤딩 한국어 번역\n☑ blockquote/em 유지\n☑ info.md 장르/한국어 제목\n☑ 문장 잘림/깨짐` },
  { id: '08', num: '08', title: '배포', variant: 'ai', desc: 'R2 커버 + PostgreSQL → SSH 프로덕션 동기화 → API 검증.', detail: `upload_books.py --target {path}\n\n1. R2 커버 업로드\n2. PostgreSQL INSERT\n3. SSH → 프로덕션 DB 동기화\n4. API 검증 (curl)` },
]

// ─── Detail Modal ────────────────────────────────────────

function DetailModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl rounded-2xl bg-bg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-[22px] font-bold text-text-primary">{data.title}</h3>
            {data.badge && <span className="rounded-full bg-text-primary/8 px-3 py-1 text-[13px] font-bold text-text-primary">{data.badge}</span>}
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-card transition-colors">
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>
        <div className="p-6">
          <div className="rounded-xl bg-[#1a1a2e] p-5 overflow-x-auto">
            <pre className="text-[14px] leading-[1.8] text-[#e2e8f0] font-mono whitespace-pre">{data.detail}</pre>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

// ─── Shared Components ───────────────────────────────────

function VariantBadge({ variant, badge, sub }: { variant: NodeVariant; badge?: string; sub?: string }) {
  const colors: Record<string, string> = {
    ai: 'bg-text-primary text-bg',
    'branch-a': 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    'branch-b': 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    default: 'bg-bg-card text-text-muted',
    branch: 'bg-bg-card text-text-muted',
  }
  if (!badge) return null
  return (
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-3 py-0.5 text-[13px] font-bold ${colors[variant] || colors.default}`}>{badge}</span>
      {sub && <span className="text-[13px] text-text-muted">{sub}</span>}
    </div>
  )
}

function StepCard({ step, onDetail, size = 'md' }: { step: PipelineStepData; onDetail?: (d: ModalData) => void; size?: 'sm' | 'md' }) {
  const numColors: Record<string, { bg: string; text: string }> = {
    ai: { bg: 'bg-text-primary', text: 'text-bg' },
    'branch-a': { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
    'branch-b': { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
    branch: { bg: 'bg-bg-card', text: 'text-text-muted' },
    default: { bg: 'bg-bg-card', text: 'text-text-muted' },
  }
  const nc = numColors[step.variant] || numColors.default
  const isSmall = size === 'sm'

  return (
    <div className={`rounded-2xl border bg-bg ${isSmall ? 'p-4' : 'p-5'} ${
      step.variant === 'branch-a' ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20' :
      step.variant === 'branch-b' ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20' :
      step.variant === 'branch' ? 'border-dashed border-border' :
      'border-border'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        {step.num && (
          <span className={`inline-flex ${isSmall ? 'h-7 w-7 text-[12px]' : 'h-8 w-8 text-[13px]'} items-center justify-center rounded-lg font-bold ${nc.bg} ${nc.text}`}>
            {step.num}
          </span>
        )}
        <VariantBadge variant={step.variant} badge={step.badge} sub={step.sub} />
      </div>
      <p className={`${isSmall ? 'text-[16px]' : 'text-[18px]'} font-bold text-text-primary leading-tight`}>{step.title}</p>
      <p className={`mt-1.5 ${isSmall ? 'text-[13px]' : 'text-[14px]'} text-text-secondary leading-relaxed`}>{step.desc}</p>
      {step.detail && onDetail && (
        <button
          onClick={() => onDetail({ title: step.title, badge: step.badge || '', detail: step.detail! })}
          className={`mt-3 rounded-lg bg-bg-card px-3 py-1.5 ${isSmall ? 'text-[12px]' : 'text-[13px]'} font-semibold text-text-muted hover:text-text-secondary transition-colors`}
        >
          더보기
        </button>
      )}
    </div>
  )
}

function VerticalArrow() {
  return (
    <div className="flex justify-center py-2">
      <ArrowDown className="h-5 w-5 text-text-muted/50" />
    </div>
  )
}

// ─── Mobile Timeline ─────────────────────────────────────

function TimelineConnector({ variant = 'default' }: { variant?: 'default' | 'branch-start' | 'branch-end' }) {
  if (variant === 'branch-start') {
    return (
      <div className="flex justify-center py-1">
        <div className="flex items-center gap-1">
          <div className="h-6 w-0.5 rotate-[20deg] border-l-2 border-dashed border-emerald-400" />
          <div className="h-6 w-0.5 border-l-2 border-dashed border-border" />
          <div className="h-6 w-0.5 -rotate-[20deg] border-l-2 border-dashed border-blue-400" />
        </div>
      </div>
    )
  }
  if (variant === 'branch-end') {
    return (
      <div className="flex justify-center py-1">
        <div className="flex items-center gap-1">
          <div className="h-6 w-0.5 -rotate-[20deg] border-l-2 border-dashed border-emerald-400" />
          <div className="h-6 w-0.5 border-l-2 border-dashed border-border" />
          <div className="h-6 w-0.5 rotate-[20deg] border-l-2 border-dashed border-blue-400" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center py-1">
      <div className="h-8 w-0.5 bg-border" />
    </div>
  )
}

function MobileTimelineCard({ step, index, isLast }: { step: PipelineStepData; index: number; isLast?: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <StepCard step={step} size="sm" />
      {step.detail && (
        <div className="mt-1 ml-2">
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-semibold text-text-muted hover:text-text-secondary transition-colors"
          >
            {expanded ? '접기' : '더보기'}
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-1 rounded-xl bg-[#1a1a2e] p-3 overflow-x-auto">
                  <pre className="text-[12px] leading-[1.7] text-[#e2e8f0] font-mono whitespace-pre">{step.detail}</pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {!isLast && <TimelineConnector />}
    </motion.div>
  )
}

function MobileTimeline() {
  return (
    <div className="space-y-0">
      {STEPS.slice(0, 3).map((step, i) => (
        <MobileTimelineCard key={step.id} step={step} index={i} />
      ))}
      <MobileTimelineCard step={STEPS[3]} index={3} isLast />
      <TimelineConnector variant="branch-start" />
      <MobileTimelineCard step={STEPS[4]} index={4} isLast />
      <div className="flex justify-center py-0.5">
        <span className="text-[12px] font-semibold text-text-muted tracking-wider">OR</span>
      </div>
      <MobileTimelineCard step={STEPS[5]} index={5} isLast />
      <TimelineConnector variant="branch-end" />
      {STEPS.slice(6).map((step, i) => (
        <MobileTimelineCard key={step.id} step={step} index={6 + i} isLast={i === 3} />
      ))}
    </div>
  )
}

// ─── Desktop Layout (Pure CSS) ───────────────────────────

function DesktopPipeline({ onDetail }: { onDetail: (d: ModalData) => void }) {
  return (
    <div className="space-y-0">
      {/* Row 1: 01 → 02 → 03 (horizontal) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <div className="flex-1"><StepCard step={STEPS[0]} onDetail={onDetail} /></div>
        <ArrowRight className="h-5 w-5 text-text-muted/40 shrink-0" />
        <div className="flex-1"><StepCard step={STEPS[1]} onDetail={onDetail} /></div>
        <ArrowRight className="h-5 w-5 text-text-muted/40 shrink-0" />
        <div className="flex-1"><StepCard step={STEPS[2]} onDetail={onDetail} /></div>
      </motion.div>

      <VerticalArrow />

      {/* Row 2: 04 분기 (centered) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-md mx-auto"
      >
        <StepCard step={STEPS[3]} onDetail={onDetail} />
      </motion.div>

      {/* Branch split indicator */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-6">
          <div className="h-8 w-0.5 rotate-[25deg] border-l-2 border-dashed border-emerald-400" />
          <div className="h-8 w-0.5 -rotate-[25deg] border-l-2 border-dashed border-blue-400" />
        </div>
      </div>

      {/* Row 3: Branches side by side */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 gap-6"
      >
        <StepCard step={STEPS[4]} onDetail={onDetail} />
        <StepCard step={STEPS[5]} onDetail={onDetail} />
      </motion.div>

      {/* Branch merge indicator */}
      <div className="flex justify-center py-3">
        <div className="flex items-center gap-6">
          <div className="h-8 w-0.5 -rotate-[25deg] border-l-2 border-dashed border-emerald-400" />
          <div className="h-8 w-0.5 rotate-[25deg] border-l-2 border-dashed border-blue-400" />
        </div>
      </div>

      {/* Row 4-7: 05 → 06 → 07 → 08 (centered vertical) */}
      {STEPS.slice(6).map((step, i) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
        >
          <div className="max-w-md mx-auto">
            <StepCard step={step} onDetail={onDetail} />
          </div>
          {i < 3 && <VerticalArrow />}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Exported Component ──────────────────────────────────

export function ContentPipelineFlow() {
  const [modal, setModal] = useState<ModalData | null>(null)

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <MobileTimeline />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopPipeline onDetail={setModal} />
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modal && <DetailModal key="detail-modal" data={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}
