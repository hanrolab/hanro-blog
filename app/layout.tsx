import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/QueryProvider'
import '@/index.css'

export const metadata: Metadata = {
  title: '한로 블로그',
  description: '한로의 개발 블로그 — 배움을 기록합니다',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: '한로 블로그',
    description: '한로의 개발 블로그 — 배움을 기록합니다',
    type: 'website',
    locale: 'ko_KR',
    siteName: '한로 블로그',
  },
  twitter: {
    card: 'summary',
    title: '한로 블로그',
    description: '한로의 개발 블로그 — 배움을 기록합니다',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="alternate" type="application/rss+xml" title="한로 블로그 RSS" href="/feed.xml" />
      </head>
      <body>
        <QueryProvider>
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster position="bottom-right" richColors />
        </QueryProvider>
      </body>
    </html>
  )
}
