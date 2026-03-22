import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const experience = [
  {
    category: 'FRONTEND',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'React Query', 'Framer Motion'],
  },
  {
    category: 'BACKEND',
    items: ['Spring Boot', 'Kotlin', 'Java', 'Spring Security', 'JPA', 'QueryDSL'],
  },
  {
    category: 'DATABASE & INFRA',
    items: ['PostgreSQL', 'Redis', 'MinIO', 'Docker', 'Cloudflare'],
  },
  {
    category: 'AI & OTHERS',
    items: ['Gemini AI', 'Spring AI', 'Git', 'CI/CD', 'Agile'],
  },
] as const

const journey = [
  { period: '2024 —', title: 'B3D ODS Platform', desc: 'Full-Stack Development' },
  { period: '2025 —', title: 'Technical Books', desc: 'Spring Security & PLM AI' },
  { period: '2024', title: 'Server Interview Bible', desc: '45 Chapters Completed' },
] as const

export function About() {
  return (
    <main className="pb-24 pt-28 px-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
        className="border-b border-border pb-16"
      >
        <p className="mb-6 text-[10px] tracking-[0.3em] text-text-muted">ABOUT</p>
        <h1 className="font-serif text-5xl leading-[1.1] tracking-tight text-text-primary sm:text-7xl">
          CRAFTING
          <br />
          <span className="italic">Digital</span>
          <br />
          ARCHITECTURE.
        </h1>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-text-secondary">
          Spring Boot와 React를 주로 사용하는 풀스택 개발자입니다.
          패션 산업 SaaS 플랫폼 개발과 기술 서적 집필을 병행하고 있으며,
          클린 아키텍처와 테스트 주도 개발을 지향합니다.
        </p>
      </motion.section>

      {/* Skills Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="mb-10 text-[10px] tracking-[0.3em] text-text-muted">
          CORE CAPABILITIES
        </h2>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
          {experience.map((group, groupIndex) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + groupIndex * 0.1 }}
              className="bg-bg p-8 sm:p-10"
            >
              <h3 className="mb-6 text-[10px] tracking-[0.25em] text-text-muted">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border border-border px-3 py-2 text-xs tracking-[0.05em] text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Journey */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-24"
      >
        <h2 className="mb-10 text-[10px] tracking-[0.3em] text-text-muted">
          TECHNICAL JOURNEY
        </h2>

        <div className="space-y-0">
          {journey.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-8 border-b border-border py-6"
            >
              <span className="w-24 shrink-0 text-xs tracking-[0.1em] text-text-muted">
                {item.period}
              </span>
              <div className="flex-1">
                <p className="font-serif text-xl text-text-primary">{item.title}</p>
                <p className="mt-1 text-xs text-text-muted">{item.desc}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-text-muted" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact CTA - Dark block */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 bg-bg-dark p-12 text-center sm:p-20"
      >
        <p className="font-serif text-3xl text-text-white sm:text-5xl">
          Ready to <span className="italic">collaborate</span>?
        </p>
        <a
          href="mailto:contact@example.com"
          className="mt-8 inline-flex items-center gap-2 border border-text-white px-8 py-3 text-xs tracking-[0.2em] text-text-white transition-colors hover:bg-text-white hover:text-bg-dark"
        >
          GET IN TOUCH
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </motion.section>
    </main>
  )
}
