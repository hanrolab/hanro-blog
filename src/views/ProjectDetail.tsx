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
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-transparent transition-colors duration-200 hover:border-border/40">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center gap-4 px-4 py-4 text-left"
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${openIndex === i ? 'bg-text-primary' : 'bg-bg-card'}`}>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-bg' : 'text-text-muted'}`} />
            </div>
            <span className="text-[17px] leading-[1.6] text-text-primary">{item.title}</span>
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
                <div className="mx-4 mb-4 ml-[60px] rounded-lg border border-border/40 bg-bg-card px-6 py-5 text-[15px] leading-[1.9] text-text-primary whitespace-pre-line">
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


const highlightContentData: Record<string, Record<string, string>> = {
  'mungnyanglog': {
    'Firebase OAuth 인증 (Google / Apple)': '글로벌 시장 진출을 위해 카카오/네이버를 제외하고 Google, Apple 로그인만 채택.\n\n클라이언트에서 Firebase로 인증 후 ID Token을 서버에 전송하면, 서버는 Firebase Admin SDK로 토큰을 검증하는 구조입니다. 토큰 갱신, 세션 유지, 로그아웃 처리는 Firebase Auth에 위임하여 인증 로직을 단순화했습니다.\n\n에러 핸들링은 서버에서 커스텀 에러 코드만 반환하고, 클라이언트에서 다국어 토스트 메시지로 파싱하는 구조로 글로벌 대응했습니다.\n\n회원 탈퇴는 30일 유예 기간을 두고, 매일 새벽 스케줄러가 탈퇴 신청 후 30일이 지난 유저를 확인하여 관련 데이터를 삭제합니다. 관련 데이터는 탈퇴자 ID를 쿼리에서 필터링하는 방식으로, 대량 soft delete 없이 효율적으로 처리했습니다.',
    '가족 그룹 생성 / 초대 / 권한 관리': '초대 코드(대문자, I, 1 제외), 링크, 이메일, 카카오톡 공유 4가지 방식으로 가족을 초대합니다. 초대 코드는 24시간 만료이며, 클라이언트에서 타이머를 표시하고 만료 시 재발급 UI를 노출합니다. 캐시 없이 항상 서버 조회하여 모든 구성원이 동일한 상태를 봅니다.\n\n권한은 읽기/쓰기/삭제의 다중 권한 구조이며, Admin만 권한 조작이 가능합니다. 영유아 등 가족 구성원의 잘못된 조작을 방지하기 위해 삭제/수정 권한을 제한했습니다. 게스트 모드는 펫시터 등 임시 접근용으로, 실시간 산책 추적을 허용하면서도 데이터 수정은 차단합니다.\n\n그룹 탈퇴 시 본인이 작성한 데이터는 유지되지만 가족 그룹에서는 비노출 처리합니다. Owner는 모든 구성원이 탈퇴해야만 그룹을 삭제할 수 있습니다. DB는 그룹-유저 N:N 관계이며, FK 없이 ID 참조 방식으로 설계했습니다.',
    'GPS 실시간 산책 추적 (경로 시각화, 거리/시간)': 'Android는 Google Maps SDK, iOS는 MapKit으로 플랫폼별 지도를 구현하고, 칼만 필터(Kalman Filter)로 GPS 노이즈를 보정하여 경로 튀김을 최소화했습니다.\n\n위치 수집은 10초 간격 또는 10m 이상 이동 시 트리거되며, 사람의 보행/달리기 속도 범위를 벗어나는 이동(차량 등)은 필터링합니다. 백그라운드에서도 위치 추적이 동작하며, 수집 간격을 조정하여 배터리 소모를 줄였습니다.\n\n산책 시작 시 KMP DataStore에 로컬 저장을 시작하고, 중간중간 위도/경도를 누적 저장합니다. 폴리라인으로 실시간 경로를 시각화하며, 1km 마일스톤 달성 시 지도에 마커를 표시합니다. 비정상 종료 시에도 DataStore에서 복구하여 데이터 유실을 방지합니다. 1분 미만 산책은 저장하지 않습니다.\n\n산책 중 사진 촬영, 배변 기록, 메모를 남길 수 있으며, 종료 시 요약 화면에서 전체 기록을 확인하고, 산책 경로가 가족 게시글에 자동 업로드됩니다. 경로 데이터는 전부 서버에 저장하여 향후 AI 분석 데이터로 활용할 수 있도록 설계했습니다.\n\n가장 어려웠던 점은 GPS 경로 보정이었습니다. 초기에는 경로가 갑자기 50m씩 튀거나, 제자리에서 빙글빙글 도는 현상이 심했습니다. 필터를 강하게 걸면 폴리라인이 실시간으로 그려지지 않아 답답했고, 약하게 걸면 경로가 튀었습니다. 칼만 필터를 적용하여 상당 부분 개선했지만, 통신 환경에 따라 완벽하지는 않았습니다.',
    'GCP Signed URL 미디어 보안': '가족 간 공유되는 반려동물 사진이 외부에 유출되지 않도록 GCP Cloud Storage + Signed URL(15분 만료)로 접근을 제한했습니다. 프로필, 게시글, 산책 사진 등 용도별로 버킷을 분리하고, 서버에서 접근 URL을 캐시 처리하여 반복 요청을 줄였습니다.\n\n초기에는 서버에서 이미지 리사이징을 처리했으나, 한 장당 최대 10MB x 10장 = 100MB를 서버로 전송하는 구조가 너무 느렸습니다. 이를 클라이언트에서 리사이징(80% 압축) 후 병렬 업로드하는 방식으로 전환하여 속도를 대폭 개선했습니다. 서버는 Signed URL 발급과 접근 경로(버킷 + ID + 타임스탬프) 관리만 담당합니다.\n\n클라이언트에서는 Coil 라이브러리로 이미지를 캐싱하고, 업로드 시 병렬 처리 후 정상 응답을 받으면 즉시 사용자에게 노출하여 UX를 최적화했습니다.',
    'FCM 푸시 알림 + 딥링크 네비게이션': 'Spring Boot + Firebase Admin SDK로 가족 그룹 가입, 게시글 작성, 산책 완료, 결제 완료 등의 이벤트에 푸시 알림을 발송합니다. 알림 카테고리별 ON/OFF 설정을 제공하며, 포그라운드에서도 상단에 알림이 표시됩니다.\n\n푸시 토큰은 FCM 특성상 계속 변경되기 때문에, 로그인 성공 시와 자동 로그인(스플래시) 시 두 시점에서 토큰을 업데이트합니다. 로그인 시에는 클라이언트에서 서버로 토큰을 전송하는 타이밍에 저장하고, 자동 로그인 시에는 스플래시 단계에서 갱신합니다.\n\n가장 어려웠던 점은 데이터 정합성이었습니다. 가족 초대 알림을 포그라운드에서 눌러 진입했는데 가족 그룹 정보가 보이지 않는 문제가 있었고, 원인은 클라이언트 캐시였습니다. 이후 캐시 초기화 공통 유틸 함수를 만들어 알림 진입 시 항상 최신 데이터를 조회하도록 개선했습니다.',
    'Spring AI Function Calling 기반 AI 펫 상담사': 'Gemini 2.5 Flash 모델을 활용한 AI 펫 상담사입니다. 반려동물을 선택하면 산책 기록, 건강검진 이력, 예방접종 일정, 병원 스케줄 등 해당 반려동물의 전체 데이터를 기반으로 자연어 질의응답이 가능합니다.\n\nSpring AI Function Calling으로 건강검진별, 산책별, 권한별 등 카테고리별 프롬프트를 세분화하여 응답 정확도를 높였습니다.\n\n가장 어려웠던 점은 서버 데이터가 필요 없는 일반 질문에서 AI 응답 품질이 떨어지는 문제였습니다. 서버에서 동일한 Function Calling을 반복 호출하면서 불필요한 응답을 생성했기 때문입니다. 이를 해결하기 위해 클라이언트에도 같은 모델을 탑재하고, 질문이 서버 데이터가 필요한지 클라이언트에서 먼저 판별하도록 했습니다. 서버 데이터가 불필요하면 클라이언트에서 바로 응답하고, 필요하면 서버 API를 호출하는 2단계 구조로 개선하여 응답 속도와 품질을 모두 높였습니다.',
    '가족 범위 게시글 공유 (사진/미디어, 펫 태깅)': '가족 구성원만 볼 수 있는 게시글 피드입니다. 사진과 텍스트를 올릴 수 있으며, 산책 완료 시 산책 경로가 자동으로 게시글에 업로드됩니다. 반려동물을 다중 태깅할 수 있어 펫별로 기록을 모아볼 수 있고, 무한 스크롤로 피드를 탐색합니다.\n\n어려웠던 점은 탈퇴 유저의 게시글 처리였습니다. 회원 탈퇴 시 게시글을 soft delete하면 대량 업데이트가 필요했기 때문에, 게시글 조회 시점에 탈퇴 유저를 필터링하는 방식으로 처리했습니다. 가족 그룹 탈퇴 시에는 그룹 소속이 아니므로 자연스럽게 조회 대상에서 제외됩니다.',
    '사업자 등록 후 투자 유치 시도': '사업자 등록을 완료하고 프라이머 배치 28기에 지원하여 투자 유치를 시도했습니다. IR 덱 작성, 사업 모델 설계, 시장 분석 등 창업 전반의 과정을 직접 경험했습니다.',
    '카페 운영과 병행하며 1인 개발': '카페를 운영하면서 기획, 디자인, 개발, 사업을 혼자 진행했습니다. 제한된 시간 안에서 우선순위를 정하고 MVP를 빠르게 구현하는 경험을 했습니다.',
  },
}

const troubleshootingData: Record<string, readonly ToggleItem[]> = {
  'realm': [
    { title: 'TipTap 문서 자동 저장 실패 — debounce + 낙관적 업데이트로 해결', content: '문서 편집 중 내용이 간헐적으로 저장되지 않는 문제 발생. 원인은 빠른 타이핑 시 API 요청이 race condition을 일으키는 것이었습니다. Zustand에 debounce된 저장 로직과 낙관적 업데이트 패턴을 적용하여 해결했습니다.' },
    { title: 'Tauri + Vite HMR 포트 충돌 — 환경 분기 설정', content: 'Tauri 개발 환경에서 Vite HMR WebSocket이 충돌하며 핫 리로드가 동작하지 않는 문제. tauri.conf.json에서 devUrl과 Vite 설정을 환경별로 분기 처리하여 해결했습니다.' },
    { title: 'pgvector 유사도 검색 성능 저하 — IVFFlat 인덱스 적용', content: '데이터가 늘어나면서 시맨틱 검색 응답이 2초 이상 걸리는 문제. IVFFlat 인덱스를 생성하고 probes 값을 튜닝하여 200ms 이내로 개선했습니다.' },
    { title: 'R2 Presigned URL CORS 에러 — Cloudflare Workers로 프록시', content: '브라우저에서 R2 Presigned URL로 직접 업로드 시 CORS 에러 발생. Cloudflare Workers를 프록시로 두어 CORS 헤더를 제어하고 파일 검증 로직도 추가했습니다.' },
  ],
  'b3d-ods': [
    { title: 'JSP → React 점진적 마이그레이션 전략', content: '운영 중인 서비스를 중단 없이 마이그레이션해야 하는 상황. 페이지 단위로 React를 점진 도입하고, iframe 기반 하이브리드 방식으로 레거시와 공존시켰습니다.' },
    { title: '멀티 컴퍼니 데이터 격리 설계', content: 'SaaS 전환 시 companyId 기반 데이터 격리가 필요했습니다. JPA의 @Filter와 커스텀 Interceptor를 조합하여 쿼리 레벨에서 자동 필터링을 구현했습니다.' },
  ],
  'mungnyanglog': [
    { title: 'KMP에서 플랫폼별 위치 권한 처리 — expect/actual 패턴', content: 'Android와 iOS의 위치 권한 요청 방식이 완전히 달라 산책 기능 구현에 어려움. expect/actual 패턴으로 LocationPermissionHandler를 추상화하고, 플랫폼별 구현체를 분리하여 해결했습니다.' },
    { title: 'GPS 산책 경로 데이터 유실 — 로컬 저장 + 재전송 로직', content: '산책 중 네트워크 끊김 시 경로 데이터가 유실되는 문제. WalkLocalData에 경로를 실시간 저장하고, 네트워크 복구 시 서버에 재전송하는 방식으로 해결했습니다.' },
    { title: 'Spring AI Function Calling 응답 지연 — 스트리밍 방식 전환', content: 'AI 상담사 응답이 길어지면 사용자가 빈 화면을 오래 보는 문제. Spring AI의 스트리밍 응답을 적용하여 토큰 단위로 실시간 표시하도록 개선했습니다.' },
  ],
}

function ImageCarousel({ images, title, accent }: { images: string[]; title: string; accent?: string }) {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#f8f9fa] border border-border">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-text-primary shadow-lg transition-all hover:bg-white/80 hover:scale-110"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-text-primary shadow-lg transition-all hover:bg-white/80 hover:scale-110"
          >
            <ChevronRight className="h-7 w-7" />
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
  if (project.images?.hero) galleryImages.push(project.images.hero)
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
          <ImageCarousel images={galleryImages} title={project.title} accent={project.accent} />
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
            <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: project.accent || '#191f28' }} />
            PROJECT OVERVIEW
          </h2>
          <p className="text-[17px] leading-[1.9] text-text-primary">
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
              <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: project.accent || '#191f28' }} />
              PROJECT DETAILS
            </h2>
          <div className="border-t border-border">
            {[
              { title: '주요 기능', items: project.highlights.map((h) => ({ title: h, content: highlightContentData[project.id]?.[h] || '' })) },
              { title: '트러블슈팅', items: troubleshootingData[project.id] },
              { title: '변경 사항', items: changelogData[project.id] },
              { title: '개선 사항', items: improvementData[project.id] },
            ]
              .filter((ch): ch is { title: string; items: readonly ToggleItem[] } => !!ch.items?.length)
              .map((ch, i) => (
                <ChapterToggle key={ch.title} num={String(i + 1).padStart(2, '0')} title={ch.title} count={ch.items.length}>
                  <ItemToggleList items={ch.items} />
                </ChapterToggle>
              ))}
          </div>
          </div>

          {/* Business — 멍냥로그 전용 */}
          {project.id === 'mungnyanglog' && (
            <div className="mt-14">
              <h2 className="mb-5 flex items-center gap-3 text-[16px] font-bold tracking-[0.05em] text-text-primary">
                <span className="h-5 w-[3px] rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                BUSINESS
              </h2>
              <p className="text-[17px] leading-[1.9] text-text-primary mb-8">
                사업자 등록 후 프라이머 배치 28기에 지원하여 투자 유치를 시도한 1인 창업 프로젝트입니다.
              </p>

              {/* IR Deck Carousel */}
              <div className="mb-8">
                <h3 className="mb-4 text-[15px] font-semibold text-text-primary">IR Deck (사업계획서)</h3>
                <ImageCarousel
                  images={Array.from({ length: 12 }, (_, i) => `/images/ir-deck-${String(i + 1).padStart(2, '0')}.png`)}
                  title="IR Deck"
                  accent="#f59e0b"
                />
              </div>

              {/* Primer Application */}
              <div className="mb-8">
                <h3 className="mb-4 text-[15px] font-semibold text-text-primary">프라이머 배치 28기 지원</h3>
                <div className="overflow-hidden rounded-xl border border-border bg-[#f8f9fa]">
                  <img
                    src="/images/primer-apply-1.png"
                    alt="프라이머 배치 28기 지원서"
                    className="w-full object-contain"
                  />
                </div>
              </div>

              {/* YouTube Demo */}
              <div className="mb-8">
                <h3 className="mb-4 text-[15px] font-semibold text-text-primary">Product Demo</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src="https://www.youtube.com/embed/rwA1AL3qpaE"
                      title="멍냥로그 Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


        </motion.div>

      </div>
    </main>
  )
}
