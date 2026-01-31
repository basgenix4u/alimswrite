// lib/sanitize.js
import DOMPurify from 'isomorphic-dompurify'

// Sanitize HTML (for blog content, comments)
export function sanitizeHtml(dirty) {
  if (!dirty) return ''
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'code', 'pre',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
  })
}

// Sanitize text input (for form fields) - FIXED VERSION
export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    // Remove HTML tags but keep the text content
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters but keep quotes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .substring(0, 10000)
}

// For displaying user-generated content safely in HTML (use this in frontend)
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return ''
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
