'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Editor } from '@tiptap/core'
import {
  Plus, Minus, Trash2,
  ArrowDown, ArrowUp, ArrowLeft, ArrowRight,
} from 'lucide-react'

interface TableBubbleMenuProps {
  editor: Editor
}

function MenuButton({ onClick, title, children, danger }: {
  onClick: () => void
  title: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        danger
          ? 'text-red-500 hover:bg-red-50'
          : 'text-text-muted hover:bg-bg-card hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-0.5 h-5 w-px bg-border" />
}

export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  const [visible, setVisible] = useState(false)

  const updateVisibility = useCallback(() => {
    setVisible(editor.isActive('table'))
  }, [editor])

  useEffect(() => {
    editor.on('selectionUpdate', updateVisibility)
    editor.on('transaction', updateVisibility)
    return () => {
      editor.off('selectionUpdate', updateVisibility)
      editor.off('transaction', updateVisibility)
    }
  }, [editor, updateVisibility])

  if (!visible) return null

  return (
    <div className="table-bubble-menu flex items-center gap-0.5 rounded-xl border border-border bg-bg px-1.5 py-1 shadow-lg">
      {/* Column operations */}
      <MenuButton
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="왼쪽에 열 추가"
      >
        <ArrowLeft size={13} strokeWidth={2.5} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="오른쪽에 열 추가"
      >
        <ArrowRight size={13} strokeWidth={2.5} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="열 삭제"
        danger
      >
        <div className="flex items-center">
          <Minus size={11} strokeWidth={2.5} />
          <span className="text-[9px] font-bold">열</span>
        </div>
      </MenuButton>

      <Divider />

      {/* Row operations */}
      <MenuButton
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="위에 행 추가"
      >
        <ArrowUp size={13} strokeWidth={2.5} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="아래에 행 추가"
      >
        <ArrowDown size={13} strokeWidth={2.5} />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="행 삭제"
        danger
      >
        <div className="flex items-center">
          <Minus size={11} strokeWidth={2.5} />
          <span className="text-[9px] font-bold">행</span>
        </div>
      </MenuButton>

      <Divider />

      {/* Merge / Header toggle */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeaderRow().run()}
        title="헤더 행 토글"
      >
        <Plus size={13} strokeWidth={2.5} />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="표 삭제"
        danger
      >
        <Trash2 size={13} strokeWidth={2.5} />
      </MenuButton>
    </div>
  )
}
