'use client'

import { useRef, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { createRoot, type Root } from 'react-dom/client'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import LinkExt from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion'
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import type { Editor } from '@tiptap/core'

import { R2Image } from './R2ImageExtension'
import { EditorToolbar } from './EditorToolbar'
import { TableBubbleMenu } from './TableBubbleMenu'
import { SlashCommands, filterCommands, type SlashCommandItem } from './slashCommands'
import { SlashCommandMenu } from './SlashCommandMenu'
import { uploadImageToR2 } from '@/lib/r2-upload'

const lowlight = createLowlight(common)

interface TiptapEditorProps {
  content: string
  onUpdate: (html: string) => void
  onEditorReady?: (editor: Editor) => void
}

function getImageFiles(dataTransfer: DataTransfer): File[] {
  return Array.from(dataTransfer.files).filter((f) => f.type.startsWith('image/'))
}

const PLACEHOLDER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="56"><rect width="400" height="56" rx="8" fill="#f4f4f2"/><rect x="160" y="18" width="80" height="8" rx="4" fill="#d1d1cf"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/></rect><text x="200" y="42" text-anchor="middle" font-size="11" fill="#999" font-family="sans-serif">uploading...</text></svg>'

const PLACEHOLDER_SRC =
  typeof window !== 'undefined'
    ? 'data:image/svg+xml;base64,' + btoa(PLACEHOLDER_SVG)
    : 'data:image/svg+xml,' + encodeURIComponent(PLACEHOLDER_SVG)

const ImageDropHandler = Extension.create({
  name: 'imageDropHandler',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop(view, event) {
            if (!event.dataTransfer) return false
            const images = getImageFiles(event.dataTransfer)
            if (images.length === 0) return false
            event.preventDefault()

            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
            for (const file of images) {
              const placeholderNode = view.state.schema.nodes.image.create({ src: PLACEHOLDER_SRC })
              const insertPos = pos ?? view.state.selection.to
              view.dispatch(view.state.tr.insert(insertPos, placeholderNode))

              uploadImageToR2(file).then((url) => {
                const { state } = view
                state.doc.descendants((node, nodePos) => {
                  if (node.type.name === 'image' && node.attrs.src === PLACEHOLDER_SRC) {
                    view.dispatch(state.tr.setNodeMarkup(nodePos, undefined, { ...node.attrs, src: url }))
                    return false
                  }
                })
              })
            }
            return true
          },
        },
      }),
    ]
  },
})

export function TiptapEditor({ content, onUpdate, onEditorReady }: TiptapEditorProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({
        placeholder: "'/' 를 입력하여 명령어를 사용하세요",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      Typography,
      R2Image.configure({ inline: false }),
      LinkExt.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: 'https',
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: { class: 'tiptap-table' },
      }),
      TableRow,
      TableCell,
      TableHeader,
      ImageDropHandler,
      SlashCommands.configure({
        suggestion: {
          items: ({ query }: { query: string }) => filterCommands(query),
          render: () => {
            let popup: HTMLDivElement | null = null
            let root: Root | null = null
            const MENU_MAX_HEIGHT = 420

            function positionPopup(rect: DOMRect) {
              if (!popup) return
              const vh = window.innerHeight
              let top = rect.bottom + 6
              if (top + MENU_MAX_HEIGHT > vh - 8) top = rect.top - MENU_MAX_HEIGHT - 6
              popup.style.left = `${Math.max(8, rect.left)}px`
              popup.style.top = `${top}px`
              popup.style.width = '480px'
            }

            return {
              onStart(props: SuggestionProps<SlashCommandItem>) {
                popup = document.createElement('div')
                popup.style.position = 'absolute'
                popup.style.zIndex = '200'
                document.body.appendChild(popup)
                root = createRoot(popup)
                const rect = props.clientRect?.()
                if (rect) positionPopup(rect)
                root.render(
                  <SlashCommandMenu items={props.items} command={(item) => props.command(item)} />,
                )
              },
              onUpdate(props: SuggestionProps<SlashCommandItem>) {
                const rect = props.clientRect?.()
                if (rect) positionPopup(rect)
                root?.render(
                  <SlashCommandMenu items={props.items} command={(item) => props.command(item)} />,
                )
              },
              onKeyDown(props: SuggestionKeyDownProps) {
                if (props.event.key === 'Escape') {
                  root?.unmount()
                  popup?.remove()
                  popup = null
                  root = null
                  return true
                }
                const handler = (window as unknown as Record<string, (e: KeyboardEvent) => boolean>).__slashMenuKeyDown
                if (handler) return handler(props.event)
                return false
              },
              onExit() {
                root?.unmount()
                popup?.remove()
                popup = null
                root = null
              },
            }
          },
        },
      }),
    ],
    editorProps: {
      handlePaste: (view, event) => {
        if (!event.clipboardData) return false
        const images = getImageFiles(event.clipboardData)
        if (images.length === 0) return false
        event.preventDefault()

        for (const file of images) {
          const placeholderNode = view.state.schema.nodes.image.create({ src: PLACEHOLDER_SRC })
          view.dispatch(view.state.tr.replaceSelectionWith(placeholderNode))

          uploadImageToR2(file).then((url) => {
            const { state } = view
            state.doc.descendants((node, nodePos) => {
              if (node.type.name === 'image' && node.attrs.src === PLACEHOLDER_SRC) {
                view.dispatch(state.tr.setNodeMarkup(nodePos, undefined, { ...node.attrs, src: url }))
                return false
              }
            })
          })
        }
        return true
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && onEditorReady) onEditorReady(editor)
  }, [editor, onEditorReady])

  // Drag-drop visual feedback
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let dragCounter = 0

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      if (e.dataTransfer?.types.includes('Files')) setIsDragOver(true)
    }
    const onDragLeave = () => {
      dragCounter--
      if (dragCounter <= 0) { setIsDragOver(false); dragCounter = 0 }
    }
    const onDragOver = (e: DragEvent) => { e.preventDefault() }
    const onDrop = () => { setIsDragOver(false); dragCounter = 0 }

    wrapper.addEventListener('dragenter', onDragEnter)
    wrapper.addEventListener('dragleave', onDragLeave)
    wrapper.addEventListener('dragover', onDragOver)
    wrapper.addEventListener('drop', onDrop)

    return () => {
      wrapper.removeEventListener('dragenter', onDragEnter)
      wrapper.removeEventListener('dragleave', onDragLeave)
      wrapper.removeEventListener('dragover', onDragOver)
      wrapper.removeEventListener('drop', onDrop)
    }
  }, [])

  if (!editor) return null

  return (
    <div className={`tiptap-editor ${isDragOver ? 'is-drag-over' : ''}`} ref={wrapperRef}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="tiptap-content-wrapper" />
      <TableBubbleMenu editor={editor} />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="drag-overlay">
          <div className="drag-overlay-content">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <p>이미지를 여기에 놓으세요</p>
          </div>
        </div>
      )}
    </div>
  )
}
