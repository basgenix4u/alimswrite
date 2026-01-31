// lib/sanitize.js

// Simple HTML sanitizer that works in all environments
// No external dependencies that cause ESM issues

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'code', 'pre',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span', 'hr',
]

const ALLOWED_ATTRS = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height']

// Remove dangerous tags completely (including their content)
const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select']

export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return ''
  
  let clean = dirty
  
  // Remove dangerous tags and their content
  DANGEROUS_TAGS.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
    clean = clean.replace(regex, '')
    // Also remove self-closing versions
    clean = clean.replace(new RegExp(`<${tag}[^>]*\\/?>`, 'gi'), '')
  })
  
  // Remove event handlers (onclick, onload, onerror, etc.)
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '')
  
  // Remove javascript: URLs
  clean = clean.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
  clean = clean.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""')
  
  // Remove data: URLs in src (can be used for XSS)
  clean = clean.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""')
  
  // Remove any remaining script-like content
  clean = clean.replace(/<\s*\/?\s*script[^>]*>/gi, '')
  
  return clean.trim()
}

export function sanitizeText(input) {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .trim()
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length
    .substring(0, 10000)
}

// For safe display in HTML (encode special characters)
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return ''
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  }
  
  return text.replace(/[&<>"']/g, char => map[char])
}

// Validate URL (for images and links)
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  
  const trimmed = url.trim()
  
  // Allow only http, https, and relative URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed
  }
  
  // Block javascript:, data:, and other potentially dangerous protocols
  return ''
}