'use client'

import { motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import type { ToastType } from '@/lib/useToast'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles: Record<ToastType, string> = {
  success: 'border-green-300 bg-green-50 text-green-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-blue-300 bg-blue-50 text-blue-800',
}

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg ${styles[type]}`}
    >
      <Icon size={16} className="shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-1 shrink-0 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </motion.div>
  )
}
