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
    { title: 'v2.2 — AI Block UI 시스템 + 데이터 내보내기', content: 'AI가 Function Calling으로 조회한 데이터를 마크다운 텍스트가 아닌 구조화된 UI 컴포넌트로 렌더링하는 Block 시스템을 도입했습니다. 서버의 AiBlockBuilder가 CapturedToolResult의 데이터 형태를 분석하여 TableBlock(거래처 목록 같은 정형 데이터), CardListBlock(제품 상세 같은 카드형), SuggestionBlock(후속 질문 추천)으로 자동 변환합니다.\n\n프론트엔드의 BlockRenderer가 block.type별로 전용 위젯을 렌더링합니다. TableBlockWidget은 클립보드 복사(탭 구분), UTF-8 BOM 포함 CSV 내보내기, "이 표에서 "로 시작하는 후속 질문 자동 채우기(useChatStore.setPrefillInput)를 지원합니다. CardListBlockWidget은 확장 가능한 그리드 레이아웃으로 대량 카드를 표시하고, SuggestionBlockWidget은 클릭 시 채팅 입력창에 텍스트를 자동으로 채워줍니다.' },
    { title: 'v2.1 — Spring AI + Gemini Function Calling 도입', content: 'Spring AI 2.0.0-M3과 Gemini 2.5 Flash를 결합한 자연어 데이터 조회 시스템을 구축했습니다. "이번 달 매출 상위 거래처" 같은 자연어 질문이 AiChatService → ChatClient → Gemini API → @Tool 메서드 호출 → 실제 DB 조회로 이어지는 파이프라인입니다.\n\nAiToolFactory가 사용자의 Redis 캐시된 RBAC 권한을 확인하여, 접근 가능한 도메인의 Tool만 선별적으로 Gemini에 등록합니다. PLM 권한이 없으면 PlmTool 자체가 제공되지 않아 AI를 통한 우회 접근도 원천 차단됩니다. 14개 도메인(거래처, PLM, 원단, 프로젝트, 재고, KM, 결재, 판매, 구매, 견적, 자금, 품목, 계좌, 계정과목)에 걸쳐 검색, 상세조회, 요약, 월별추이, 랭킹 등 40개 이상의 @Tool 함수를 정의했습니다.\n\n대화 이력은 PostgreSQL JSONB에 저장하고, 최근 20개 메시지만 컨텍스트로 전달하여 토큰 효율을 관리합니다. 시스템 프롬프트에 도구 선택 규칙("금액 합계는 get*Summary, 월별 추이는 get*MonthlyTrend 사용")을 명시하여 AI가 적절한 도구를 선택하도록 유도합니다.' },
    { title: 'v2.0 — 멀티 컴퍼니 SaaS 아키텍처 전환', content: '단일 회사 전용 시스템에서 한 사용자가 여러 법인에 동시 소속될 수 있는 멀티 테넌트 구조로 전면 전환했습니다. user_company 테이블로 사용자-회사 1:N 관계를 구현하고, JWT Access Token에 현재 선택 회사 정보를 포함시켜 모든 API 요청에 자동 전달합니다.\n\n데이터 격리는 PermissionInterceptor에서 JWT의 companyId를 추출하여 request.setAttribute("allowedCompanyIds")로 주입하고, 모든 서비스 레이어에서 이 값을 QueryDSL where 조건에 포함시키는 패턴입니다. 모든 주요 엔티티의 company_id 컬럼에 인덱스를 걸어 필터링 성능을 확보했습니다.\n\nRedis 권한 캐시도 회사별로 구분됩니다. CachedUserPermission 객체에 companies: Map<String, CachedCompanyPermission> 구조로 회사별 메뉴/액션 매트릭스를 저장하여, 회사 전환 시 JWT 재발급과 함께 올바른 권한이 즉시 적용됩니다.' },
    { title: 'v1.5 — JSP → React 19 프론트엔드 전면 전환', content: '레거시 프론트엔드(Spring MVC + JSP + Bootstrap + jQuery DataTables)를 React 19 + TypeScript + Vite 7 기반으로 전면 전환했습니다. 레거시의 Count 기반 라우팅(CallData.do?Count=1 → PLM 목록, AddData.do?Count=5 → 데이터 생성)을 RESTful 엔드포인트(/api/plm/products, /api/sales/entries)로 재설계했습니다.\n\n상태 관리는 서버 상태와 클라이언트 상태를 명확히 분리합니다. API 데이터는 React Query가 캐싱/동기화/재시도를 담당하고, 인증/테마/사이드바/채팅 세션 같은 UI 상태는 Zustand 스토어로 관리합니다. 폼은 react-hook-form + Zod 스키마 검증으로 타입 안전하게 처리합니다.\n\nUI는 Tailwind CSS 4 + shadcn/ui + CVA 기반 디자인 시스템으로 통일했습니다. FullCalendar(일정), Tiptap(리치 텍스트), @xyflow/react(플로우 다이어그램), big.js(정밀 금액 계산), xlsx(엑셀 처리) 등 도메인별 필수 라이브러리를 통합하고, Cloudflare Pages에 배포하여 글로벌 CDN을 활용합니다.' },
    { title: 'v1.0 — Spring Boot 4 + Kotlin 백엔드 신규 구축', content: 'MariaDB 7개 데이터베이스, 140개 이상의 테이블로 이루어진 레거시 스키마를 PostgreSQL 단일 DB로 통합 재설계했습니다. clothdata → PlmEntity, rminformation_table → VendorEntity, erp_table → SalesEntity/PurchaseEntity 등 테이블 구조를 전면 재설계하고, 4비트 권한 비트마스크를 41메뉴 × 7액션 RBAC으로 확장했습니다.\n\n모든 PK를 UUID v7(@UuidGenerator(style = TIME))로 전환하여 시간순 정렬과 B-tree 인덱스 최적화를 동시에 확보했습니다. JPA + QueryDSL(OpenFeign fork v7.0, KSP 컴파일 타임 코드 생성)로 타입 안전한 동적 쿼리를 구현하고, BaseEntity 상속으로 id/createdAt/updatedAt을 @PrePersist/@PreUpdate 콜백으로 자동 관리합니다.\n\nGlobalExceptionHandler에서 BadRequestException, NotFoundException, AuthorizationException 등 도메인 예외를 일관된 ApiResponse(success, data, error) 형식으로 변환하여 프론트엔드가 에러를 예측 가능하게 처리할 수 있도록 했습니다.' },
  ],
  'readip': [
    { title: 'v1.3 — Orbit MVI + Widget-Section-Screen 아키텍처 전환', content: '694줄 모놀리스 ReadipApi를 BookApi, ReadingApi, WordApi, ConfigApi, AccountApi 5개 도메인으로 분리하고, 14개 Orbit MVI ViewModel을 도입하여 모든 화면에서 API 직접 호출을 제거했습니다. State(불변 데이터 클래스) + Intent(상태 변경 함수) + SideEffect(일회성 이벤트) 패턴으로 상태를 관리합니다.\n\n이어서 8개 Screen의 private composable을 widget/(재사용 UI)과 section/(화면 영역) 파일로 추출했습니다. SettingsScreen 838줄 → 482줄, QuizScreen 802줄 → 287줄로 대폭 축소되었고, 19개 새 파일로 컴포넌트 재사용성을 높였습니다.' },
    { title: 'v1.2 — Supabase → Spring Boot 4 자체 서버 전환', content: 'MVP 단계의 Supabase(BaaS) 의존에서 벗어나 Spring Boot 4 + Kotlin 자체 서버로 전환했습니다. Edge Function의 한계(복잡한 비즈니스 로직, 트랜잭션 관리, RevenueCat 웹훅 처리)에 부딪혀 전환을 결정했습니다.\n\nKoin DI를 세팅하고, Supabase Auth를 /auth/google, /auth/apple 커스텀 엔드포인트로 교체했습니다. 데이터 모델도 snake_case → camelCase로 전환하고, PostgreSQL에 Flyway 마이그레이션을 도입했습니다. Docker 멀티스테이지 빌드로 EC2에 배포하고, GitHub Actions CI/CD를 구축했습니다.' },
    { title: 'v1.1 — Gemini AI 번역 엔진 도입', content: 'Google Translate API에서 Gemini 2.0 Flash로 번역 엔진을 전환했습니다. 단어 번역(translateWord)은 뜻 + 품사(명사, 동사, 형용사 등)를 JSON으로 추출하고, 문맥 번역(translateWithContext)은 선택 단어가 포함된 전체 문장을 함께 전송하여 "bank"가 강둑인지 은행인지를 문맥으로 판별합니다.\n\nGemini API의 응답 형식이 불일치하는 문제(JSON 요청해도 마크다운이 섞여 반환)를 정규식 기반 JSON 추출 + raw 텍스트 파싱 2단계 폴백으로 해결했습니다. 429/5xx 에러 시 exponential backoff(1초, 2초, 3초) 재시도를 적용합니다.' },
    { title: 'v1.0 — KMP로 Android/iOS 동시 출시', content: 'Kotlin Multiplatform + Compose Multiplatform으로 Android와 iOS를 동시 출시했습니다. commonMain에 UI, 비즈니스 로직, 네트워킹(Ktor), 데이터 모델을 작성하여 코드 80% 이상을 공유합니다.\n\nSupabase 기반 MVP로 시작하여 빠르게 기능을 검증했습니다. Google Play Store와 Apple App Store에 동시 배포하고, RevenueCat으로 월간/연간/평생 구독과 AdMob 광고를 통합한 Freemium 수익 모델을 적용했습니다.' },
  ],
}

const improvementData: Record<string, readonly ToggleItem[]> = {
  'readip': [
    { title: '서버 사이드 페이지 캐싱으로 응답 속도 개선', content: '책 콘텐츠의 페이지 분할이 매 요청마다 서버에서 계산되고 있었습니다. 동일한 책을 같은 기기에서 열 때도 매번 HTML을 파싱하고 블록 경계를 계산하는 작업이 반복되었습니다.\n\nPageSplitService에 LRU 캐시(최대 200개 엔트리)를 도입하여 bookId|charsPerLine|linesPerPage 조합을 키로 캐싱합니다. BookCacheManager도 별도로 HTML 콘텐츠를 인메모리 캐시하여, DB 조회 없이 즉시 반환합니다. 캐시 히트 시 페이지 분할 응답이 즉각적으로 반환됩니다.' },
    { title: '홈 화면 병렬 로딩 + supervisorScope 적용', content: '홈 화면에서 4개 API를 순차 호출하면 첫 화면까지 3~4초가 걸렸습니다. supervisorScope + async/awaitAll 패턴으로 병렬 호출하여 로딩 시간을 크게 단축했습니다. supervisorScope를 사용하여 하나의 요청이 실패해도 나머지에 영향을 주지 않습니다.\n\n자주 변하지 않는 데이터(짧은 글, 긴 글, 장르별 목록)는 HomeViewModel에서 24시간 TTL로 캐싱하여 앱 재진입 시 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신합니다.' },
    { title: 'Koin DI 도입으로 의존성 관리 체계화', content: '초기에는 13개 화면에서 koinInject<ReadipApi>()로 단일 API 클래스를 직접 주입하고 있었습니다. API가 분리되면서 BookApi, ReadingApi, WordApi, ConfigApi, AccountApi 5개와 14개 ViewModel의 의존성 그래프가 복잡해졌습니다.\n\nKoin의 module DSL로 dataModule(API 클라이언트), viewModelModule(ViewModel), platformModule(플랫폼별 구현)을 분리하고, startKoin에서 조합합니다. ViewModel은 viewModelOf()로 등록하여 Compose lifecycle과 자동 연동됩니다. 서버 URL도 expect/actual로 분리하여 Android(10.0.2.2)와 iOS(localhost)를 자동 분기합니다.' },
    { title: 'WebView CSS column 기반 읽기 UI 최적화', content: '네이티브 Compose Text로 긴 HTML 콘텐츠를 렌더링하면 성능이 심각하게 떨어졌습니다. 특히 볼드, 이탤릭, 제목 등 서식이 포함된 원서 콘텐츠에서는 AnnotatedString 변환 비용이 컸습니다.\n\nPlatformBookWebView를 도입하여 WebView에서 CSS column-width 기반 페이지네이션을 구현했습니다. 서버에서 받은 HTML을 WebView에 로드하고, JavaScript 브릿지로 현재 페이지 번호와 스크롤 위치를 Kotlin에 전달합니다. BookReaderHandle 인터페이스가 플랫폼별 WebView 동작을 추상화하여, Android(WebView)와 iOS(WKWebView)에서 동일한 API로 제어합니다.' },
  ],
  'b3d-ods': [
    { title: 'N+1 쿼리 제거 — leftJoin + Tuple 단일 쿼리 패턴', content: '판매 목록 100건을 조회하면 거래처명과 담당자명을 표시하기 위해 각 건마다 VendorEntity, UserEntity를 추가 조회하여 총 201번의 쿼리가 실행되고 있었습니다.\n\nQueryDSL의 select(sales, vendor.companyName, user.name).from(sales).leftJoin(vendor).on(sales.vendorId.eq(vendor.id)).leftJoin(user).on(sales.userId.eq(user.id)) 패턴으로 전환하여 단일 쿼리에서 필요한 데이터를 모두 가져오도록 개선했습니다. Tuple에서 t.get(sales), t.get(vendor.companyName)으로 타입 안전하게 추출합니다.\n\n동일한 패턴을 PLM(거래처명 조인), 구매(거래처명 + 담당자), 견적(거래처명 + 품목명), 재고(품목명 + 거래처명) 등 전체 목록 조회 API에 일괄 적용하여, 평균 쿼리 수를 목록 조회당 1~2회로 줄였습니다.' },
    { title: 'Redis 권한 캐싱 도입 — DB 조회 제거 + 장애 폴백', content: '매 API 요청마다 userCompany → role → permission → sidebarMenu 4개 테이블을 조인하여 권한을 확인하고 있었습니다. 트래픽이 늘면서 권한 조회가 전체 API 응답 시간의 상당 부분을 차지했습니다.\n\nRedis에 perm:{userId} 키로 CachedUserPermission 객체를 JSON 직렬화하여 저장하고, TTL 30분으로 캐싱합니다. RedisPermissionService의 getOrLoad() 메서드가 캐시 히트 시 즉시 반환하고, 미스 시에만 DB에서 buildFromDb()로 전체 권한 매트릭스를 한 번에 구축합니다. buildFromDb()는 roleIds 기반 IN 쿼리로 배치 조회하여, 사용자가 5개 회사에 소속되어 있어도 DB 쿼리 4~5회로 고정됩니다.\n\nRedis 장애 시에는 PermissionInterceptor에서 try/catch로 DB 폴백 경로를 타므로 서비스가 중단되지 않습니다. 권한 변경, 로그아웃, 회사 전환 시에는 evict(userId)로 즉시 캐시를 무효화하여 일관성을 보장합니다.' },
    { title: 'DB 스키마 재설계 — 7개 DB 통합 + 복합 인덱스 최적화', content: '레거시 MariaDB는 7개 데이터베이스에 140개 이상의 테이블을 분산 저장하고 있었습니다. 데이터베이스 간 JOIN이 불가능하고 트랜잭션도 단일 DB 내에서만 보장되는 구조적 한계가 있었습니다.\n\nPostgreSQL 단일 DB로 통합하면서 모든 PK를 UUID v7으로 전환했습니다. UUID v7은 시간 기반이라 B-tree 인덱스에서 순차 삽입 성능이 우수하고, auto_increment와 달리 분산 환경에서도 충돌이 없습니다. 멀티 테넌트를 위해 주요 테이블에 company_id 컬럼과 인덱스를 추가하고, 날짜 기반 조회가 빈번한 판매/구매 테이블에는 (company_id, sales_date) 복합 인덱스를 걸어 범위 쿼리를 최적화했습니다.\n\nHibernate 배치 설정(batch_size=50, order_inserts/updates=true)으로 대량 INSERT/UPDATE를 묶어서 실행하고, open-in-view=false로 설정하여 Lazy Loading이 @Transactional 범위 안에서만 동작하도록 제한했습니다. 읽기 전용 메서드에는 @Transactional(readOnly=true)를 적용하여 PostgreSQL이 가벼운 스냅샷 격리를 사용하도록 했습니다.' },
    { title: 'Bootstrap UI → shadcn/ui 디자인 시스템 통일', content: '레거시는 Bootstrap + jQuery DataTables로 25개 도메인의 UI가 제각각이었습니다. 같은 "저장" 버튼이 도메인마다 크기, 색상, 위치가 달랐고, 모달과 테이블도 디자인이 통일되지 않아 사용자가 도메인을 이동할 때마다 UI를 새로 학습해야 했습니다.\n\nTailwind CSS 4 + shadcn/ui + CVA(class-variance-authority) 기반의 디자인 시스템을 구축하여 모든 도메인에 동일한 컴포넌트를 적용했습니다. 버튼, 모달, 테이블, 탭, 폼 입력, 토스트, 드롭다운 등 핵심 UI 컴포넌트를 공용화하고, Phosphor Icons로 아이콘을 통일했습니다. 프론트엔드 도메인 폴더마다 screens/components/hooks/types/api로 분리하여, 새 도메인을 추가할 때 공용 컴포넌트를 조합하기만 하면 일관된 UI가 나오는 구조입니다.\n\n특히 ERP 도메인은 레거시 사용자의 적응을 위해 기존 Bootstrap의 테이블/버튼 배치를 최대한 유지하면서 디자인만 현대화하는 전략을 적용했습니다.' },
    { title: 'Kotlin 확장 함수로 QueryDSL 보일러플레이트 제거', content: '모든 목록 조회 쿼리에서 companyId 필터, 날짜 범위 필터, 페이지네이션 코드가 반복되고 있었습니다. 10개 도메인의 repository에 거의 동일한 BooleanBuilder 코드가 복사되어 있었습니다.\n\nKotlin 확장 함수로 공용 유틸리티를 만들었습니다. BooleanBuilder.andCompanyIds(path, companyIds)는 companyIds가 1개일 때는 eq(), 여러 개일 때는 in()으로 최적 분기합니다. andDateRange(path, dateFrom, dateTo)는 날짜 문자열을 LocalDate로 파싱하여 goe/loe 조건을 추가합니다. NumberPath<T>.sumOf()는 Kotlin K2 컴파일러에서 QueryDSL sum()의 타입 추론이 실패하는 문제를 우회하는 확장 함수입니다.\n\npaginate(page, size, count, fetch) 고차 함수는 count 쿼리와 데이터 조회를 분리하여, totalPages 계산, 빈 페이지 처리, offset 계산을 자동화합니다. 새 도메인의 목록 API를 만들 때 paginate()와 확장 함수를 조합하면 5줄 이내로 완성됩니다.' },
    { title: 'AI Function Calling 도구를 권한 기반으로 동적 제한', content: '초기에는 AI 채팅에서 모든 도메인의 Tool을 일괄 등록했습니다. 사용자가 "거래처 목록 보여줘"라고 하면 VendorTool이 호출되는데, 해당 사용자에게 거래처 조회 권한이 없어도 AI를 통해 데이터에 접근할 수 있는 보안 허점이 있었습니다.\n\nAiToolFactory를 도입하여 Tool 등록 시점에 RBAC 권한을 검증합니다. buildTools() 메서드에서 RedisPermissionService.getOrLoad()로 사용자 권한을 조회하고, hasAccess(perm, companyId, MenuName.RM)이 true인 도메인의 Tool만 선별적으로 등록합니다. PLM 권한이 없는 사용자에게는 PlmTool 자체가 Gemini에 제공되지 않으므로, AI가 해당 도구를 선택할 수조차 없습니다.\n\n판매/구매/견적처럼 입력 메뉴와 현황 메뉴가 분리된 도메인은 hasAnyAccess()로 둘 중 하나라도 권한이 있으면 Tool을 등록합니다. 자금/회계 도메인은 11개 하위 메뉴(자금일보, 입금보고서, 지출보고서, 계정별거래내역, 월별집계표 등) 중 하나라도 접근 가능하면 FundTool을 제공합니다.' },
  ],
}


const highlightContentData: Record<string, Record<string, string>> = {
  'b3d-ods': {
    '25개+ 비즈니스 도메인 통합 관리': '패션 산업에서는 하나의 제품이 기획부터 생산, 판매까지 거치는 동안 PLM(제품 설계/원가), 거래처 관리, 원단·부자재 관리, 구매/판매, 재고, 회계, 전자결재, 인사까지 수많은 업무 시스템을 넘나듭니다. B3D ODS는 이 모든 도메인을 하나의 플랫폼에서 처리할 수 있도록 설계했습니다.\n\n핵심은 도메인 간 독립성을 유지하면서도 데이터가 자연스럽게 연결되는 구조입니다. 예를 들어 PLM에서 제품을 설계하면 거래처(Vendor) 도메인에서 봉제 가능한 공장을 찾고, 원단(Fabric)과 부자재(Item)의 BOM(Bill of Materials)을 구성하고, 이 데이터가 그대로 구매(Purchase)와 판매(Sales) 도메인으로 흘러갑니다. 회계(Fund/Account) 도메인에서는 이 거래 내역을 자금일보와 계정과목별로 자동 집계합니다.\n\n도메인 간 참조는 JPA의 엔티티 관계가 아닌 UUID ID 참조 방식을 채택했습니다. FK 제약 조건 없이 ID로만 연결하여 도메인 간 결합도를 낮추고, 마이그레이션과 스키마 변경의 유연성을 확보했습니다. 대신 서비스 레이어에서 2차 조회(예: vendorId로 거래처명 조회)를 수행하고, QueryDSL의 leftJoin + Tuple 패턴으로 단일 쿼리에서 조인 데이터를 가져와 N+1 문제를 방지합니다.\n\n삭제 시에는 JPA의 @OneToMany cascade 대신 수동 cascade를 구현했습니다. PLM 제품을 삭제하면 연관된 자재(Material), 외주(Outsourcing), 원가(Cost), 댓글(Comment)을 명시적으로 순서대로 삭제합니다. 자동 cascade보다 코드가 길어지지만, 어떤 데이터가 어떤 순서로 삭제되는지 명확하게 제어할 수 있고, 예상치 못한 연쇄 삭제를 방지할 수 있습니다.\n\n모든 엔티티는 BaseEntity를 상속받아 UUID v7 PK, createdAt, updatedAt을 자동 관리합니다. UUID v7은 시간 기반이라 B-tree 인덱스에서 순차 삽입 성능이 우수하고, 분산 환경에서도 ID 충돌이 없습니다. @PrePersist/@PreUpdate 콜백으로 시간 필드를 자동으로 갱신합니다.',
    'Gemini AI Function Calling 기반 자연어 조회': 'Spring AI 2.0.0-M3과 Gemini 2.5 Flash를 결합하여, 사용자가 "이번 달 매출 상위 거래처 보여줘"처럼 자연어로 질문하면 실제 데이터베이스를 조회하여 결과를 반환하는 시스템을 구축했습니다.\n\n동작 방식은 이렇습니다. 사용자가 채팅 메시지를 보내면, AiChatService가 최근 20개 대화 이력과 함께 Gemini API에 요청을 보냅니다. 이때 AiToolFactory가 사용자의 RBAC 권한을 Redis에서 조회하여, 권한이 있는 도메인의 Tool만 선별적으로 등록합니다. PLM 권한이 없는 사용자에게는 PlmTool이 아예 제공되지 않으므로, AI를 통한 우회 접근도 원천 차단됩니다.\n\nGemini가 적절한 Tool을 선택하면(예: VendorTool.searchVendor), 실제 서비스 레이어의 메서드가 호출되어 PostgreSQL에서 데이터를 조회합니다. 조회 결과는 CapturedToolResult에 캡처되어, AiBlockBuilder가 응답 형태에 맞는 Block으로 변환합니다. 거래처 목록 같은 정형 데이터는 TableBlock(테이블)으로, 제품 상세 같은 카드형 데이터는 CardListBlock으로, "더 자세히 알고 싶다면..." 같은 후속 질문은 SuggestionBlock으로 렌더링됩니다.\n\n프론트엔드에서는 BlockRenderer가 block.type에 따라 다형적으로 위젯을 선택합니다. TableBlockWidget은 클립보드 복사, UTF-8 BOM이 포함된 CSV 내보내기, "이 표에서 "로 시작하는 후속 질문 자동 채우기(setPrefillInput) 기능을 제공합니다. 이 구조 덕분에 AI가 반환하는 어떤 형태의 데이터든 구조화된 UI로 표현할 수 있습니다.\n\n대화 이력은 PostgreSQL JSONB 컬럼에 저장되어 브라우저를 닫아도 이전 대화를 이어갈 수 있습니다. 시스템 프롬프트에는 "검색 결과는 마크다운 테이블로 정리", "10건 초과 시 총 건수 안내", "금액은 천단위 콤마 포함" 같은 응답 규칙을 명시하여 일관된 출력을 유도합니다.',
    '멀티 컴퍼니 SaaS 아키텍처': '패션 업계에서는 한 사람이 여러 법인에 소속되는 경우가 흔합니다. 브랜드별로 별도 법인을 두거나, 생산/유통 법인이 분리되어 있기 때문입니다. B3D ODS는 한 사용자가 여러 회사에 동시 소속될 수 있는 멀티 테넌트 구조를 설계했습니다.\n\nuser_company 테이블이 사용자와 회사를 1:N으로 연결하고, 로그인 후 소속 회사 목록에서 작업할 회사를 선택합니다. 선택된 회사 정보는 JWT Access Token에 포함되어 모든 API 요청에 자동으로 전달됩니다. 프론트엔드의 useAuthStore(Zustand)는 선택된 회사를 localStorage에 저장하여 새로고침 후에도 컨텍스트를 유지합니다.\n\n데이터 격리의 핵심은 PermissionInterceptor입니다. 모든 API 요청이 이 인터셉터를 통과하며, JWT에서 추출한 companyId를 request.setAttribute("allowedCompanyIds")로 주입합니다. 서비스 레이어에서는 이 companyId를 QueryDSL의 where 조건에 반드시 포함시켜야 합니다. 개발자가 실수로 companyId 조건을 빠뜨리면 빈 결과가 반환되도록(데이터 유출이 아닌 빈 응답), 모든 엔티티의 companyId 컬럼에 인덱스를 걸어두었습니다.\n\n가장 까다로웠던 부분은 레거시 시스템(D3D_ERP)에서의 마이그레이션이었습니다. 기존 시스템은 단일 회사 구조로, MariaDB 7개 데이터베이스에 140개 이상의 테이블이 있었습니다. 이를 PostgreSQL 단일 DB + companyId 기반 격리로 전환하면서, 기존 데이터에 기본 회사를 할당하고 모든 쿼리에 companyId 필터를 추가하는 작업이 필요했습니다. 회사 전환 시에는 JWT를 재발급하고 Redis 권한 캐시도 함께 갱신하여 컨텍스트가 즉시 반영됩니다.',
    '287개 권한 조합의 RBAC 시스템': '레거시 시스템(D3D_ERP)에서는 권한을 4비트 비트마스크(1111 = CRUD)로 관리했습니다. 단순하긴 했지만 "엑셀 다운로드만 허용", "댓글은 가능하지만 삭제는 불가" 같은 세밀한 제어가 불가능했습니다.\n\nODS에서는 이를 3차원 권한 매트릭스로 재설계했습니다. 첫 번째 축은 41개 메뉴(PLM, 거래처, 판매, 구매, 재고, 자금, 결재, 인사 등), 두 번째 축은 7개 액션(ACCESS, CREATE, UPDATE, DELETE, EXCEL, DOWNLOAD, COMMENT), 세 번째 축은 회사입니다. 같은 사용자라도 A회사에서는 PLM 전체 권한을, B회사에서는 조회만 가능하도록 설정할 수 있습니다.\n\n기술적으로는 @RequirePermission 커스텀 어노테이션과 PermissionInterceptor(HandlerInterceptor)를 조합했습니다. 컨트롤러 메서드에 @RequirePermission(menu = "PLM", action = "CREATE")를 선언하면, 인터셉터가 Redis에서 해당 사용자의 캐시된 권한을 조회하여 접근 가능 여부를 판단합니다. Redis에 캐시가 없거나 장애 시에는 DB로 폴백하는 이중 구조입니다.\n\n권한 저장 방식은 세 번의 전환을 거쳤습니다. 처음에는 빠른 개발을 위해 JWT Access Token에 모든 권한 데이터를 포함시켰습니다. 41메뉴 × 7액션 × 회사별 권한을 JSON으로 넣었더니 토큰 크기가 급격히 커졌고, HTTP 헤더의 최대 크기 제한(약 4~8KB)에 걸려서 요청 자체가 실패하는 문제가 발생했습니다. 그래서 급하게 JWT에서 권한을 빼고, 매 API 요청마다 PostgreSQL에서 TEXT 타입 컬럼으로 저장된 권한 JSON을 직접 조회하는 방식으로 전환했습니다. 동작은 했지만 매 요청마다 DB를 조회하니 응답 속도가 느려졌습니다.\n\n마침 AI 채팅 시스템 구축을 위한 캐시 레이어와 이메일 조회 등에도 Redis가 필요한 상황이었기 때문에, 이참에 Redis를 도입하여 권한 캐싱도 함께 해결했습니다. perm:{userId} 키에 CachedUserPermission 객체를 GenericJacksonJsonRedisSerializer로 직렬화하여 저장하고, TTL 30분으로 설정했습니다. 관리자가 권한을 변경하거나 사용자가 로그아웃/회사 전환을 하면 이벤트 기반으로 즉시 캐시를 무효화합니다. JWT 토큰 크기 문제 → DB 직접 조회의 성능 문제 → Redis 캐싱으로 속도와 일관성 모두 확보한 셈입니다.\n\n프론트엔드에서도 useAuthStore의 menuAccess 상태로 권한을 관리합니다. 로그인 시 서버에서 전체 메뉴 접근 권한을 받아오고, 사이드바 메뉴 표시, 버튼 활성화/비활성화, 페이지 접근 제어에 활용합니다. 역할 템플릿(뷰어, 일반사원, 팀장, 관리자)을 제공하여 신규 사용자에게 빠르게 권한을 부여할 수 있도록 했습니다.',
    'JSP → React 19 점진적 마이그레이션': '레거시 D3D_ERP는 Spring MVC + JSP + Bootstrap + jQuery DataTables 기반이었습니다. API 라우팅조차 RESTful이 아니라 CallData.do?Count=1(PLM 목록), AddData.do?Count=5(데이터 생성) 같은 Count 기반 라우팅을 사용하고 있었습니다. 모든 요청이 단일 HomeController를 통과하는 구조였고, 프론트엔드 상태 관리는 jQuery 글로벌 변수에 의존하고 있었습니다.\n\n운영 중인 서비스를 중단할 수 없었기 때문에 빅뱅 마이그레이션은 불가능했습니다. 대신 "안쪽부터 바꾸기" 전략을 선택했습니다. 먼저 백엔드를 Spring Boot 4 + Kotlin으로 완전히 재작성하여 RESTful API를 구축하고, 프론트엔드는 페이지 단위로 React를 점진적으로 도입했습니다. 사이드바와 헤더를 먼저 전환한 후, ERP → PLM → 결재 → 인사 순서로 각 도메인 화면을 마이그레이션했습니다.\n\n프론트엔드 아키텍처는 서버 상태와 클라이언트 상태를 명확히 분리했습니다. API 데이터는 React Query가 캐싱과 동기화를 담당하고, UI 상태(인증, 테마, 사이드바, 채팅 세션)는 Zustand 스토어로 관리합니다. 폼 처리는 react-hook-form에 Zod 스키마 검증을 결합하여 타입 안전하게 처리합니다.\n\n빌드는 Vite 7로, 개발 서버 시작이 즉각적이고 HMR(Hot Module Replacement)로 코드 변경이 즉시 반영됩니다. UI는 Tailwind CSS 4 + shadcn/ui 컴포넌트 시스템으로 통일하여, 레거시의 Bootstrap 스타일을 일관된 디자인 시스템으로 교체했습니다. FullCalendar(일정 관리), Tiptap(리치 텍스트), @xyflow/react(플로우 다이어그램), big.js(정밀 금액 계산), xlsx(엑셀 처리) 등 도메인별로 필요한 라이브러리를 통합했습니다.\n\n마이그레이션 과정에서 가장 어려웠던 점은 레거시 DB 스키마 전환이었습니다. MariaDB의 7개 데이터베이스, 140개 이상의 테이블을 PostgreSQL 단일 DB로 통합하면서 스키마를 재설계해야 했습니다. clothdata → PlmEntity, rminformation_table → VendorEntity, erp_table → SalesEntity/PurchaseEntity 등 테이블 이름부터 컬럼 구조까지 전면 재설계했고, 4비트 권한 비트마스크를 41메뉴 × 7액션 RBAC으로 확장했습니다.',
    'Kotest BDD + E2E 테스트 자동화': '25개 도메인에 걸친 대규모 리팩토링(UUID v7 전환, 멀티 컴퍼니 전환, categoryTab String→UUID 전환)을 안전하게 수행하려면 자동화된 테스트가 필수였습니다.\n\n백엔드는 Kotest의 DescribeSpec(BDD 스타일)과 MockK를 조합합니다. "describe 판매 서비스 - context 판매 입력 시 - it 거래처가 없으면 BadRequestException을 던진다" 형태로 테스트를 구조화하여, 테스트 코드 자체가 비즈니스 요구사항 문서 역할을 합니다. ERP 전체 도메인(자금, 계정, 판매, 구매, 재고)에 TDD를 적용하여 서비스 레이어의 핵심 로직을 검증합니다.\n\nQueryDSL은 Spring Data JPA 공식 QueryDSL이 deprecated되면서 OpenFeign fork v7.0 + KSP(Kotlin Symbol Processing)로 전환했습니다. KAPT(Kotlin Annotation Processing Tool) 기반에서 KSP로 바꾸면서 Q-클래스(QPlmEntity, QVendorEntity 등) 코드 생성 속도가 크게 향상되었습니다. build.gradle.kts에서 ksp 플러그인 설정과 kotlin.sourceSets.main에 generated 경로를 추가하고, allOpen 플러그인으로 JPA 엔티티의 프록시 생성 문제도 해결했습니다.\n\n프론트엔드는 Vitest로 단위 테스트, Playwright로 E2E 테스트를 수행합니다. E2E 테스트는 실제 브라우저에서 로그인 → 메뉴 진입 → 데이터 조회 → 생성 → 수정 → 삭제의 전체 CRUD 흐름을 자동 검증합니다. 7개 핵심 도메인(PLM, 거래처, 판매, 구매, 결재, 자금, 인사)을 커버하여, 배포 전 회귀 테스트를 자동화했습니다.\n\n이 테스트 인프라의 진짜 가치는 리팩토링에 대한 자신감입니다. categoryTabId를 String에서 UUID로 전환할 때, 백엔드 서비스 + 프론트엔드 API + Zustand 스토어까지 전면 수정해야 했는데, 기존 테스트가 회귀 버그를 사전에 잡아주어 안전하게 배포할 수 있었습니다.',
  },
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
    { title: 'Count 기반 라우팅에서 RESTful API로 전환', content: '레거시 시스템은 단일 HomeController에서 CallData.do?Count=1(PLM 목록), AddData.do?Count=5(데이터 생성) 같은 숫자 기반 라우팅을 사용하고 있었습니다. 205개의 Count 값이 있었고, 새로운 기능을 추가할 때마다 "다음 Count 번호가 뭐지?"를 확인해야 했습니다.\n\n단순히 URL만 바꾸는 게 아니라 API 설계 철학 자체를 전환해야 했습니다. 리소스 중심의 RESTful 엔드포인트(/api/plm/products, /api/sales/entries)로 재설계하고, 공통 응답 포맷(success, data, error, meta)을 도입했습니다. 페이지네이션은 page/size 파라미터와 PaginatedResponse 유틸리티로 통일했습니다.\n\n가장 어려웠던 점은 레거시 DB의 테이블 구조를 새 도메인 모델에 매핑하는 것이었습니다. clothdata → PlmEntity, rminformation_table → VendorEntity, erp_table → SalesEntity/PurchaseEntity로 전환하면서 컬럼 이름, 타입, 관계를 전부 재설계해야 했습니다.' },
    { title: 'AI 응답을 구조화된 UI로 렌더링하기', content: 'Gemini AI가 Function Calling으로 데이터를 조회한 뒤, 결과를 사용자에게 어떻게 보여줄지가 가장 큰 고민이었습니다. AI가 마크다운 테이블로 응답하면 읽기 어렵고, JSON을 그대로 보여주면 일반 사용자가 이해할 수 없습니다.\n\nBlock UI 시스템을 설계했습니다. AI의 Tool 실행 결과를 CapturedToolResult로 캡처하고, AiBlockBuilder가 데이터 형태에 따라 적절한 Block 타입(TextBlock, TableBlock, CardListBlock, SuggestionBlock)으로 변환합니다. 프론트엔드의 BlockRenderer는 block.type을 switch문으로 분기하여 각 Block에 맞는 위젯을 렌더링합니다.\n\nTableBlockWidget에서는 테이블 데이터를 클립보드에 복사(탭 구분)하거나, UTF-8 BOM이 포함된 CSV로 내보낼 수 있습니다. "수정 요청" 버튼을 누르면 useChatStore의 setPrefillInput("이 표에서 ")이 호출되어, 다음 메시지 입력창에 자동으로 텍스트가 채워집니다. 이런 식으로 데이터 조회 → 확인 → 후속 질문이 자연스럽게 이어지는 UX를 만들었습니다.' },
    { title: 'Redis 권한 캐시 일관성 문제', content: '287개 권한 조합을 매 API 요청마다 DB에서 조회하면 성능 문제가 심각했습니다. Redis에 TTL 30분으로 캐싱했더니 속도는 개선되었지만, 관리자가 사용자 권한을 변경해도 최대 30분간 이전 권한이 유지되는 문제가 발생했습니다.\n\nPermissionInterceptor에 이중 조회 전략을 구현했습니다. 1차로 Redis에서 캐시를 조회하고(checkWithRedis), Redis 장애나 캐시 미스 시 DB로 폴백합니다(checkWithFallback). 권한 변경, 로그아웃, 회사 전환 시점에는 해당 사용자의 perm:{userId} 키를 즉시 삭제하는 이벤트를 발행합니다.\n\n이렇게 하면 일반적인 API 호출(99%+)에서는 Redis 캐시의 성능 이점을 누리면서도, 권한 변경이 즉시 반영되는 일관성을 보장합니다. Redis가 다운되어도 DB 폴백으로 서비스가 중단되지 않습니다.' },
    { title: 'Selective Update — null이면 건너뛰기 패턴', content: '업데이트 API에서 "전송하지 않은 필드는 기존 값을 유지"하는 패턴이 필요했습니다. PUT은 전체 교체, PATCH는 부분 수정인데, 프론트엔드에서 변경된 필드만 전송하는 구조를 원했습니다.\n\nKotlin의 let 스코프 함수를 활용한 Selective Update 패턴을 도입했습니다. req.vendorId?.let { entity.vendorId = it } 형태로, DTO 필드가 null이면 건너뛰고 값이 있을 때만 엔티티를 갱신합니다. 이 방식으로 프론트엔드는 변경된 필드만 전송하면 되고, 서버는 null/non-null로 "변경 의도"를 판별합니다.\n\n다만 "명시적으로 null로 초기화하고 싶은 경우"와 "전송하지 않은 경우"를 구분할 수 없는 한계가 있어, 필수 필드에는 이 패턴을 적용하지 않고 별도 검증 로직을 두었습니다.' },
    { title: 'categoryTabId를 String에서 UUID로 전환', content: 'PLM과 KM 도메인에서 카테고리 탭을 문자열(String)로 관리하고 있었습니다. "샘플", "생산", "완료" 같은 텍스트를 직접 저장하는 방식이었는데, 탭 이름을 변경하면 해당 탭에 속한 모든 데이터를 업데이트해야 하는 문제가 있었습니다.\n\ncategoryTabId를 UUID FK 참조로 전환하여, 탭 이름이 바뀌어도 참조 ID는 그대로 유지되도록 개선했습니다. 이 과정에서 백엔드 엔티티, QueryDSL 쿼리, DTO, 프론트엔드의 필터링 로직(Zustand 스토어 + React Query), API 호출을 모두 수정해야 했습니다.\n\n특히 프론트엔드에서 categoryTabIds를 List<UUID>로 받아 다중 탭 필터링을 지원하도록 확장한 것이 큰 변경이었습니다. 기존 테스트(Kotest + Vitest)가 회귀 버그를 잡아주어 안전하게 전환할 수 있었습니다.' },
    { title: 'MariaDB 7개 DB → PostgreSQL 단일 DB 통합 재설계', content: '레거시 D3D_ERP는 MariaDB 10.2에서 7개 데이터베이스에 140개 이상의 테이블을 분산 저장하고 있었습니다. 데이터베이스 간 JOIN이 불가능해서 애플리케이션 레벨에서 데이터를 합쳐야 했고, 트랜잭션도 단일 DB 내에서만 보장되는 구조적 한계가 있었습니다.\n\nPostgreSQL 단일 DB로 통합하면서 스키마를 전면 재설계했습니다. 기존 INT auto_increment PK를 UUID v7으로 전환하여 분산 환경 대비와 B-tree 인덱스 최적화를 동시에 확보했습니다. 멀티 테넌트를 위해 모든 주요 테이블에 company_id 컬럼과 복합 인덱스(idx_*_company)를 추가했습니다. 판매(sales) 테이블처럼 날짜 기반 조회가 빈번한 경우에는 company_id + sales_date 복합 인덱스를 걸어 범위 쿼리를 최적화했습니다.\n\nHibernate 배치 처리 설정도 세밀하게 조정했습니다. jdbc.batch_size=50으로 대량 INSERT/UPDATE를 배치 처리하고, order_inserts=true, order_updates=true로 SQL 순서를 최적화하여 DB 라운드트립을 줄였습니다. open-in-view=false로 설정하여 Lazy Loading이 서비스 레이어 안에서만 동작하도록 제한하고, 의도치 않은 N+1 쿼리를 방지했습니다.' },
    { title: 'QueryDSL N+1 문제 → leftJoin + Tuple 패턴으로 해결', content: '판매 목록을 조회할 때 SalesEntity만 가져오면 거래처명과 담당자명이 빠집니다. 각 판매 건마다 VendorEntity와 UserEntity를 추가 조회하면 100건 목록에 200번의 추가 쿼리가 발생하는 N+1 문제가 생겼습니다.\n\nQueryDSL의 leftJoin + Tuple select 패턴으로 해결했습니다. select(sales, vendor.companyName, user.name).from(sales).leftJoin(vendor).on(sales.vendorId.eq(vendor.id)).leftJoin(user).on(sales.userId.eq(user.id)) 형태로 단일 쿼리에서 필요한 데이터를 모두 가져옵니다. Tuple에서 t.get(sales), t.get(vendor.companyName)으로 타입 안전하게 추출합니다.\n\n집계 쿼리도 같은 패턴을 활용합니다. 거래처별 매출 랭킹은 groupBy(sales.vendorId, vendor.companyName)으로 그룹핑하고 orderBy(totalAmountSum.desc())로 정렬합니다. 월별 추이는 TO_CHAR(salesDate, \'YYYY-MM\') PostgreSQL 함수를 Expressions.stringTemplate으로 감싸서 월 단위 그룹핑을 구현했습니다.\n\nKotlin 2.2 K2 컴파일러에서 QueryDSL의 sum() 메서드가 타입 추론에 실패하는 문제가 있어서, sumOf() 확장 함수를 직접 작성하여 Expressions.numberOperation으로 SUM_AGG를 수동 호출하는 워크어라운드를 적용했습니다. andDateRange(), andCompanyIds() 같은 BooleanBuilder 확장 함수도 만들어서 동적 필터 조합 코드를 간결하게 유지합니다.' },
    { title: 'JWT 토큰 크기 초과 → DB 폴백 → Redis 캐싱 3단계 전환', content: '초기에는 빠른 개발을 위해 JWT Access Token에 287개 권한 조합(41메뉴 × 7액션 × 회사별)을 JSON으로 포함시켰습니다. 개발 초기에는 문제가 없었지만 권한 데이터가 커지면서 토큰이 HTTP 헤더의 최대 크기 제한(약 4~8KB)을 초과하여 요청 자체가 실패하는 심각한 버그가 발생했습니다.\n\n급하게 JWT에서 권한을 빼고, 매 API 요청마다 PostgreSQL에서 권한을 조회하는 방식으로 전환했습니다. PermissionEntity를 roleId로 조회하고 buildActions()로 canRead/canWrite/canEdit 등 7개 boolean 플래그를 액션 문자열 리스트로 변환하는 로직입니다. 동작은 했지만 매 요청마다 userCompany → role → permission → sidebarMenu 4개 테이블을 조인하는 쿼리가 실행되니 체감 지연이 있었습니다.\n\n마침 AI 채팅 시스템의 대화 컨텍스트 캐싱과 이메일 인증 등에도 인메모리 캐시가 필요한 상황이어서, Redis를 도입하면서 권한 캐싱도 함께 해결했습니다. RedisPermissionService의 getOrLoad() 메서드가 핵심인데, Redis에서 perm:{userId} 키를 조회하고 캐시 히트하면 즉시 반환, 미스하면 DB에서 buildFromDb()로 전체 권한 매트릭스를 구축한 뒤 Redis에 30분 TTL로 저장합니다.\n\nbuildFromDb()는 한 번의 호출로 사용자의 전체 권한을 로드합니다. userCompanyRepository에서 소속 회사 목록을 가져오고, roleRepository와 permissionRepository를 배치로 조회하여 roleIds 기반 IN 쿼리로 한 번에 가져옵니다. positionRepository도 positionIds를 distinct()한 뒤 findAllById()로 배치 조회합니다. 이렇게 하면 사용자가 5개 회사에 소속되어 있어도 DB 쿼리는 4~5회로 고정됩니다.\n\nRedis 장애 대비도 구현했습니다. PermissionInterceptor에서 try { checkWithRedis() } catch { checkWithFallback() } 패턴으로, Redis가 다운되어도 DB 폴백으로 서비스가 중단되지 않습니다. 캐시 무효화는 권한 변경, 로그아웃, 회사 전환 시 evict(userId)를 호출하여 즉시 삭제합니다.' },
    { title: 'Hibernate 배치 처리 + open-in-view=false 최적화', content: 'PLM 제품 복사 기능에서 제품 1건을 복사하면 자재(Material), 외주(Outsourcing), 원가(Cost), 원가항목(CostItem)까지 연쇄적으로 복사해야 합니다. 초기에는 각 엔티티를 개별 save()로 저장했더니 제품 하나 복사에 수십 번의 INSERT가 개별 실행되었습니다.\n\nHibernate의 jdbc.batch_size=50, order_inserts=true, order_updates=true 설정을 적용하여, 같은 테이블의 INSERT/UPDATE를 모아서 배치로 실행하도록 했습니다. 자재 10건을 복사할 때 10번의 개별 INSERT 대신 1번의 배치 INSERT로 처리됩니다.\n\nopen-in-view=false 설정도 중요한 최적화였습니다. 기본값(true)에서는 HTTP 요청 전체 범위에서 JPA 세션이 열려 있어서, 컨트롤러에서 반환하는 시점에도 Lazy Loading이 발동될 수 있습니다. 이러면 예측 불가능한 N+1 쿼리가 발생하고, 트랜잭션 밖에서 DB 커넥션을 물고 있어 커넥션 풀이 고갈될 수 있습니다. false로 설정하면 @Transactional 범위 안에서만 Lazy Loading이 동작하므로, 서비스 레이어에서 필요한 데이터를 DTO로 변환한 뒤 반환하는 명확한 패턴을 강제합니다.\n\nHikariCP 커넥션 풀은 maximum-pool-size=10으로 설정하고, auto-commit=false로 트랜잭션 제어를 Spring에 위임합니다. 서비스 클래스에 @Transactional(readOnly = true)를 기본 적용하고, 쓰기 메서드만 @Transactional로 오버라이드하여 읽기 전용 트랜잭션에서는 PostgreSQL이 더 가벼운 스냅샷 격리를 사용하도록 했습니다.' },
  ],
  'readip': [
    { title: 'Supabase → Spring Boot 전환 — 인증/API 전면 재설계', content: 'MVP 단계에서 Supabase(BaaS)로 빠르게 개발했지만, 비즈니스 로직이 복잡해지면서 Edge Function의 한계에 부딪혔습니다. 특히 RevenueCat 웹훅 처리, 복잡한 쿼리, 트랜잭션 관리가 어려워 Spring Boot로 전환을 결정했습니다.\n\n전환은 2단계로 진행했습니다. 1단계에서 SupabaseApi를 ReadipApi로 전면 교체하고 Koin DI를 세팅했습니다. 모든 Screen에서 koinInject<ReadipApi>()로 전환하고, expect/actual로 플랫폼별 서버 URL(Android: 10.0.2.2, iOS: localhost)을 분리했습니다.\n\n2단계에서 Supabase Auth를 Spring Boot의 /auth/google, /auth/apple 엔드포인트로 전환하고, supabase/ 디렉토리(config, migrations, edge functions)를 전부 삭제했습니다. 데이터 모델도 snake_case에서 camelCase로 전면 전환하여 서버 표준에 맞췄습니다.' },
    { title: '리더 패딩 플랫폼별 동적 계산 — 8번의 수정', content: '리더 화면의 상단/하단 패딩을 맞추는 데 8번의 커밋이 필요했습니다. Android와 iOS의 상태바, 네비게이션 바 높이가 다르고, Compose Multiplatform의 WindowInsets 처리 방식이 플랫폼마다 달랐기 때문입니다.\n\n초기에는 하드코딩(40dp)으로 처리했지만 기기마다 달라서 실패했습니다. WindowInsets.statusBars로 전환한 후에도 App.kt에서 이미 inset을 처리하고 있어 이중 적용되는 문제가 발생했습니다.\n\n최종적으로 상태바 높이를 실측하여 동적 계산하는 방식으로 해결했습니다: (48dp - statusBarHeight).coerceAtLeast(8dp). Android(~24dp 상태바) → 24dp 패딩, iOS(~59dp 상태바) → 8dp 패딩으로 플랫폼별 최적값을 적용했습니다.' },
    { title: 'Pull-to-Refresh 무한 로딩 — LaunchedEffect 의존성 문제', content: '홈 화면에서 Pull-to-Refresh를 추가한 후, 새로고침이 완료되지 않고 무한 로딩 인디케이터가 표시되는 버그가 발생했습니다.\n\n원인은 loadData() 시작 시 isLoaded 상태를 false로 리셋하지 않아서, LaunchedEffect가 데이터 로딩 완료를 감지하지 못하는 것이었습니다. Compose의 LaunchedEffect는 key 값이 변경될 때만 재실행되는데, isLoaded가 이미 true인 상태에서 refresh를 호출하면 상태 변화가 없어 UI가 갱신되지 않았습니다.\n\nloadData() 시작 시점에 isLoaded = false를 명시적으로 리셋하여 해결했습니다.' },
    { title: 'UI 공통화로 3,100줄 감소 — 위젯 추출 전략', content: '6개 화면에서 동일한 책 카드, 헤더, 정렬 바텀시트를 각각 구현하고 있어 코드 중복이 심했습니다. 특히 BookGridCard가 홈 섹션과 전체 보기 6곳에서 거의 같은 코드로 반복되고, SortBottomSheet도 5개 화면에 복사되어 있었습니다.\n\n공통 위젯 5개(BookGridCard, BookRowCard, BookListHeader, SortBottomSheet, HorizontalBookSection)를 추출하고, TagChip, LevelTagChip 등 소규모 위젯도 분리했습니다. 약 3,100줄이 감소했고, 새로운 목록 화면 추가 시 위젯 조합만으로 개발이 가능해졌습니다.' },
    { title: 'API 토큰 동시 갱신 Race Condition — Mutex 보호', content: '여러 API를 병렬로 호출하는 홈 화면에서, 토큰이 만료된 상태로 5개 요청이 동시에 발생하면 5개 모두 401을 받고, 5개 모두 토큰 갱신을 시도하는 문제가 발생했습니다.\n\nKotlin Coroutines의 Mutex로 토큰 갱신 로직을 보호하여, 첫 번째 요청만 실제 갱신을 수행하고 나머지는 갱신 완료를 기다린 후 새 토큰으로 재시도하도록 했습니다. 401/403 응답 시 자동으로 토큰을 갱신하고 원래 요청을 재전송하는 인터셉터를 ApiClient에 구현했습니다.' },
    { title: '서버 사이드 페이지 분할 알고리즘 설계', content: '화면 크기가 기기마다 달라서 동일한 책이라도 페이지 수가 달라지는 문제가 있었습니다. 처음에는 클라이언트에서 CSS column으로 페이지를 나눴는데, 페이지 번호가 기기마다 달라 "나 지금 42페이지야"라는 대화가 성립하지 않았습니다.\n\nPageSplitService를 만들어 서버에서 페이지를 분할하도록 전환했습니다. 클라이언트가 charsPerLine과 linesPerPage를 전송하면, 서버가 HTML 콘텐츠를 파싱하여 블록 경계(paragraph, heading, blockquote)를 존중하면서 페이지를 나눕니다. 단순히 글자 수로 자르는 게 아니라 HTML 태그를 제외한 실제 표시 문자만 세고, h2 태그는 항상 새 페이지에서 시작하도록 처리했습니다.\n\n성능을 위해 LRU 캐시(최대 200개)를 도입하여 bookId|charsPerLine|linesPerPage 조합으로 캐싱합니다. 같은 기기에서 같은 책을 다시 열면 캐시에서 즉시 반환됩니다.' },
    { title: 'Google/Apple 멀티 프로바이더 인증 통합', content: 'Android는 Google Credential Manager, iOS는 네이티브 Apple Sign-In을 사용하는데, 두 플랫폼의 인증 흐름이 완전히 다릅니다. Google은 idToken을 서버에서 /tokeninfo 엔드포인트로 검증하고, Apple은 JWT를 직접 파싱하여 JWKS(JSON Web Key Set)의 RSA 공개키로 서명을 검증해야 합니다.\n\nKMP의 expect/actual 패턴으로 AuthManager를 플랫폼별로 구현했습니다. Android에서는 GetGoogleIdOption + CredentialManager로 OAuth2 Web Client ID 기반 인증을 처리하고, iOS에서는 AppleSignInBridge를 통해 네이티브 코드와 Kotlin을 연결합니다.\n\n서버의 AuthService에서 verifyGoogleToken()은 Google의 tokeninfo API로 aud(audience)를 검증하고, verifyAppleToken()은 Apple의 JWKS에서 kid(Key ID)로 공개키를 찾아 JWT 서명을 RSA로 검증합니다. 이메일 없이 가입한 Apple 유저는 {providerId}@privaterelay.appleid.com 형태의 placeholder 이메일을 부여합니다.\n\n가장 어려웠던 점은 Apple의 이메일 정책이었습니다. Apple은 첫 로그인 시에만 이메일을 제공하고, 이후에는 sub(subject) 클레임만 반환합니다. 첫 로그인에서 이메일을 저장하지 못하면 영원히 받을 수 없어서, 인증 응답을 즉시 DB에 저장하는 로직을 최우선으로 배치했습니다.' },
    { title: '홈 화면 데이터 병렬 로딩 + 24시간 캐시', content: '홈 화면에서 "이어 읽기", "짧은 글", "긴 글", 장르별 도서, CEFR 레벨별 도서를 한 번에 로딩하는데, API를 순차적으로 호출하면 첫 화면이 뜨기까지 3~4초가 걸렸습니다.\n\nOrbit MVI의 intent 블록 안에서 supervisorScope + async를 조합하여 모든 API를 병렬로 호출하도록 개선했습니다. continueReading, shortReads, longReads, stats 4개 요청을 동시에 보내고 awaitAll()로 모아서 한 번에 state를 갱신합니다. 하나의 요청이 실패해도 다른 요청에 영향을 주지 않도록 supervisorScope를 사용했습니다.\n\n짧은 글/긴 글 같이 자주 변하지 않는 데이터는 HomeViewModel에서 24시간 TTL로 캐싱하여, 앱을 다시 열 때 캐시된 데이터를 먼저 보여주고 백그라운드에서 갱신합니다. 이렇게 하면 홈 화면 진입이 즉각적으로 느껴집니다.' },
    { title: 'Guest → 로그인 전환 시 데이터 마이그레이션', content: 'Guest 모드에서 책을 읽고 단어를 저장한 뒤 로그인하면, Guest 시절의 읽기 진행률과 저장 단어를 서버로 이관해야 하는 문제가 있었습니다.\n\nGuest의 데이터는 KMP DataStore에 로컬 저장됩니다. guestStartedBookIds(시작한 책 목록), guestStartedBookCount(제한 체크용), 페이지별 읽기 위치가 기기에만 존재합니다. 로그인 성공 시 이 로컬 데이터를 서버에 일괄 업로드하고, 서버 측에서 이미 존재하는 데이터와 충돌 시 max() 정책(더 많이 읽은 쪽을 유지)으로 병합합니다.\n\n로컬 데이터 업로드 완료 후 Guest 관련 DataStore 키를 정리하여 이중 상태를 방지합니다.' },
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
              { title: '변경 사항', items: changelogData[project.id], defaultOpen: true },
              { title: '개선 사항', items: improvementData[project.id], defaultOpen: true },
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
                  images={Array.from({ length: 12 }, (_, i) => `https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/ir-deck-${String(i + 1).padStart(2, '0')}.png`)}
                  title="IR Deck"
                  accent="#f59e0b"
                />
              </div>

              {/* Primer Application */}
              <div className="mb-8">
                <h3 className="mb-4 text-[15px] font-semibold text-text-primary">프라이머 배치 28기 지원</h3>
                <div className="overflow-hidden rounded-xl border border-border bg-[#f8f9fa]">
                  <img
                    src="https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/primer-apply-1.png"
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
