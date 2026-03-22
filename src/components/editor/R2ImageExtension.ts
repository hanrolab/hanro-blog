import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'

const EXPAND_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>'

const CLOSE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'

const ZOOM_IN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>'

const ZOOM_OUT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>'

function openLightbox(src: string) {
  const overlay = document.createElement('div')
  overlay.className = 'image-lightbox'

  const lightboxImg = document.createElement('img')
  lightboxImg.src = src

  let scale = 1
  let panX = 0
  let panY = 0
  const MIN_SCALE = 0.25
  const MAX_SCALE = 5
  const STEP = 0.25

  const zoomLabel = document.createElement('button')
  zoomLabel.className = 'image-lightbox-zoom-label'
  zoomLabel.textContent = '100%'

  const applyTransform = () => {
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`
    zoomLabel.textContent = `${Math.round(scale * 100)}%`
  }

  const zoomIn = () => { scale = Math.min(MAX_SCALE, scale + STEP); applyTransform() }
  const zoomOut = () => {
    scale = Math.max(MIN_SCALE, scale - STEP)
    if (scale <= 1) { panX = 0; panY = 0 }
    applyTransform()
  }
  const zoomReset = () => { scale = 1; panX = 0; panY = 0; applyTransform() }

  // Drag to pan
  let dragging = false
  let dragStartX = 0, dragStartY = 0, panStartX = 0, panStartY = 0

  lightboxImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return
    e.preventDefault()
    dragging = true
    dragStartX = e.clientX; dragStartY = e.clientY
    panStartX = panX; panStartY = panY
    lightboxImg.style.cursor = 'grabbing'
  })
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return
    panX = panStartX + (e.clientX - dragStartX)
    panY = panStartY + (e.clientY - dragStartY)
    applyTransform()
  })
  window.addEventListener('mouseup', () => {
    if (!dragging) return
    dragging = false
    lightboxImg.style.cursor = scale > 1 ? 'grab' : ''
  })

  // Toolbar
  const toolbar = document.createElement('div')
  toolbar.className = 'image-lightbox-toolbar'
  const zoomOutBtn = document.createElement('button')
  zoomOutBtn.innerHTML = ZOOM_OUT_SVG
  zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomOut() })
  zoomLabel.addEventListener('click', (e) => { e.stopPropagation(); zoomReset() })
  const zoomInBtn = document.createElement('button')
  zoomInBtn.innerHTML = ZOOM_IN_SVG
  zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomIn() })
  toolbar.append(zoomOutBtn, zoomLabel, zoomInBtn)

  const closeBtn = document.createElement('button')
  closeBtn.className = 'image-lightbox-close'
  closeBtn.innerHTML = CLOSE_SVG

  overlay.append(lightboxImg, toolbar, closeBtn)
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add('is-open'))

  const close = () => {
    overlay.classList.remove('is-open')
    setTimeout(() => overlay.remove(), 150)
    document.removeEventListener('keydown', onKey)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
    if (e.key === '=' || e.key === '+') zoomIn()
    if (e.key === '-') zoomOut()
    if (e.key === '0') zoomReset()
  }

  overlay.addEventListener('wheel', (e) => { e.preventDefault(); e.deltaY < 0 ? zoomIn() : zoomOut() }, { passive: false })

  let didDrag = false
  overlay.addEventListener('mousedown', () => { didDrag = false })
  overlay.addEventListener('mousemove', () => { didDrag = true })
  overlay.addEventListener('click', (e) => { if (!didDrag && e.target === overlay) close() })
  closeBtn.addEventListener('click', close)
  document.addEventListener('keydown', onKey)
}

export const R2Image = Image.extend({
  addNodeView() {
    return ({ node }) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'tiptap-image-wrapper'

      const img = document.createElement('img')
      if (node.attrs.src) img.src = node.attrs.src
      if (node.attrs.alt) img.alt = node.attrs.alt
      if (node.attrs.title) img.title = node.attrs.title

      const expandBtn = document.createElement('button')
      expandBtn.className = 'image-expand-btn'
      expandBtn.innerHTML = EXPAND_SVG
      expandBtn.title = 'Expand image'
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (img.src) openLightbox(img.src)
      })

      wrapper.append(img, expandBtn)

      return {
        dom: wrapper,
        selectNode() { wrapper.classList.add('ProseMirror-selectednode') },
        deselectNode() { wrapper.classList.remove('ProseMirror-selectednode') },
        update(updatedNode) {
          if (updatedNode.type.name !== 'image') return false
          if (updatedNode.attrs.src) img.src = updatedNode.attrs.src
          img.alt = updatedNode.attrs.alt ?? ''
          img.title = updatedNode.attrs.title ?? ''
          return true
        },
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('image-selection-highlight'),
        view() {
          return {
            update(view) {
              view.dom.querySelectorAll('.tiptap-image-wrapper.is-in-selection')
                .forEach((el) => el.classList.remove('is-in-selection'))
              const { from, to } = view.state.selection
              if (from === to) return
              view.state.doc.nodesBetween(from, to, (node, pos) => {
                if (node.type.name === 'image') {
                  const domNode = view.nodeDOM(pos)
                  if (domNode instanceof HTMLElement) domNode.classList.add('is-in-selection')
                }
              })
            },
          }
        },
      }),
    ]
  },
})
