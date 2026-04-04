'use client'

import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { ReactFlow, Handle, Position, MarkerType, type Node, type Edge } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import '@xyflow/react/dist/style.css'

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

const ModalCtx = createContext<(d: ModalData) => void>(() => {})

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

// ─── Mobile Timeline ─────────────────────────────────────

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

function TimelineConnector({ variant = 'default' }: { variant?: 'default' | 'branch-start' | 'branch-end' | 'emerald' | 'blue' }) {
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

function TimelineCard({ step, index, isLast }: { step: PipelineStepData; index: number; isLast?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const numColors: Record<string, { bg: string; text: string }> = {
    ai: { bg: 'bg-text-primary', text: 'text-bg' },
    'branch-a': { bg: 'bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400' },
    'branch-b': { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400' },
    branch: { bg: 'bg-bg-card', text: 'text-text-muted' },
    default: { bg: 'bg-bg-card', text: 'text-text-muted' },
  }
  const nc = numColors[step.variant] || numColors.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className={`rounded-2xl border bg-bg p-5 ${
        step.variant === 'branch-a' ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20' :
        step.variant === 'branch-b' ? 'border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/20' :
        step.variant === 'branch' ? 'border-dashed border-border' :
        'border-border'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          {step.num && (
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold ${nc.bg} ${nc.text}`}>
              {step.num}
            </span>
          )}
          <VariantBadge variant={step.variant} badge={step.badge} sub={step.sub} />
        </div>
        <p className="text-[18px] font-bold text-text-primary leading-tight">{step.title}</p>
        <p className="mt-1.5 text-[14px] text-text-secondary leading-relaxed">{step.desc}</p>
        {step.detail && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="mt-3 flex items-center gap-1 rounded-lg bg-bg-card px-3 py-1.5 text-[13px] font-semibold text-text-muted hover:text-text-secondary transition-colors"
            >
              {expanded ? '접기' : '더보기'}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
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
                  <div className="mt-3 rounded-xl bg-[#1a1a2e] p-4 overflow-x-auto">
                    <pre className="text-[13px] leading-[1.7] text-[#e2e8f0] font-mono whitespace-pre">{step.detail}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
      {!isLast && <TimelineConnector />}
    </motion.div>
  )
}

// Stable ordered list for mobile timeline rendering
const MOBILE_ORDER: PipelineStepData[] = [
  STEPS[0], STEPS[1], STEPS[2],  // 01, 02, 03
  STEPS[3],                       // 04 branch point
  STEPS[4],                       // a12 branch-a
  STEPS[5],                       // b1 branch-b
  STEPS[6], STEPS[7], STEPS[8], STEPS[9], // 05-08
]

function MobileTimeline() {
  return (
    <div className="space-y-0">
      {/* Steps 01-03 */}
      {MOBILE_ORDER.slice(0, 3).map((step, i) => (
        <TimelineCard key={step.id} step={step} index={i} />
      ))}

      {/* Step 04: Branch point */}
      <TimelineCard step={MOBILE_ORDER[3]} index={3} isLast />
      <TimelineConnector variant="branch-start" />

      {/* Branch A: A1/A2 */}
      <TimelineCard step={MOBILE_ORDER[4]} index={4} isLast />
      <div className="flex justify-center py-0.5">
        <span className="text-[12px] font-semibold text-text-muted tracking-wider">OR</span>
      </div>
      {/* Branch B: B1+ */}
      <TimelineCard step={MOBILE_ORDER[5]} index={5} isLast />

      {/* Merge */}
      <TimelineConnector variant="branch-end" />

      {/* Steps 05-08 */}
      {MOBILE_ORDER.slice(6).map((step, i) => (
        <TimelineCard key={step.id} step={step} index={6 + i} isLast={i === 3} />
      ))}
    </div>
  )
}

// ─── Desktop ReactFlow ───────────────────────────────────

function PipelineNode({ data }: { data: PipelineStepData & { handles: string } }) {
  const openModal = useContext(ModalCtx)
  const { num, title, desc, variant, badge, sub, detail, handles } = data
  const styles: Record<string, { border: string; bg: string; numBg: string; numText: string }> = {
    ai: { border: 'border-text-primary', bg: 'bg-bg', numBg: 'bg-text-primary', numText: 'text-bg' },
    branch: { border: 'border-dashed border-text-muted/25', bg: 'bg-bg-card/50', numBg: 'bg-bg-card', numText: 'text-text-muted' },
    'branch-a': { border: 'border-emerald-500/50', bg: 'bg-emerald-50 dark:bg-emerald-950/30', numBg: 'bg-emerald-500/15', numText: 'text-emerald-600 dark:text-emerald-400' },
    'branch-b': { border: 'border-blue-500/50', bg: 'bg-blue-50 dark:bg-blue-950/30', numBg: 'bg-blue-500/15', numText: 'text-blue-600 dark:text-blue-400' },
    default: { border: 'border-border', bg: 'bg-bg', numBg: 'bg-bg-card', numText: 'text-text-muted' },
  }
  const s = styles[variant] || styles.default
  const h = handles ? handles.split(',') : []
  return (
    <>
      {h.includes('tl') && <Handle type="target" position={Position.Left} id="tl" className="!w-2 !h-2 !bg-text-muted !border-0" />}
      {h.includes('tt') && <Handle type="target" position={Position.Top} id="tt" className="!w-2 !h-2 !bg-text-muted !border-0" />}
      {h.includes('sr') && <Handle type="source" position={Position.Right} id="sr" className="!w-2 !h-2 !bg-text-muted !border-0" />}
      {h.includes('sb') && <Handle type="source" position={Position.Bottom} id="sb" className="!w-2 !h-2 !bg-text-muted !border-0" />}
      <div className={`rounded-2xl border-2 ${s.border} ${s.bg} px-7 py-6 w-[380px] shadow-sm`}>
        <div className="flex items-center gap-3 flex-wrap">
          {num && <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.numBg} text-[15px] font-bold ${s.numText}`}>{num}</span>}
          {badge && <span className={`rounded-full px-3.5 py-1 text-[14px] font-bold ${variant === 'branch-a' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : variant === 'branch-b' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' : 'bg-text-primary/8 text-text-primary'}`}>{badge}</span>}
          {sub && <span className="text-[14px] text-text-muted">{sub}</span>}
        </div>
        <p className="mt-3 text-[24px] font-bold text-text-primary leading-tight">{title}</p>
        <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{desc}</p>
        {detail && (
          <button
            onClick={() => openModal({ title, badge: badge || '', detail })}
            className="mt-4 rounded-xl bg-bg-card px-4 py-2 text-[13px] font-semibold text-text-muted hover:bg-bg-card-hover hover:text-text-primary transition-all"
          >
            더보기
          </button>
        )}
      </div>
    </>
  )
}

const nodeTypes = { pipeline: PipelineNode }

// ─── Layout (pure const) ────────────────────────────────

const W = 380
const GAP = 60
const VGAP = 80
const CX = (W * 3 + GAP * 2 - W) / 2

const r1 = 0
const r2 = r1 + 220 + VGAP
const r3 = r2 + 180 + VGAP
const r4 = r3 + 220 + VGAP
const r5 = r4 + 200 + VGAP
const r6 = r5 + 200 + VGAP
const r7 = r6 + 180 + VGAP

const nodes: Node[] = [
  { id: '01', position: { x: 0, y: r1 }, data: { ...STEPS[0], handles: 'sr' }, type: 'pipeline' },
  { id: '02', position: { x: W + GAP, y: r1 }, data: { ...STEPS[1], handles: 'tl,sr' }, type: 'pipeline' },
  { id: '03', position: { x: (W + GAP) * 2, y: r1 }, data: { ...STEPS[2], handles: 'tl,sb' }, type: 'pipeline' },
  { id: '04', position: { x: CX, y: r2 }, data: { ...STEPS[3], handles: 'tt,sb' }, type: 'pipeline' },
  { id: 'a12', position: { x: 0, y: r3 }, data: { ...STEPS[4], handles: 'tt,sb' }, type: 'pipeline' },
  { id: 'b1', position: { x: (W + GAP) * 2, y: r3 }, data: { ...STEPS[5], handles: 'tt,sb' }, type: 'pipeline' },
  { id: '05', position: { x: CX, y: r4 }, data: { ...STEPS[6], handles: 'tt,sb' }, type: 'pipeline' },
  { id: '06', position: { x: CX, y: r5 }, data: { ...STEPS[7], handles: 'tt,sb' }, type: 'pipeline' },
  { id: '07', position: { x: CX, y: r6 }, data: { ...STEPS[8], handles: 'tt,sb' }, type: 'pipeline' },
  { id: '08', position: { x: CX, y: r7 }, data: { ...STEPS[9], handles: 'tt' }, type: 'pipeline' },
]

const solid = { stroke: '#d0d0d0', strokeWidth: 2.5 }
const arrow = { type: MarkerType.ArrowClosed as const, color: '#c0c0c0', width: 22, height: 22 }
const gDash = { stroke: '#10b981', strokeWidth: 2.5, strokeDasharray: '8 4' }
const gArrow = { type: MarkerType.ArrowClosed as const, color: '#10b981', width: 22, height: 22 }
const bDash = { stroke: '#3B82F6', strokeWidth: 2.5, strokeDasharray: '8 4' }
const bArrow = { type: MarkerType.ArrowClosed as const, color: '#3B82F6', width: 22, height: 22 }

const edges: Edge[] = [
  { id: 'e01-02', source: '01', sourceHandle: 'sr', target: '02', targetHandle: 'tl', type: 'smoothstep', style: solid, markerEnd: arrow },
  { id: 'e02-03', source: '02', sourceHandle: 'sr', target: '03', targetHandle: 'tl', type: 'smoothstep', style: solid, markerEnd: arrow },
  { id: 'e03-04', source: '03', sourceHandle: 'sb', target: '04', targetHandle: 'tt', type: 'smoothstep', style: solid, markerEnd: arrow },
  { id: 'e04-a', source: '04', sourceHandle: 'sb', target: 'a12', targetHandle: 'tt', type: 'default', animated: true, style: gDash, markerEnd: gArrow },
  { id: 'e04-b', source: '04', sourceHandle: 'sb', target: 'b1', targetHandle: 'tt', type: 'default', animated: true, style: bDash, markerEnd: bArrow },
  { id: 'ea-05', source: 'a12', sourceHandle: 'sb', target: '05', targetHandle: 'tt', type: 'default', animated: true, style: gDash, markerEnd: gArrow },
  { id: 'eb-05', source: 'b1', sourceHandle: 'sb', target: '05', targetHandle: 'tt', type: 'default', animated: true, style: bDash, markerEnd: bArrow },
  { id: 'e05-06', source: '05', sourceHandle: 'sb', target: '06', targetHandle: 'tt', type: 'smoothstep', style: solid, markerEnd: arrow },
  { id: 'e06-07', source: '06', sourceHandle: 'sb', target: '07', targetHandle: 'tt', type: 'smoothstep', style: solid, markerEnd: arrow },
  { id: 'e07-08', source: '07', sourceHandle: 'sb', target: '08', targetHandle: 'tt', type: 'smoothstep', style: solid, markerEnd: arrow },
]

// ─── Exported Component ──────────────────────────────────

export function ContentPipelineFlow() {
  const [modal, setModal] = useState<ModalData | null>(null)
  const openModal = useCallback((d: ModalData) => setModal(d), [])

  return (
    <ModalCtx.Provider value={openModal}>
      {/* Mobile: vertical timeline */}
      <div className="md:hidden">
        <MobileTimeline />
      </div>

      {/* Desktop: ReactFlow diagram (static, no internal scroll/pan) */}
      <div className="hidden md:block h-[1600px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent"
        />
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modal && <DetailModal key="detail-modal" data={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </ModalCtx.Provider>
  )
}
