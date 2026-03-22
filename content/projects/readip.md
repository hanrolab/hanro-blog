# Readip

## 한줄 소개
영어 원서를 읽으며 문맥 속에서 단어를 학습하는 AI 기반 언어 학습 플랫폼

## 카테고리
Mobile App (Cross-Platform)

## 역할
Full-Stack Developer (1인 개발)

## 기간
2024 — Present (진행중)

## 상태
Active Development

---

## 프로젝트 개요

Readip은 영어 원서 읽기를 통해 어휘력을 자연스럽게 향상시키는 언어 학습 앱입니다.
CEFR 기준(A1~C2) 레벨별로 분류된 도서 콘텐츠를 제공하며,
읽는 도중 모르는 단어를 선택하면 **Gemini AI**가 문맥에 맞는 번역과 정의를 즉시 제공합니다.

학습한 단어는 자동으로 저장되어 복습할 수 있으며,
독서 진행률 추적, 주간/연간 학습 통계 등 체계적인 학습 관리 기능을 갖추고 있습니다.

---

## 기술 스택

### Mobile (Kotlin Multiplatform)
- Kotlin 2.3.0 + Compose Multiplatform 1.10.0
- Android & iOS 동시 지원 (코드 80%+ 공유)
- Orbit MVI (상태 관리)
- Navigation Compose 3 (Type-safe 라우팅)
- Ktor Client 3.3.3 (HTTP)
- Koin (DI), Coil 3 (이미지 로딩), Kermit (로깅)
- Material 3 + Lucide Icons

### Backend (Spring Boot)
- Spring Boot 4.0.3 + Kotlin 2.2.21
- Spring Data JPA + PostgreSQL 16
- QueryDSL (OpenFeign KSP - 컴파일 타임 코드 생성)
- Spring Security + JWT (JJWT 0.12.6)
- Jakarta Bean Validation

### Admin Dashboard
- Next.js 16.1.6 + React 19
- Tailwind CSS 4
- Supabase JS SDK

### 인프라
- PostgreSQL 16 (Docker 로컬 / Supabase 프로덕션)
- Docker Compose
- Google Play Store / Apple App Store 배포

---

## 핵심 기능

### 1. AI 기반 실시간 번역
- 텍스트 선택 → Gemini AI가 문맥에 맞는 번역 즉시 제공
- Google Translate API 폴백 지원
- Rate limiting 대응 (지수 백오프, 3회 재시도)
- 단어뿐 아니라 구문/문장 번역 가능

### 2. 인터랙티브 리딩
- 텍스트 선택 & 번역 → 단어 저장까지 한 흐름
- 페이지 + 스크롤 위치 서버 동기화 (이어읽기)
- 화면 크기 기반 자동 페이지네이션
- 폰트/크기 조절 기능

### 3. 단어 학습 관리
- 저장 단어: 단어, 뜻, 품사, 출처 도서 기록
- 학습 완료 표시 + 타임스탬프
- 주간/연간 학습 통계 (히트맵)
- 도서별 학습 단어 필터링
- 검색 기능

### 4. 독서 진행 추적
- 도서별 현재 페이지, 챕터, 스크롤 위치 저장
- 읽는 중 / 완독 도서 목록
- 최근 활동 기준 정렬
- 독서 통계

### 5. 도서 콘텐츠 관리
- CEFR 레벨별 분류 (A1 ~ C2)
- 장르, 저자, 예상 독서 시간, 총 단어수, 고유 단어수
- 인기 도서 알고리즘 (최근 30일 기반)
- 태그 시스템 (N:N 관계) - 카테고리별 분류/검색

### 6. 수익화 (Freemium)
- 무료: 제한된 도서/단어 접근 (서버 Config로 동적 설정)
- 프리미엄: 무제한 접근, 광고 제거
- RevenueCat 통합 (iOS/Android IAP 통합 관리)
- Google Play Billing 연동
- 월간 ₩6,900 / 연간 ₩66,000 / 평생 ₩129,000
- AdMob 배너 + 전면 광고 (무료 사용자)

### 7. 인증
- Google Sign-In (Web/Android/iOS)
- Apple Sign-In (iOS)
- JWT 기반 (Access Token + Refresh Token)
- Supabase Auth 인프라 활용

### 8. 관리자 대시보드 (Next.js)
- 도서 CRUD + 커버 업로드 + 콘텐츠 관리
- 유저 관리 (통계, 프리미엄 상태 토글)
- 태그/카테고리 관리
- 앱 설정 (무료 제한 등) 동적 변경
- 시스템 전체 통계 대시보드

---

## 아키텍처 패턴

### Widget-Section-Screen 패턴 (모바일 UI)
- **Widget**: 최소 재사용 단위 (WordChipWidget, TranslationCardWidget)
- **Section**: 위젯 그룹 (BookContentSection, TranslationSection)
- **Screen**: ViewModel + 네비게이션이 있는 전체 화면

### Orbit MVI (상태 관리)
- Container 패턴: `viewModel.container.stateFlow`
- Coroutine 기반 Side Effect
- Immutable State (Single Source of Truth)
- Type-safe Navigation (sealed class routes)

### 도메인별 API 분리
- `data/book/`, `data/word/`, `data/reading/`, `data/config/`
- 각 도메인별 독립 API 클라이언트

### 백엔드 레이어드 아키텍처
- Controller → Service → Repository
- Entity ↔ DTO 분리
- BaseEntity (id, createdAt, updatedAt 자동 관리)
- GlobalExceptionHandler
- UUID PK, Application-level FK 관리

---

## API 구조

### Public (인증 불필요)
- `GET /api/books` — 도서 목록 (필터: 언어, 장르, CEFR, 독서시간)
- `GET /api/books/{id}/content` — 도서 본문
- `GET /api/books/popular` — 인기 도서 (최근 N일)
- `GET /api/tag-categories`, `GET /api/tags` — 태그 조회

### Protected (JWT 필요)
- Reading Progress: CRUD + 이어읽기 + 완독 목록 + 통계
- Words: 저장/삭제/학습완료 + 통계 (주간/연간)
- Auth: Google/Apple 로그인, 토큰 갱신, 계정 삭제

### Admin (ADMIN 권한)
- 유저/도서/설정/태그 CRUD
- 시스템 통계

---

## 콘텐츠 구조

```
content/
├── A1/ A2/ B1/ B2/ C1/ C2/       ← CEFR 레벨별
└── [저자]/[도서명]/
    ├── en.txt                      ← 영어 원문
    ├── ko.md                       ← 한국어 번역/노트
    ├── info.md                     ← 메타데이터
    └── cover.webp                  ← 커버 이미지
```

---

## 주요 기술적 의사결정

| 결정 | 이유 |
|------|------|
| Kotlin Multiplatform | Android/iOS 코드 80%+ 공유, 네이티브 성능 |
| Orbit MVI | 타입 안전한 상태 관리 + 코루틴 통합 |
| Spring Boot + PostgreSQL | 검증된 백엔드 스택, 확장성 |
| Supabase (프로덕션) | 호스팅 PostgreSQL + Auth → 운영 부담 감소 |
| Gemini AI | 문맥 인식 번역, Rate limit 우회 전략 |
| RevenueCat | iOS/Android IAP 통합 관리 (플랫폼별 처리 불필요) |
| Next.js (Admin) | 빠른 개발, SSR 가능 |
| DB FK 없음 | 마이그레이션 유연성, 진화 가능한 스키마 |

---

## 타겟 사용자
- CEFR A2~B2 수준의 영어 학습자
- 문학을 통해 자연스럽게 어휘력을 키우고 싶은 사람
- 기존 단어 암기 앱에 지친 사용자

## 배포
- **Android**: Google Play Store
- **iOS**: Apple App Store
- **Backend**: Spring Boot JAR (클라우드)
- **Admin**: Next.js (Vercel)
- **DB**: Supabase PostgreSQL (프로덕션)

## 버전
- 현재: v1.0.13

## 레포지토리
- https://github.com/Readip/Readip-workspace (monorepo)
