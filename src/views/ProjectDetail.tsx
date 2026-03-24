'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { projects } from '@/data/projects'
import { skillIconMap } from '@/data/skillIcons'

function ChapterToggle({ num, title, count, children, defaultOpen = false }: { num: string; title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

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

function ItemToggleList({ items, accent }: { items: readonly ToggleItem[]; accent?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const allSimple = items.every((item) => !item.content)

  if (allSimple) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-bg-card/40 px-5 py-4 transition-colors hover:bg-bg-card">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent || '#8b5cf6' }} />
            <span className="text-[15px] leading-[1.6] text-text-primary">{item.title}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-transparent transition-colors duration-200 hover:border-border/40">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center gap-4 px-4 py-4 text-left"
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${openIndex === i ? 'bg-text-primary' : 'bg-text-muted/30'}`}>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-bg' : 'text-text-secondary'}`} />
            </div>
            <span className="text-[17px] leading-[1.6] text-text-primary">{item.title}</span>
          </button>
          <AnimatePresence>
            {openIndex === i && item.content && (
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
    { title: 'v1.3 — Orbit MVI + Widget-Section-Screen 아키텍처 전환', content: '694줄 모놀리스 ReadipApi를 5개 도메인 API로 분리하고, 14개 Orbit MVI ViewModel을 도입했습니다. 이어서 8개 Screen의 private composable을 widget/section 파일로 추출하여 코드 재사용성을 높였습니다.' },
    { title: 'v1.2 — Supabase → Spring Boot 서버 전환', content: 'BaaS 의존에서 벗어나 Spring Boot 4 + Kotlin 자체 서버로 전환했습니다. Koin DI를 도입하고, 인증 체계를 자체 JWT 기반으로 재설계했습니다.' },
    { title: 'v1.1 — Gemini AI 번역 엔진 도입', content: 'Google Translate에서 Gemini 2.0 Flash로 번역 엔진을 전환하여 문맥 인식 번역 품질을 향상시켰습니다. 단어 번역과 문맥 번역 두 가지 모드를 제공합니다.' },
    { title: 'v1.0 — iOS/Android 동시 출시', content: 'Kotlin Multiplatform으로 개발하여 Android와 iOS에 동시 출시했습니다. 코드 80% 이상을 공유하며, Supabase 기반 MVP로 시작했습니다.' },
  ],
}

const improvementData: Record<string, readonly ToggleItem[]> = {
  'b3d-ods': [
    { title: '쿼리 최적화로 응답시간 40% 단축', content: 'QueryDSL을 활용한 동적 쿼리 최적화와 Redis 캐싱 도입으로 평균 API 응답시간을 200ms에서 120ms로 단축했습니다.' },
    { title: 'Redis 캐싱 도입', content: '권한 정보, 자주 조회되는 코드 데이터를 Redis에 캐싱하여 DB 부하를 줄이고 응답 속도를 개선했습니다.' },
  ],
}


const highlightContentData: Record<string, Record<string, string>> = {
  'readip': {
    'KMP로 Android/iOS 동시 지원 (코드 80%+ 공유)': 'Kotlin Multiplatform + Compose Multiplatform으로 Android와 iOS를 하나의 코드베이스로 개발합니다. UI, 비즈니스 로직, 네트워킹(Ktor), 데이터 모델, 로컬 저장(DataStore)을 commonMain에 작성하고, 인증(Google Credential Manager / Apple Sign-In), 결제(RevenueCat), 배터리 모니터링 등 플랫폼 고유 기능만 expect/actual 패턴으로 분리했습니다.\n\nKoin DI로 ViewModel과 API 클래스의 의존성을 주입하고, 서버 URL도 expect/actual로 분리하여 Android 에뮬레이터(10.0.2.2)와 iOS 시뮬레이터(localhost)를 자동 분기합니다.\n\n가장 어려웠던 점은 iOS 결제 연동이었습니다. RevenueCat SDK가 Swift 기반이라 KMP에서 직접 호출할 수 없어서, PurchaseBridge.kt(Kotlin)와 RevenueCatHelper.swift(Swift) 사이의 브릿지 패턴을 설계해야 했습니다. 콜백 기반 통신으로 구매, 복원, 로그인/로그아웃을 양방향으로 연결했습니다.',
    'Gemini AI 기반 문맥 인식 번역': 'Gemini 2.0 Flash 모델을 활용한 실시간 번역 시스템입니다. 두 가지 번역 모드를 제공합니다.\n\n단어 번역(translateWord)은 선택한 단어의 뜻과 품사(명사, 동사, 형용사 등)를 추출하고, 문맥 번역(translateWithContext)은 단어가 포함된 전체 문장을 함께 전송하여 문맥에 맞는 번역을 제공합니다. 예를 들어 "bank"가 강둑인지 은행인지를 주변 문장으로 판별합니다.\n\n한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어, 독일어 7개 언어를 지원하며, API 실패 시 exponential backoff(1초, 2초, 3초)로 최대 3회 재시도합니다. 429(Rate Limit)와 5xx 에러를 구분하여 재시도 여부를 판단합니다.\n\n어려웠던 점은 Gemini API의 응답 형식이 일관되지 않는 것이었습니다. JSON으로 응답하라고 프롬프트에 명시해도 가끔 마크다운이나 텍스트가 섞여서 돌아왔습니다. 정규식 기반 JSON 추출을 1차로 시도하고, 실패하면 raw 텍스트를 파싱하는 2단계 폴백 구조로 해결했습니다.',
    'CEFR A1~C2 레벨별 도서 큐레이션': '유럽 공통 언어 참조 기준(CEFR)에 따라 A1(입문)부터 C2(원어민)까지 6단계로 도서를 분류합니다. 각 레벨은 고유 색상(A1 초록 → C2 빨강 그라디언트)으로 시각적으로 구분되며, 레벨별·장르별 필터링과 정렬을 지원합니다.\n\n콘텐츠는 프로젝트 구텐베르크 등 퍼블릭 도메인 원서를 기반으로, Claude AI의 도움을 받아 한국어 번역과 CEFR 레벨 태깅을 진행합니다. upload_books.py 스크립트로 원문(en.txt)과 번역(ko.txt)을 서버에 업로드하고, 관리자 대시보드에서 메타데이터(장르, 레벨, 표지 이미지)를 관리합니다.\n\n홈 화면에서는 "이어 읽기", "짧은 글", "긴 글" 섹션별로 도서를 노출하고, 레벨별/장르별 전체 보기 화면에서 정렬(최신순, 제목순)과 필터를 제공합니다. 장르를 추가할 때는 enum, UI 아이콘, 색상, 서버 데이터를 모두 동기화해야 하므로 체크리스트를 만들어 관리합니다.',
    'Orbit MVI + Widget-Section-Screen 아키텍처': '초기에는 13개 화면에서 694줄짜리 모놀리스 ReadipApi를 직접 호출하는 구조였습니다. 화면마다 koinInject<ReadipApi>()를 쓰고 있었고, API 호출과 상태 관리가 Screen 안에 뒤섞여 있었습니다.\n\n이를 두 단계로 리팩토링했습니다.\n\n1단계: ReadipApi를 BookApi, ReadingApi, WordApi, ConfigApi, AccountApi 5개 도메인으로 분리하고, 14개 Orbit MVI ViewModel을 도입하여 모든 화면에서 API 직접 호출을 제거했습니다. State(불변 데이터 클래스) + Intent(상태 변경 함수) + SideEffect(일회성 이벤트) 패턴으로 상태를 관리합니다.\n\n2단계: 8개 Screen 파일의 private composable 함수를 widget/(재사용 UI 단위)과 section/(화면 영역) 파일로 분리했습니다. SettingsScreen 838줄 → 482줄, QuizScreen 802줄 → 287줄, FlashcardScreen 788줄 → 307줄 등 대폭 축소되었고, 신규 19개 파일을 생성하여 컴포넌트 재사용성을 높였습니다.\n\nMVVM 대신 Orbit MVI를 선택한 이유는 복잡한 상태 흐름(번역 → 저장 → 퀴즈 생성)에서 Intent 기반 단방향 데이터 흐름이 디버깅에 유리했기 때문입니다.',
    'RevenueCat 기반 Freemium 수익화': 'RevenueCat SDK를 활용하여 Android(Google Play Billing)와 iOS(StoreKit 2)의 구독 결제를 통합 관리합니다. 무료 유저는 5권까지 읽을 수 있고, 프리미엄 구독 시 전체 도서와 AI 번역을 무제한으로 이용할 수 있습니다.\n\n무료 도서 제한 수(free_book_limit)는 서버 설정에서 동적으로 관리하여 하드코딩 없이 운영할 수 있습니다. 이미 시작한 책은 제한에 걸려도 계속 읽을 수 있도록 하여 사용자 경험을 보호합니다.\n\n프리미엄 상태는 3중 레이어로 판별합니다: (1) RevenueCat 구독 상태, (2) 관리자 대시보드에서 수동 부여한 DB 프리미엄, (3) 서버 응답의 프리미엄 플래그. 셋 중 하나라도 true이면 프리미엄으로 처리합니다. AdminPremiumCache를 도입하여 테스트와 CS 대응 시 앱 재시작 없이 프리미엄을 부여할 수 있습니다.',
    'Next.js 관리자 대시보드': 'Next.js 16 + React 19 기반의 관리자 대시보드로, 도서 관리, 유저 관리, 태그 관리, 앱 설정, 통계를 제공합니다.\n\n도서 관리에서는 CRUD, 콘텐츠 업로드, 독자 현황 조회가 가능합니다. 태그 관리에서는 AI 기반 주제 태그 자동 생성(5개 추천), 태그 유사도 분석, 카테고리별 복수 선택을 지원합니다. 유저 관리에서는 읽기 통계와 함께 RevenueCat API 연동으로 프리미엄 수동 부여/해제가 가능합니다.\n\n앱 설정(Config) 페이지에서는 무료 도서 제한 수, 기능 플래그 등을 서버 재시작 없이 실시간으로 변경할 수 있습니다. 랜딩 페이지도 포함되어 있어 App Store, Google Play 링크와 스크린샷을 노출합니다.\n\nCloudflare Pages에 배포하고, Supabase를 데이터베이스로 사용합니다. Edge Runtime으로 서버리스 API 라우트를 운영하여 콜드 스타트를 최소화했습니다.',
  },
  'mungnyanglog': {
    'Firebase OAuth 인증 (Google / Apple)': '글로벌 시장 진출을 위해 카카오/네이버를 제외하고 Google, Apple 로그인만 채택.\n\n클라이언트에서 Firebase로 인증 후 ID Token을 서버에 전송하면, 서버는 Firebase Admin SDK로 토큰을 검증하는 구조입니다. 토큰 갱신, 세션 유지, 로그아웃 처리는 Firebase Auth에 위임하여 인증 로직을 단순화했습니다.\n\n에러 핸들링은 서버에서 커스텀 에러 코드만 반환하고, 클라이언트에서 다국어 토스트 메시지로 파싱하는 구조로 글로벌 대응했습니다.\n\n회원 탈퇴는 30일 유예 기간을 두고, 매일 새벽 스케줄러가 탈퇴 신청 후 30일이 지난 유저를 확인하여 관련 데이터를 삭제합니다. 관련 데이터는 탈퇴자 ID를 쿼리에서 필터링하는 방식으로, 대량 soft delete 없이 효율적으로 처리했습니다.',
    '가족 그룹 생성 / 초대 / 권한 관리': '초대 코드(대문자, I, 1 제외), 링크, 이메일, 카카오톡 공유 4가지 방식으로 가족을 초대합니다. 초대 코드는 24시간 만료이며, 클라이언트에서 타이머를 표시하고 만료 시 재발급 UI를 노출합니다. 캐시 없이 항상 서버 조회하여 모든 구성원이 동일한 상태를 봅니다.\n\n권한은 읽기/쓰기/삭제의 다중 권한 구조이며, Admin만 권한 조작이 가능합니다. 영유아 등 가족 구성원의 잘못된 조작을 방지하기 위해 삭제/수정 권한을 제한했습니다. 게스트 모드는 펫시터 등 임시 접근용으로, 실시간 산책 추적을 허용하면서도 데이터 수정은 차단합니다.\n\n그룹 탈퇴 시 본인이 작성한 데이터는 유지되지만 가족 그룹에서는 비노출 처리합니다. Owner는 모든 구성원이 탈퇴해야만 그룹을 삭제할 수 있습니다. DB는 그룹-유저 N:N 관계이며, FK 없이 ID 참조 방식으로 설계했습니다.',
    'GPS 실시간 산책 추적 (경로 시각화, 거리/시간)': 'Android는 Google Maps SDK, iOS는 MapKit으로 플랫폼별 지도를 구현하고, 칼만 필터(Kalman Filter)로 GPS 노이즈를 보정하여 경로 튀김을 최소화했습니다.\n\n위치 수집은 10초 간격 또는 10m 이상 이동 시 트리거되며, 사람의 보행/달리기 속도 범위를 벗어나는 이동(차량 등)은 필터링합니다. 백그라운드에서도 위치 추적이 동작하며, 수집 간격을 조정하여 배터리 소모를 줄였습니다.\n\n산책 시작 시 KMP DataStore에 로컬 저장을 시작하고, 중간중간 위도/경도를 누적 저장합니다. 폴리라인으로 실시간 경로를 시각화하며, 1km 마일스톤 달성 시 지도에 마커를 표시합니다. 비정상 종료 시에도 DataStore에서 복구하여 데이터 유실을 방지합니다. 1분 미만 산책은 저장하지 않습니다.\n\n산책 중 사진 촬영, 배변 기록, 메모를 남길 수 있으며, 종료 시 요약 화면에서 전체 기록을 확인하고, 산책 경로가 가족 게시글에 자동 업로드됩니다. 경로 데이터는 전부 서버에 저장하여 향후 AI 분석 데이터로 활용할 수 있도록 설계했습니다.\n\n가장 어려웠던 점은 GPS 경로 보정이었습니다. 초기에는 경로가 갑자기 50m씩 튀거나, 제자리에서 빙글빙글 도는 현상이 심했습니다. 필터를 강하게 걸면 폴리라인이 실시간으로 그려지지 않아 답답했고, 약하게 걸면 경로가 튀었습니다. 칼만 필터를 적용하여 상당 부분 개선했지만, 통신 환경에 따라 완벽하지는 않았습니다.',
    'GCP Signed URL 미디어 보안': '가족 간 공유되는 반려동물 사진이 외부에 유출되지 않도록 GCP Cloud Storage + Signed URL(15분 만료)로 접근을 제한했습니다. 프로필, 게시글, 산책 사진 등 용도별로 버킷을 분리하고, 서버에서 접근 URL을 캐시 처리하여 반복 요청을 줄였습니다.\n\n초기에는 서버에서 이미지 리사이징을 처리했으나, 한 장당 최대 10MB x 10장 = 100MB를 서버로 전송하는 구조가 너무 느렸습니다. 이를 클라이언트에서 리사이징(80% 압축) 후 병렬 업로드하는 방식으로 전환하여 속도를 대폭 개선했습니다. 서버는 Signed URL 발급과 접근 경로(버킷 + ID + 타임스탬프) 관리만 담당합니다.\n\n클라이언트에서는 Coil 라이브러리로 이미지를 캐싱하고, 업로드 시 병렬 처리 후 정상 응답을 받으면 즉시 사용자에게 노출하여 UX를 최적화했습니다.',
    'FCM 푸시 알림 + 딥링크 네비게이션': 'Spring Boot + Firebase Admin SDK로 가족 그룹 가입, 게시글 작성, 산책 완료, 결제 완료 등의 이벤트에 푸시 알림을 발송합니다. 알림 카테고리별 ON/OFF 설정을 제공하며, 포그라운드에서도 상단에 알림이 표시됩니다.\n\n푸시 토큰은 FCM 특성상 계속 변경되기 때문에, 로그인 성공 시와 자동 로그인(스플래시) 시 두 시점에서 토큰을 업데이트합니다. 로그인 시에는 클라이언트에서 서버로 토큰을 전송하는 타이밍에 저장하고, 자동 로그인 시에는 스플래시 단계에서 갱신합니다.\n\n가장 어려웠던 점은 데이터 정합성이었습니다. 가족 초대 알림을 포그라운드에서 눌러 진입했는데 가족 그룹 정보가 보이지 않는 문제가 있었고, 원인은 클라이언트 캐시였습니다. 이후 캐시 초기화 공통 유틸 함수를 만들어 알림 진입 시 항상 최신 데이터를 조회하도록 개선했습니다.',
    'Spring AI Function Calling 기반 AI 펫 상담사': 'Gemini 2.5 Flash 모델을 활용한 AI 펫 상담사입니다. 반려동물을 선택하면 산책 기록, 건강검진 이력, 예방접종 일정, 병원 스케줄 등 해당 반려동물의 전체 데이터를 기반으로 자연어 질의응답이 가능합니다.\n\nSpring AI Function Calling으로 건강검진별, 산책별, 권한별 등 카테고리별 프롬프트를 세분화하여 응답 정확도를 높였습니다.\n\n가장 어려웠던 점은 서버 데이터가 필요 없는 일반 질문에서 AI 응답 품질이 떨어지는 문제였습니다. 서버에서 동일한 Function Calling을 반복 호출하면서 불필요한 응답을 생성했기 때문입니다. 이를 해결하기 위해 클라이언트에도 같은 모델을 탑재하고, 질문이 서버 데이터가 필요한지 클라이언트에서 먼저 판별하도록 했습니다. 서버 데이터가 불필요하면 클라이언트에서 바로 응답하고, 필요하면 서버 API를 호출하는 2단계 구조로 개선하여 응답 속도와 품질을 모두 높였습니다.',
    '가족 범위 게시글 공유 (사진/미디어, 펫 태깅)': '가족 구성원만 볼 수 있는 게시글 피드입니다. 사진과 텍스트를 올릴 수 있으며, 산책 완료 시 산책 경로가 자동으로 게시글에 업로드됩니다. 반려동물을 다중 태깅할 수 있어 펫별로 기록을 모아볼 수 있고, 무한 스크롤로 피드를 탐색합니다.\n\n어려웠던 점은 탈퇴 유저의 게시글 처리였습니다. 회원 탈퇴 시 게시글을 soft delete하면 대량 업데이트가 필요했기 때문에, 게시글 조회 시점에 탈퇴 유저를 필터링하는 방식으로 처리했습니다. 가족 그룹 탈퇴 시에는 그룹 소속이 아니므로 자연스럽게 조회 대상에서 제외됩니다.',
    '사업자 등록 후 투자 유치 시도': '사업자 등록을 완료하고 프라이머 배치 28기에 지원하여 투자 유치를 시도했습니다.\n\nIR 덱의 핵심 메시지는 "가족 공유를 통한 유대감 증진"이었고, 수익 모델은 AI 펫 상담사, AI 건강 집계 리포트 등 AI 기반 프리미엄 구독과 반려식품 커머스를 설계했습니다. 반려식품은 외부 업체와 실제 생산 계획을 수립하고 샘플까지 제작·수령하는 단계까지 진행했습니다.\n\n결과적으로 프라이머 배치 28기는 불합격했지만, 이 과정에서 가장 크게 배운 것은 "포기도 큰 용기가 필요하다"는 것이었습니다. 주변에서는 포기를 나쁜 것처럼 말하지만, 적절한 포기가 오히려 나를 지키는 길이고, 그 과정에서 무언가를 얻었다면 그것만으로도 충분히 의미 있는 경험이라고 느꼈습니다.\n\n처음에는 포기했다고 생각했지만, 지금 돌아보면 IR 덱 작성, 사업 모델 설계, 시장 분석 등 창업 전반의 경험이 개발자로서의 시야를 넓혀주었고, 무엇보다 미래에 후회하지 않을 선택을 했다는 것이 가장 큰 배움이었습니다.',
    '카페 운영과 병행하며 1인 개발': '약 1년간 카페를 운영하면서 기획, 디자인, 개발, 사업을 혼자 진행했습니다. 카페 업무를 마치고 평일·주말 남는 시간을 전부 개발에 투자했습니다.\n\n카페를 선택한 이유는 사장 업무를 미리 경험할 수 있는 기회라고 생각했기 때문입니다. 단순 아르바이트가 아니라 직원 관리, 스케줄 관리, 발주 관리 등 운영 전반을 직접 담당했고, 멍냥로그가 잘 되어 대표가 되었을 때를 대비해 미리 경영 감각을 쌓아두자는 마음으로 임했습니다.\n\n디자인은 처음에 외주를 맡겼지만 결과물이 만족스럽지 않아 Figma를 직접 배워서 작업했습니다.\n\n1인 개발에서 가장 힘들었던 점은 방향을 모른다는 것이었습니다. 피드백을 줄 사람이 없어서 내가 가는 방향이 맞는지 확신이 없었고, 기능 하나를 추가하는 데도 정말 많이 고민했습니다. 막상 추가하고 나중에 돌아보면 항상 아쉬운 점이 보였고, 그럴 때는 주변에 반려동물을 키우는 사람들에게 적극적으로 조언을 구하며 방향을 잡아갔습니다.',
  },
}

const troubleshootingData: Record<string, readonly ToggleItem[]> = {
  'realm': [
    { title: 'DB 연결 끊김 — HikariCP keepalive + 프론트 heartbeat 다층 방어', content: 'Cloudtype에 호스팅한 PostgreSQL이 일정 시간이 지나면 연결이 조용히 끊기는 문제가 발생했습니다. 데이터가 저장되지 않는데 에러 메시지도 없어서 원인을 찾기까지 시간이 걸렸습니다.\n\n서버 측에서는 HikariCP keepalive-time을 2분으로 설정하여 연결 유효성을 주기적으로 체크하고, connection-timeout, validation-timeout, max-lifetime, idle-timeout을 세밀하게 조정했습니다.\n\n프론트 측에서는 /auth/health 헬스체크 엔드포인트를 추가하고, 2분 주기 heartbeat로 서버 상태를 사전 감지하는 connectionStore를 구현했습니다. authFetch에 15초 timeout과 5xx 응답 시 자동 재시도 로직도 추가하여 다층으로 방어했습니다.' },
    { title: '오프라인 감지 + 저장 실패 복구 — draft 백업 + 재시도 큐', content: 'DB 연결 끊김 문제를 겪으면서, 네트워크 불안정 상황에서의 데이터 유실을 근본적으로 방어해야겠다고 판단했습니다.\n\nconnectionStore로 online/offline 상태를 감지하고, 저장에 실패한 요청을 큐에 쌓아 네트워크 복구 시 자동 재전송하는 구조를 만들었습니다. draftStore를 통해 localStorage에 문서 내용을 실시간 백업하여, 브라우저가 꺼져도 마지막 작성 내용을 복원할 수 있습니다.\n\nauthFetch에는 네트워크 에러 시 최대 3회 exponential backoff 재시도를 적용했고, 문서 편집 화면에 저장 상태(Saving/Saved/Save failed)를 실시간으로 표시하여 사용자가 현재 상태를 알 수 있게 했습니다.' },
    { title: 'TipTap 문서 자동 저장 실패 — debounce + 낙관적 업데이트', content: '문서 편집 중 내용이 간헐적으로 저장되지 않는 문제가 발생했습니다. 원인은 빠른 타이핑 시 API 요청이 race condition을 일으키는 것이었습니다.\n\nZustand에 debounce된 저장 로직을 구현하여 타이핑이 멈춘 후 일정 시간 뒤에만 저장 요청을 보내도록 했고, 낙관적 업데이트 패턴을 적용하여 서버 응답을 기다리지 않고 즉시 UI에 반영하되, 실패 시 롤백하는 방식으로 해결했습니다.' },
    { title: 'psql에서 한글 파일명 Unicode 깨짐 — DB 정책 수립', content: 'psql 콘솔에서 doc_page.content를 직접 UPDATE했더니, r2:// 이미지 URL에 포함된 한글 파일명의 Unicode 정규화(NFD→NFC)가 깨져서 이미지가 모두 깨지는 문제가 발생했습니다.\n\n이후 doc_page.content는 SQL로 직접 UPDATE하지 않는다는 DB 정책을 수립하고, 반드시 애플리케이션 레이어를 통해서만 수정하도록 규칙을 만들었습니다.' },
    { title: 'R2 Presigned URL CORS 에러 — Cloudflare Workers 프록시', content: '브라우저에서 R2 Presigned URL로 직접 파일을 업로드할 때 CORS 에러가 발생했습니다.\n\nCloudflare Workers를 프록시로 두어 CORS 헤더를 제어하고, 파일 검증 로직도 추가하여 해결했습니다.' },
    { title: '한글 IME Enter 버그 — isComposing 체크', content: '문서 제목 입력란에서 한글을 입력하고 Enter를 누르면, 한글 조합이 끝나지 않은 상태에서 Enter가 동작하여 의도치 않게 에디터로 포커스가 이동하는 버그가 발생했습니다.\n\n원인은 한글 IME(입력기)의 조합 중(composing) 상태에서 Enter 키 이벤트가 발생하는 것이었습니다. onKeyDown 핸들러에 e.nativeEvent.isComposing 체크를 추가하여, IME 조합 중에는 Enter 동작을 무시하도록 수정했습니다.' },
  ],
  'b3d-ods': [
    { title: 'JSP → React 점진적 마이그레이션 전략', content: '운영 중인 서비스를 중단 없이 마이그레이션해야 하는 상황. 페이지 단위로 React를 점진 도입하고, iframe 기반 하이브리드 방식으로 레거시와 공존시켰습니다.' },
    { title: '멀티 컴퍼니 데이터 격리 설계', content: 'SaaS 전환 시 companyId 기반 데이터 격리가 필요했습니다. JPA의 @Filter와 커스텀 Interceptor를 조합하여 쿼리 레벨에서 자동 필터링을 구현했습니다.' },
  ],
  'readip': [
    { title: 'Supabase → Spring Boot 전환 — 인증/API 전면 재설계', content: 'MVP 단계에서 Supabase(BaaS)로 빠르게 개발했지만, 비즈니스 로직이 복잡해지면서 Edge Function의 한계에 부딪혔습니다. 특히 RevenueCat 웹훅 처리, 복잡한 쿼리, 트랜잭션 관리가 어려워 Spring Boot로 전환을 결정했습니다.\n\n전환은 2단계로 진행했습니다. 1단계에서 SupabaseApi를 ReadipApi로 전면 교체하고 Koin DI를 세팅했습니다. 모든 Screen에서 koinInject<ReadipApi>()로 전환하고, expect/actual로 플랫폼별 서버 URL(Android: 10.0.2.2, iOS: localhost)을 분리했습니다.\n\n2단계에서 Supabase Auth를 Spring Boot의 /auth/google, /auth/apple 엔드포인트로 전환하고, supabase/ 디렉토리(config, migrations, edge functions)를 전부 삭제했습니다. 데이터 모델도 snake_case에서 camelCase로 전면 전환하여 서버 표준에 맞췄습니다.' },
    { title: '리더 패딩 플랫폼별 동적 계산 — 8번의 수정', content: '리더 화면의 상단/하단 패딩을 맞추는 데 8번의 커밋이 필요했습니다. Android와 iOS의 상태바, 네비게이션 바 높이가 다르고, Compose Multiplatform의 WindowInsets 처리 방식이 플랫폼마다 달랐기 때문입니다.\n\n초기에는 하드코딩(40dp)으로 처리했지만 기기마다 달라서 실패했습니다. WindowInsets.statusBars로 전환한 후에도 App.kt에서 이미 inset을 처리하고 있어 이중 적용되는 문제가 발생했습니다.\n\n최종적으로 상태바 높이를 실측하여 동적 계산하는 방식으로 해결했습니다: (48dp - statusBarHeight).coerceAtLeast(8dp). Android(~24dp 상태바) → 24dp 패딩, iOS(~59dp 상태바) → 8dp 패딩으로 플랫폼별 최적값을 적용했습니다.' },
    { title: 'Pull-to-Refresh 무한 로딩 — LaunchedEffect 의존성 문제', content: '홈 화면에서 Pull-to-Refresh를 추가한 후, 새로고침이 완료되지 않고 무한 로딩 인디케이터가 표시되는 버그가 발생했습니다.\n\n원인은 loadData() 시작 시 isLoaded 상태를 false로 리셋하지 않아서, LaunchedEffect가 데이터 로딩 완료를 감지하지 못하는 것이었습니다. Compose의 LaunchedEffect는 key 값이 변경될 때만 재실행되는데, isLoaded가 이미 true인 상태에서 refresh를 호출하면 상태 변화가 없어 UI가 갱신되지 않았습니다.\n\nloadData() 시작 시점에 isLoaded = false를 명시적으로 리셋하여 해결했습니다.' },
    { title: 'UI 공통화로 3,100줄 감소 — 위젯 추출 전략', content: '6개 화면에서 동일한 책 카드, 헤더, 정렬 바텀시트를 각각 구현하고 있어 코드 중복이 심했습니다. 특히 BookGridCard가 홈 섹션과 전체 보기 6곳에서 거의 같은 코드로 반복되고, SortBottomSheet도 5개 화면에 복사되어 있었습니다.\n\n공통 위젯 5개(BookGridCard, BookRowCard, BookListHeader, SortBottomSheet, HorizontalBookSection)를 추출하고, TagChip, LevelTagChip 등 소규모 위젯도 분리했습니다. 약 3,100줄이 감소했고, 새로운 목록 화면 추가 시 위젯 조합만으로 개발이 가능해졌습니다.' },
    { title: 'API 토큰 동시 갱신 Race Condition — Mutex 보호', content: '여러 API를 병렬로 호출하는 홈 화면에서, 토큰이 만료된 상태로 5개 요청이 동시에 발생하면 5개 모두 401을 받고, 5개 모두 토큰 갱신을 시도하는 문제가 발생했습니다.\n\nKotlin Coroutines의 Mutex로 토큰 갱신 로직을 보호하여, 첫 번째 요청만 실제 갱신을 수행하고 나머지는 갱신 완료를 기다린 후 새 토큰으로 재시도하도록 했습니다. 401/403 응답 시 자동으로 토큰을 갱신하고 원래 요청을 재전송하는 인터셉터를 ApiClient에 구현했습니다.' },
  ],
}

function ImageCarousel({ images, title, accent: _accent }: { images: string[]; title: string; accent?: string }) {
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
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" style={{ color: project.accent || '#555' }} />
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
              { title: '주요 기능', items: project.highlights.map((h) => ({ title: h, content: highlightContentData[project.id]?.[h] || '' })), defaultOpen: true },
              { title: '시행착오', items: troubleshootingData[project.id], defaultOpen: true },
              { title: '변경 사항', items: changelogData[project.id], defaultOpen: false },
              { title: '개선 사항', items: improvementData[project.id], defaultOpen: false },
            ]
              .filter((ch): ch is { title: string; items: readonly ToggleItem[]; defaultOpen: boolean } => !!ch.items?.length)
              .map((ch, i) => (
                <ChapterToggle key={ch.title} num={String(i + 1).padStart(2, '0')} title={ch.title} count={ch.items.length} defaultOpen={ch.defaultOpen}>
                  <ItemToggleList items={ch.items} accent={project.accent} />
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
