import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'div', 'span',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'sub', 'sup',
  'a', 'img',
  'pre', 'code',
  'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'label', 'input',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'class',
  'data-type', 'data-checked', 'data-placeholder',
  'type', 'checked', 'disabled',
  'style',
  'colspan', 'rowspan',
  'id',
]

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  })
}
