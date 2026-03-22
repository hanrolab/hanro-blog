'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { BlogHeader } from '@/components/BlogHeader'
import { TiptapEditor } from '@/components/editor/TiptapEditor'
import { ChevronDown, ImagePlus, Save, Check, Plus } from 'lucide-react'
import { uploadImageToR2 } from '@/lib/r2-upload'
import type { Post, Category } from '@/lib/types'
import type { Editor } from '@tiptap/core'
import { useToast } from '@/lib/useToast'

interface WriteViewProps {
  editMode?: boolean
  initialPost?: Post
}

const DRAFT_KEY = 'hanro_draft'

function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/)
  return match?.[1] || null
}

function countText(html: string): { chars: number; words: number } {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return {
    chars: text.length,
    words: text ? text.split(/\s+/).length : 0,
  }
}

export function WriteView({ editMode = false, initialPost }: WriteViewProps) {
  const router = useRouter()
  const editorRef = useRef<Editor | null>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState(initialPost?.title || '')
  const [content, setContent] = useState(initialPost?.content || '')
  const [category, setCategory] = useState(initialPost?.category || '')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [textStats, setTextStats] = useState({ chars: 0, words: 0 })
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Fetch categories from API
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => {})
  }, [])

  const handleAddCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      setCategory(name)
      setNewCategoryName('')
      setIsAddingCategory(false)
      setShowCategoryDropdown(false)
      setIsDirty(true)
      // Refetch categories
      fetch('/api/categories')
        .then((r) => r.json())
        .then((d) => setCategories(d.categories ?? []))
      showToast(`'${name}' 카테고리가 추가되었습니다.`)
    } else {
      const data = await res.json()
      showToast(data.error ?? '추가 실패', 'error')
    }
  }

  // Load draft on mount (new post only)
  useEffect(() => {
    if (editMode || initialPost) return
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.content) setContent(parsed.content)
        if (parsed.category) setCategory(parsed.category)
      }
    } catch { /* ignore */ }
  }, [editMode, initialPost])

  // Auto-save draft every 30s
  useEffect(() => {
    if (editMode) return
    const interval = setInterval(() => {
      if (!isDirty) return
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category }))
      setAutoSaved(true)
      setIsDirty(false)
      setTimeout(() => setAutoSaved(false), 2000)
    }, 30000)
    return () => clearInterval(interval)
  }, [title, content, category, isDirty, editMode])

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Cmd+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSaveDraft()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  // Close category dropdown on outside click
  useEffect(() => {
    if (!showCategoryDropdown) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showCategoryDropdown])

  // Update text stats when content changes
  useEffect(() => {
    setTextStats(countText(content))
  }, [content])

  const handleContentUpdate = useCallback((html: string) => {
    setContent(html)
    setIsDirty(true)
  }, [])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setIsDirty(true)
  }

  // Title textarea auto-resize
  const handleTitleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
    handleTitleChange(el.value)
  }

  // Enter on title → focus editor
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editorRef.current?.commands.focus('start')
    }
  }

  const handleEditorReady = useCallback((editor: Editor) => {
    editorRef.current = editor
  }, [])

  // Image upload button handler
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editorRef.current) return
    setImageUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const url = await uploadImageToR2(file)
        editorRef.current.chain().focus().setImage({ src: url }).run()
      }
    } catch (e) {
      console.error('Image upload failed:', e)
    } finally {
      setImageUploading(false)
      if (imageInputRef.current) imageInputRef.current.value = ''
    }
  }

  const generateSlug = (title: string) => {
    const base = title
      .replace(/[가-힣]+/g, () => '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
    const ts = Date.now().toString(36)
    return base ? `${base}-${ts}` : ts
  }

  const handleSaveDraft = async () => {
    if (!editMode) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, category }))
      setAutoSaved(true)
      setIsDirty(false)
      setTimeout(() => setAutoSaved(false), 2000)
      return
    }
    await handlePublish(false)
  }

  const handlePublish = async (published: boolean) => {
    if (!title.trim()) {
      titleRef.current?.focus()
      return
    }

    setSaving(true)

    try {
      const slug = initialPost?.slug || generateSlug(title)
      const thumbnail = extractFirstImage(content)
      const body = { title, slug, content, thumbnail, category, tags: null, published }

      const url = editMode ? `/api/posts/${initialPost?.slug}` : '/api/posts'
      const method = editMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setIsDirty(false)
        // Clear draft on successful publish
        if (!editMode) localStorage.removeItem(DRAFT_KEY)
        router.push(published ? `/post/${slug}` : '/')
      } else {
        showToast('저장에 실패했습니다.', 'error')
      }
    } catch {
      showToast('저장 중 오류가 발생했습니다.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const selectedCategory = categories.find((c) => c.name === category)

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <BlogHeader />

      {/* Main editor area */}
      <div className="mx-auto w-full max-w-[800px] flex-1 px-6 py-8 pb-24">
        {/* Category + Image Upload */}
        <div className="mb-6 flex items-center gap-3">
          {/* Category Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] text-text-muted transition-colors hover:border-text-muted"
            >
              {selectedCategory ? (
                <>
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedCategory.color }} />
                  {selectedCategory.name}
                </>
              ) : (
                '카테고리 선택'
              )}
              <ChevronDown size={14} />
            </button>

            {showCategoryDropdown && (
              <div className="absolute left-0 top-full z-10 mt-1 min-w-[180px] rounded-xl border border-border bg-bg py-1 shadow-lg">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategory(cat.name); setShowCategoryDropdown(false); setIsDirty(true); setIsAddingCategory(false) }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors hover:bg-bg-card ${
                      category === cat.name ? 'font-medium text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </button>
                ))}

                <div className="mx-2 my-1 h-px bg-border" />

                {isAddingCategory ? (
                  <div className="px-3 py-1.5">
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleAddCategory() }
                        if (e.key === 'Escape') { setIsAddingCategory(false); setNewCategoryName('') }
                      }}
                      placeholder="이름 입력 후 Enter"
                      className="w-full rounded-md border border-border bg-bg px-2.5 py-1.5 text-[13px] text-text-primary outline-none placeholder:text-text-muted/50 focus:border-text-muted"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingCategory(true)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] text-text-muted transition-colors hover:bg-bg-card hover:text-text-primary"
                  >
                    <Plus size={14} />
                    새 카테고리 추가
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Image Upload Button */}
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={imageUploading}
            className="flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-[13px] text-text-muted transition-colors hover:border-text-muted disabled:opacity-50"
          >
            <ImagePlus size={14} />
            {imageUploading ? '업로드 중...' : '이미지'}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files)}
          />
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={handleTitleInput}
          onKeyDown={handleTitleKeyDown}
          placeholder="제목을 입력하세요"
          rows={1}
          className="w-full resize-none border-none bg-transparent text-[2.25rem] font-bold leading-tight text-text-primary outline-none placeholder:text-text-muted/40"
        />

        <div className="my-5 h-px bg-border" />

        {/* Editor */}
        <div className="blog-editor">
          <TiptapEditor
            content={content}
            onUpdate={handleContentUpdate}
            onEditorReady={handleEditorReady}
          />
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[800px] items-center justify-between px-6">
          {/* Left: Stats + Auto-save */}
          <div className="flex items-center gap-4 text-[12px] text-text-muted">
            <span>{textStats.chars.toLocaleString()}자</span>
            <span className="hidden sm:inline">{textStats.words.toLocaleString()} 단어</span>
            {autoSaved && (
              <span className="flex items-center gap-1 text-green-600">
                <Check size={12} />
                저장됨
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[13px] font-medium text-text-muted transition-colors hover:border-text-primary hover:text-text-primary"
              title="Cmd+S"
            >
              <Save size={14} />
              <span className="hidden sm:inline">{editMode ? '임시저장' : '저장'}</span>
            </button>
            <button
              onClick={() => handlePublish(true)}
              disabled={saving}
              className="rounded-lg bg-text-primary px-5 py-2 text-[13px] font-medium text-bg transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {saving ? '발행 중...' : editMode ? '수정 완료' : '발행하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
