export function Blog() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] text-text-primary">
          한로 블로그
        </h1>
        <p className="mt-4 text-[17px] text-text-muted">
          Coming Soon
        </p>
        <a
          href="/portfolio"
          className="mt-8 inline-flex h-12 items-center rounded-md bg-text-primary px-8 text-[14px] font-medium text-bg transition-opacity hover:opacity-80"
        >
          포트폴리오 보기
        </a>
      </div>
    </main>
  )
}
