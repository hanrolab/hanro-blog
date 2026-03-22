'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-lg p-1.5 text-text-muted transition-colors hover:text-text-primary"
      title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
