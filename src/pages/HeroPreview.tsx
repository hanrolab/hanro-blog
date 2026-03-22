import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

const tabs = ['A. Photo', 'B. Numbers', 'C. Typing', 'D. Fullscreen', 'E. Keywords'] as const

/* ─────────── A: Photo + Text ─────────── */
function HeroA() {
  return (
    <section className="flex min-h-[80vh] items-center px-6 md:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] text-text-primary">
            Backend Developer
            <br />
            <span className="italic text-text-muted">&</span> Technical Author.
          </h1>
          <p className="mt-8 max-w-[480px] text-[17px] leading-[1.85] text-text-secondary">
            Spring Boot와 React를 기반으로 확장 가능한 시스템을 구축하고,
            기술 서적을 통해 지식을 공유합니다.
          </p>
          <div className="mt-12 flex gap-4">
            <a href="#" className="inline-flex h-13 items-center rounded-full bg-text-primary px-8 text-[14px] font-medium text-bg">
              View Projects
            </a>
            <a href="#" className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-8 text-[14px] font-medium text-text-primary">
              GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-full shrink-0 lg:w-[340px]"
        >
          <div className="aspect-[3/4] w-full rounded-2xl bg-bg-card flex items-center justify-center">
            <span className="text-[13px] tracking-[0.2em] text-text-muted">PHOTO</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── B: Numbers ─────────── */
function HeroB() {
  const stats = [
    { num: '5+', label: 'Projects' },
    { num: '3', label: 'Books' },
    { num: '25+', label: 'Domains' },
    { num: '1.5K+', label: 'Commits' },
  ]

  return (
    <section className="flex min-h-[80vh] flex-col justify-center px-6 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] text-text-primary">
            Backend Developer
            <br />
            <span className="italic text-text-muted">&</span> Technical Author.
          </h1>
          <p className="mt-8 max-w-[480px] text-[17px] leading-[1.85] text-text-secondary">
            Spring Boot와 React를 기반으로 확장 가능한 시스템을 구축하고,
            기술 서적을 통해 지식을 공유합니다.
          </p>
          <div className="mt-12 flex gap-4">
            <a href="#" className="inline-flex h-13 items-center rounded-full bg-text-primary px-8 text-[14px] font-medium text-bg">
              View Projects
            </a>
            <a href="#" className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-8 text-[14px] font-medium text-text-primary">
              GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-border pt-10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <span className="block font-serif text-[clamp(2rem,4vw,3.5rem)] text-text-primary">{s.num}</span>
              <span className="mt-1 block text-[14px] font-medium text-text-muted">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── C: Typing Animation ─────────── */
function HeroC() {
  const roles = ['Backend Developer', 'Technical Author', 'System Architect', 'Full-Stack Engineer']
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const currentRole = roles[roleIndex]

    if (!isDeleting && text === currentRole) {
      timerRef.current = setTimeout(() => { setIsDeleting(true) }, 2000)
    } else if (isDeleting && text === '') {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    } else {
      timerRef.current = setTimeout(() => {
        setText(isDeleting
          ? currentRole.substring(0, text.length - 1)
          : currentRole.substring(0, text.length + 1)
        )
      }, isDeleting ? 40 : 80)
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [text, isDeleting, roleIndex])

  return (
    <section className="flex min-h-[80vh] flex-col justify-center px-6 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[14px] font-medium text-text-muted">안녕하세요, 주진성입니다.</p>
          <h1 className="font-serif text-[clamp(2.8rem,6vw,5rem)] leading-[1.1] text-text-primary">
            <span>{text}</span>
            <span className="animate-pulse text-text-muted">|</span>
          </h1>
          <p className="mt-8 max-w-[480px] text-[17px] leading-[1.85] text-text-secondary">
            Spring Boot와 React를 기반으로 확장 가능한 시스템을 구축하고,
            기술 서적을 통해 지식을 공유합니다.
          </p>
          <div className="mt-12 flex gap-4">
            <a href="#" className="inline-flex h-13 items-center rounded-full bg-text-primary px-8 text-[14px] font-medium text-bg">
              View Projects
            </a>
            <a href="#" className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-8 text-[14px] font-medium text-text-primary">
              GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── D: Fullscreen + Scroll ─────────── */
function HeroD() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <p className="mb-6 text-[13px] font-semibold tracking-[0.25em] text-text-muted">JINSUNG JOO</p>
        <h1 className="font-serif text-[clamp(3rem,7vw,6rem)] leading-[1.08] text-text-primary">
          Building Scalable Systems
          <br />
          <span className="italic text-text-muted">&</span> Sharing Knowledge.
        </h1>
        <p className="mx-auto mt-8 max-w-[520px] text-[17px] leading-[1.85] text-text-secondary">
          Spring Boot와 React를 기반으로 확장 가능한 시스템을 구축하고,
          기술 서적을 통해 지식을 공유합니다.
        </p>
        <div className="mt-12 flex justify-center gap-4">
          <a href="#" className="inline-flex h-13 items-center rounded-full bg-text-primary px-8 text-[14px] font-medium text-bg">
            View Projects
          </a>
          <a href="#" className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-8 text-[14px] font-medium text-text-primary">
            GitHub <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] tracking-[0.2em] text-text-muted">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-5 w-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ─────────── E: Keywords ─────────── */
function HeroE() {
  return (
    <section className="flex min-h-[80vh] flex-col justify-center px-6 md:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.2] text-text-primary">
            I build{' '}
            <span className="relative inline-block">
              <span className="relative z-10">scalable systems</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-1 left-0 right-0 z-0 h-3 origin-left bg-bg-card-hover"
              />
            </span>
            {' '}and
            <br />
            write{' '}
            <span className="relative inline-block">
              <span className="relative z-10">technical books</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-1 left-0 right-0 z-0 h-3 origin-left bg-bg-card-hover"
              />
            </span>
            {' '}that help
            <br />
            developers <span className="italic text-text-muted">grow.</span>
          </h1>

          <p className="mt-10 max-w-[520px] text-[17px] leading-[1.85] text-text-secondary">
            풀스택 개발자 주진성입니다. Spring Boot + React 기반의 SaaS 플랫폼을 만들고,
            실무에서 바로 쓸 수 있는 기술 서적을 집필합니다.
          </p>
          <div className="mt-12 flex gap-4">
            <a href="#" className="inline-flex h-13 items-center rounded-full bg-text-primary px-8 text-[14px] font-medium text-bg">
              View Projects
            </a>
            <a href="#" className="inline-flex h-13 items-center gap-2 rounded-full border border-border px-8 text-[14px] font-medium text-text-primary">
              GitHub <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────── Preview Page ─────────── */
const heroes = [HeroA, HeroB, HeroC, HeroD, HeroE]

export function HeroPreview() {
  const [active, setActive] = useState(0)
  const ActiveHero = heroes[active]

  return (
    <div className="pt-[72px]">
      {/* Tab bar */}
      <div className="sticky top-[72px] z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 md:px-12">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className={`relative shrink-0 px-5 py-4 text-[13px] font-medium transition-colors ${
                active === i ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab}
              {active === i && (
                <motion.div
                  layoutId="hero-tab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-text-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveHero />
        </motion.div>
      </AnimatePresence>

      {/* Spacer */}
      <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-12">
        <p className="text-[15px] text-text-muted">
          ↑ 마음에 드는 히어로를 골라주세요. 선택하면 메인에 적용합니다.
        </p>
      </div>
    </div>
  )
}
