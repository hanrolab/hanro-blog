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
      'Gemini AI Function Calling 기반 자연어 조회',
      '멀티 컴퍼니 SaaS 아키텍처',
      '287개 권한 조합의 RBAC 시스템',
      'JSP → React 19 점진적 마이그레이션',
      'Kotest BDD + E2E 테스트 자동화',
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
      desktop: 'https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/b3d-desktop.png',
      tablet: 'https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/b3d-tablet.png',
      mobile: 'https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/b3d-mobile.png',
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
      'AWS',
      'RevenueCat',
    ],
    highlights: [
      'KMP로 Android/iOS 동시 지원 (코드 80%+ 공유)',
      'Gemini AI 기반 문맥 인식 번역',
      'CEFR A1~C2 레벨별 도서 큐레이션',
      'Orbit MVI + Widget-Section-Screen 아키텍처',
      'RevenueCat 기반 Freemium 수익화',
      'Next.js 관리자 대시보드',
      '퀴즈 · 플래시카드 단어 학습',
      'Google/Apple 멀티 프로바이더 인증',
    ],
    status: 'operating' as const,
    category: 'MOBILE APP',
    techDetail: {
      frontend: ['Compose Multiplatform', 'Material 3', 'Orbit MVI', 'Koin', 'Ktor'],
      backend: ['Spring Boot 4', 'Kotlin', 'JPA', 'QueryDSL'],
      infra: ['PostgreSQL', 'AWS EC2', 'Next.js Admin'],
    },
    mockupType: 'mobile',
    accent: '#10b981',
    images: {
      mobile: 'https://pub-fce05bb72018417aa88c032932bfeb49.r2.dev/portfolio/readip-mobile.png',
    },
  },
] as const
