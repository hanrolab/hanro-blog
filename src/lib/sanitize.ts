const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'div', 'span',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'sub', 'sup',
  'a', 'img',
  'pre', 'code',
  'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'label', 'input',
])

const ALLOWED_ATTR = new Set([
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'class',
  'data-type', 'data-checked', 'data-placeholder',
  'type', 'checked', 'disabled',
  'style',
  'colspan', 'rowspan',
  'id',
])

/**
 * Lightweight HTML sanitizer that works in Workers/Edge without JSDOM.
 * Strips script/style tags, event handlers, and javascript: URLs.
 */
export function sanitizeHtml(html: string): string {
  let clean = html

  // Remove script and style tags with content
  clean = clean.replace(/<script[\s\S]*?<\/script>/gi, '')
  clean = clean.replace(/<style[\s\S]*?<\/style>/gi, '')

  // Remove event handler attributes (onclick, onload, onerror, etc.)
  clean = clean.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, '')
  clean = clean.replace(/\s+on\w+\s*=\s*'[^']*'/gi, '')
  clean = clean.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: and data: URLs from href/src/action
  clean = clean.replace(/(href|src|action)\s*=\s*"javascript:[^"]*"/gi, '')
  clean = clean.replace(/(href|src|action)\s*=\s*'javascript:[^']*'/gi, '')
  clean = clean.replace(/(href|src|action)\s*=\s*"data:[^"]*"/gi, '')
  clean = clean.replace(/(href|src|action)\s*=\s*'data:[^']*'/gi, '')

  // Remove tags not in allowlist
  clean = clean.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, tag) => {
    if (ALLOWED_TAGS.has(tag.toLowerCase())) {
      // Keep the tag but strip disallowed attributes
      return match.replace(/\s+([a-zA-Z-]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/g, (attrMatch, attrName) => {
        return ALLOWED_ATTR.has(attrName.toLowerCase()) ? attrMatch : ''
      })
    }
    return ''
  })

  return clean
}
