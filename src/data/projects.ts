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
  readonly images?: {
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
    subtitle: 'Developer Productivity Desktop App',
    description:
      '개발자를 위한 올인원 데스크톱 생산성 도구. 프로젝트 관리, 코드 스니펫 저장, API 테스트, 마크다운 노트를 하나의 앱에서 제공. Electron 기반 크로스플랫폼(macOS, Windows, Linux) 지원.',
    role: 'Full-Stack Developer',
    year: '2026 —',
    techStack: [
      'Electron',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'SQLite',
      'tRPC',
    ],
    highlights: [
      '프로젝트별 워크스페이스 관리',
      '코드 스니펫 저장 및 검색 (100+ 언어 하이라이팅)',
      '내장 API 클라이언트 (REST, GraphQL)',
      '마크다운 노트 + 위키 링크',
      'SQLite 로컬 데이터 저장 (오프라인 지원)',
      '크로스플랫폼 (macOS, Windows, Linux)',
    ],
    status: 'in-progress',
    category: 'DESKTOP / WEB',
    techDetail: {
      frontend: ['React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
      backend: ['Electron', 'tRPC', 'SQLite'],
      infra: ['Auto Update', 'GitHub Releases'],
    },
    mockupType: 'web',
    accent: '#8b5cf6',
    images: {
      desktop: '/images/realm-desktop.png',
    },
  },
  {
    id: 'mungnyanglog',
    title: '멍냥로그',
    subtitle: '반려동물 기록 & 커뮤니티 앱',
    description:
      '반려동물의 일상을 기록하고 공유하는 모바일 앱. 사업자 등록 후 투자 유치를 시도했으며, 카페 운영과 병행하며 개발. 펫 프로필, 건강 기록, 사진 일기, 커뮤니티 기능을 포함.',
    role: 'Founder & Developer',
    year: '2025 — 2026',
    techStack: [
      'Kotlin',
      'Jetpack Compose',
      'Spring Boot',
      'PostgreSQL',
      'Firebase',
    ],
    highlights: [
      '사업자 등록 후 투자 유치 시도',
      '반려동물 프로필 & 건강 기록 관리',
      '사진 일기 및 커뮤니티 기능',
      '카페 운영과 병행하며 1인 개발',
    ],
    status: 'completed',
    category: 'MOBILE APP',
    techDetail: {
      frontend: ['Kotlin', 'Jetpack Compose'],
      backend: ['Spring Boot', 'PostgreSQL'],
      infra: ['Firebase', 'Docker'],
    },
    mockupType: 'mobile',
    accent: '#f59e0b',
  },
] as const
