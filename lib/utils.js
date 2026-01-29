// lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugify from 'slugify'

// Merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate slug from text
export function generateSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
}

// Generate order number
export function generateOrderNumber() {
  const prefix = 'ALW'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Format relative time
export function formatRelativeTime(date) {
  const now = new Date()
  const diff = now - new Date(date)
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

// Truncate text
export function truncate(text, length = 100) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Format phone number for WhatsApp
export function formatWhatsAppNumber(phone) {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '')
  
  // If starts with 0, replace with 234
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1)
  }
  
  // If doesn't start with country code, add 234
  if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned
  }
  
  return cleaned
}

// Generate WhatsApp link
export function getWhatsAppLink(phone, message = '') {
  const formattedPhone = formatWhatsAppNumber(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}${message ? `?text=${encodedMessage}` : ''}`
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate Nigerian phone
export function isValidNigerianPhone(phone) {
  const cleaned = phone.replace(/\D/g, '')
  // Nigerian numbers: 11 digits starting with 0, or 13 digits starting with 234
  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(cleaned)
}

// Get initials from name
export function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Status colors
export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800'
}

// Priority colors
export const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  normal: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

// Levels
export const levels = [
  'ND',
  'HND', 
  'NCE',
  'BSc',
  'BA',
  'BEng',
  'BTech',
  'MSc',
  'MA',
  'MBA',
  'MEng',
  'PhD'
]

// Project types
export const projectTypes = [
  'Full Project (Chapter 1-5)',
  'Single Chapter',
  'Proposal',
  'Thesis',
  'Dissertation',
  'Research Paper',
  'Assignment',
  'SIWES Report',
  'IT Report',
  'Data Analysis',
  'Questionnaire Design',
  'PowerPoint',
  'Paraphrasing',
  'Proofreading',
  'CV/Resume',
  'Statement of Purpose',
  'Other'
]