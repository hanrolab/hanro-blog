export interface Project {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  readonly description: string
  readonly role: string
  readonly year: string
  readonly techStack: readonly string[]
  readonly techDetail?: {
    readonly frontend?: readonly string[]
    readonly backend?: readonly string[]
    readonly infra?: readonly string[]
  }
  readonly highlights: readonly string[]
  readonly status: 'in-progress' | 'completed' | 'operating'
  readonly category: string
  readonly mockupType: 'web' | 'mobile' | 'book'
  readonly accent?: string
  readonly noDeviceFrame?: boolean
  readonly images?: {
    readonly hero?: string
    readonly desktop?: string
    readonly tablet?: string
    readonly mobile?: string
  }
}

export const projects: readonly Project[] = [
  {
    id: 'b3d-ods',
    title: 'B3D ODS',
    subtitle: 'Fashion Industry SaaS Platform',
    description:
      'PLM, ERP, KM, HR, AI 챗봇을 통합한 패션 산업 특화 클라우드 솔루션. 25개 이상의 도메인을 다루며, 멀티 컴퍼니 SaaS 구조로 설계. Gemini AI를 활용한 자연어 기반 데이터 조회와 디자인 AI 기능 포함.',
    role: 'Full-Stack Developer',
    year: '2026 —',
    techStack: [
      'React 19',
      'TypeScript',
      'Spring Boot 4',
      'Kotlin',
      'PostgreSQL',
      'QueryDSL',
      'Tailwind CSS',
      'shadcn/ui',
      'Zustand',
      'React Query',
      'Gemini AI',
      'Redis',
    ],
    highlights: [
      '25개+ 비즈니스 도메인 통합 관리',
      'Gemini AI 기반 자연어 데이터 조회',
      '멀티 컴퍼니 SaaS 아키텍처',
      'JWT + Redis 기반 인증/권한 시스템',
      'TipTap 리치 텍스트 에디터 통합',
      'Drag & Drop 기반 워크플로우',
    ],
    status: 'in-progress',
    category: 'WEB APP',
    techDetail: {
      frontend: ['React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Zustand', 'React Query'],
      backend: ['Spring Boot 4', 'Kotlin', 'JPA', 'QueryDSL', 'Gemini AI'],
      infra: ['PostgreSQL', 'Redis', 'MinIO', 'Docker'],
    },
    mockupType: 'web',
    accent: '#6366f1',
    images: {
      desktop: '/images/b3d-desktop.png',
      tablet: '/images/b3d-tablet.png',
      mobile: '/images/b3d-mobile.png',
    },
  },
  {
    id: 'readip',
    title: 'Readip',
    subtitle: 'AI-Powered Language Learning Platform',
    description:
      '영어 원서를 읽으며 문맥 속에서 단어를 학습하는 크로스플랫폼 앱. Gemini AI 기반 실시간 번역, CEFR 레벨별 도서 콘텐츠, 단어 저장 및 학습 통계, RevenueCat 기반 수익화까지 갖춘 풀스택 프로덕트.',
    role: 'Full-Stack Developer',
    year: '2026 —',
    techStack: [
      'Kotlin Multiplatform',
      'Compose',
      'Spring Boot 4',
      'PostgreSQL',
      'Gemini AI',
      'Next.js',
      'Supabase',
      'RevenueCat',
    ],
    highlights: [
      'KMP로 Android/iOS 동시 지원 (코드 80%+ 공유)',
      'Gemini AI 기반 문맥 인식 번역',
      'CEFR A1~C2 레벨별 도서 큐레이션',
      'Orbit MVI + Widget-Section-Screen 아키텍처',
      'RevenueCat 기반 Freemium 수익화',
      'Next.js 관리자 대시보드',
    ],
    status: 'operating' as const,
    category: 'MOBILE APP',
    techDetail: {
      frontend: ['Compose Multiplatform', 'Material 3', 'Orbit MVI'],
      backend: ['Spring Boot 4', 'Kotlin', 'JPA', 'QueryDSL', 'Gemini AI'],
      infra: ['PostgreSQL', 'Supabase', 'Next.js Admin'],
    },
    mockupType: 'mobile',
    accent: '#10b981',
    images: {
      mobile: '/images/readip-mobile.png',
    },
  },
  {
    id: 'realm',
    title: 'Realm',
    subtitle: 'Workspace Productivity & Collaboration Platform',
    description:
      '문서, 드라이브, 캘린더 등 여러 SaaS를 사용하면서 데이터를 많이 다루는데, 매번 유료 구독하는 게 아까워서 직접 만든 올인원 워크스페이스입니다. 칸반 보드, 문서 편집기, 화이트보드, ERD 다이어그램, 캘린더, 대시보드를 하나의 플랫폼에 통합했고, Tauri 데스크톱 앱과 웹을 동시 지원합니다.',
    role: 'Full-Stack Developer',
    year: '2026 —',
    techStack: [
      'React 19',
      'TypeScript',
      'Tauri',
      'Kotlin',
      'Spring Boot 3',
      'PostgreSQL',
      'Cloudflare R2',
      'TipTap',
      'tldraw',
    ],
    highlights: [
      '칸반/간트/캘린더/리스트 4가지 보드 뷰',
      'TipTap 리치 텍스트 + tldraw 화이트보드 통합',
      '통합 검색 시스템',
      'Tauri 크로스플랫폼 데스크톱 앱 (macOS, Windows, Linux)',
      'Google OAuth2 + JWT 인증 (Access 15분, Refresh 7일)',
      'R2 Presigned URL 파일 업로드',
      'ERD 다이어그램 에디터',
      'Gmail OAuth 연동',
      '18개 테이블, Flyway 마이그레이션',
      'GCP Cloud Run 배포',
    ],
    status: 'in-progress',
    category: 'DESKTOP / WEB',
    techDetail: {
      frontend: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Zustand', 'React Query', 'TipTap', 'tldraw', 'dnd-kit'],
      backend: ['Kotlin', 'Spring Boot 3', 'Spring Security', 'JPA', 'QueryDSL', 'JWT'],
      infra: ['PostgreSQL', 'Cloudflare R2', 'GCP Cloud Run', 'Docker', 'Tauri'],
    },
    mockupType: 'web',
    accent: '#8b5cf6',
    images: {
      hero: '/images/realm-docs.png',
      desktop: '/images/realm-hero.png',
      tablet: '/images/realm-calendar.png',
      mobile: '/images/realm-erd.png',
    },
  },
  {
    id: 'mungnyanglog',
    title: '멍냥로그',
    subtitle: 'Pet Care & Family Sharing Platform',
    description:
      '산책, 건강, 일상을 기록하며 가족 구성원과 반려동물의 유대감을 높이고, 실종동물 정보를 자연스럽게 접해 주변의 실종동물을 빠르게 찾을 수 있도록 기획한 크로스플랫폼 앱. GPS 실시간 산책 추적, AI 펫 상담사, 가족 그룹 공유, 실종동물 알림 등을 갖춘 1인 창업 프로젝트.',
    role: 'Founder & Developer',
    year: '2025 — 2026',
    techStack: [
      'Kotlin Multiplatform',
      'Compose Multiplatform',
      'Spring Boot 4',
      'Spring AI',
      'PostgreSQL',
      'Firebase',
      'GCP Cloud Storage',
      'QueryDSL',
    ],
    highlights: [
      'Firebase OAuth 인증 (Google / Apple)',
      '가족 그룹 생성 / 초대 / 권한 관리',
      'GPS 실시간 산책 추적 (경로 시각화, 거리/시간)',
      'GCP Signed URL 미디어 보안',
      'FCM 푸시 알림 + 딥링크 네비게이션',
      'Spring AI Function Calling 기반 AI 펫 상담사',
      '가족 범위 게시글 공유 (사진/미디어, 펫 태깅)',
      '사업자 등록 후 투자 유치 시도',
      '카페 운영과 병행하며 1인 개발',
    ],
    status: 'completed',
    category: 'MOBILE APP',
    techDetail: {
      frontend: ['Kotlin Multiplatform', 'Compose Multiplatform', 'Voyager', 'Orbit MVI', 'Koin', 'KMP Maps', 'Coil'],
      backend: ['Spring Boot 4', 'Kotlin', 'Spring AI', 'JPA', 'QueryDSL', 'Firebase Auth'],
      infra: ['GCP Cloud Run', 'GCP Cloud Storage', 'Firebase FCM', 'PostgreSQL'],
    },
    mockupType: 'mobile',
    accent: '#f59e0b',
    noDeviceFrame: true,
    images: {
      hero: '/images/mungnyanglog-hero.png',
      mobile: '/images/mungnyanglog-health-record.png',
      desktop: '/images/mungnyanglog-ai-chat.png',
    },
  },
] as const
