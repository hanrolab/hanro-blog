import { Extension } from '@tiptap/core'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import type { Editor, Range } from '@tiptap/core'
import type { LucideIcon } from 'lucide-react'
import {
  Heading1, Heading2, Heading3,
  List, ListOrdered, CheckSquare,
  Quote, Code, Minus,
  Image, Table, Pilcrow,
} from 'lucide-react'
import { uploadImageToR2 } from '@/lib/r2-upload'

export interface SlashCommandItem {
  label: string
  icon: LucideIcon
  category: string
  description: string
  action: (editor: Editor, range: Range) => void
}

export const slashCommandItems: SlashCommandItem[] = [
  {
    category: '텍스트',
    label: '본문',
    icon: Pilcrow,
    description: '일반 텍스트 블록',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setParagraph().run()
    },
  },
  {
    category: '텍스트',
    label: '제목 1',
    icon: Heading1,
    description: '큰 섹션 제목',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
    },
  },
  {
    category: '텍스트',
    label: '제목 2',
    icon: Heading2,
    description: '중간 섹션 제목',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
    },
  },
  {
    category: '텍스트',
    label: '제목 3',
    icon: Heading3,
    description: '작은 섹션 제목',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
    },
  },
  {
    category: '목록',
    label: '글머리 기호',
    icon: List,
    description: '순서 없는 목록',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    category: '목록',
    label: '번호 매기기',
    icon: ListOrdered,
    description: '순서 있는 목록',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    category: '목록',
    label: '할 일 목록',
    icon: CheckSquare,
    description: '체크박스가 있는 목록',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    category: '블록',
    label: '인용',
    icon: Quote,
    description: '인용문 블록',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run()
    },
  },
  {
    category: '블록',
    label: '코드 블록',
    icon: Code,
    description: '구문 강조가 있는 코드',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run()
    },
  },
  {
    category: '블록',
    label: '구분선',
    icon: Minus,
    description: '가로 구분선',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    category: '삽입',
    label: '표',
    icon: Table,
    description: '헤더가 있는 표 삽입',
    action: (editor, range) => {
      editor.chain().focus().deleteRange(range)
        .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
        .run()
    },
  },
  {
    category: '삽입',
    label: '이미지',
    icon: Image,
    description: '이미지 업로드',
    action: (editor, range) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = true
      input.onchange = async () => {
        const files = input.files
        if (!files || files.length === 0) return
        editor.chain().focus().deleteRange(range).run()
        for (const file of Array.from(files)) {
          try {
            const url = await uploadImageToR2(file)
            editor.chain().focus().setImage({ src: url }).run()
          } catch (e) {
            console.error('Image upload failed:', e)
          }
        }
      }
      input.click()
    },
  },
]

export function filterCommands(query: string): SlashCommandItem[] {
  if (!query) return slashCommandItems
  const lower = query.toLowerCase()
  return slashCommandItems.filter(
    (item) =>
      item.label.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower),
  )
}

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: SlashCommandItem }) => {
          props.action(editor, range)
        },
      } as Partial<SuggestionOptions<SlashCommandItem>>,
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem>({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})
