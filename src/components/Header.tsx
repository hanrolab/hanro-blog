'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
  { path: '/', label: 'EXPERIENCE' },
  { path: '/projects', label: 'WORK' },
] as const

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-bg ${
        scrolled ? 'border-b border-border' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="text-[14px] font-bold tracking-[0.2em] text-text-primary uppercase"
        >
          Jinsung Joo
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? pathname === '/' || pathname.startsWith('/projects')
              : false

            return (
              <Link
                key={item.path}
                href={item.path === '/projects' ? '/#projects' : item.path}
                className={`text-[12px] font-semibold tracking-[0.15em] transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <a
          href="mailto:contact@example.com"
          className="hidden md:inline-flex border border-text-primary px-6 py-2.5 text-[11px] font-semibold tracking-[0.15em] text-text-primary transition-colors hover:bg-text-primary hover:text-bg"
        >
          CONTACT
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center text-text-primary md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-border bg-bg md:hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path === '/projects' ? '/#projects' : item.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-[18px] font-medium tracking-[0.1em] text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="mailto:contact@example.com"
                className="mt-4 inline-flex w-fit border border-text-primary px-8 py-3.5 text-[12px] font-semibold tracking-[0.15em] text-text-primary"
              >
                CONTACT
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
