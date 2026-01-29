// lib/adminPath.js

// Server-side admin path
export const ADMIN_SECRET_PATH = process.env.ADMIN_SECRET_PATH || 'alims-write-admin4me'

// Get admin URL
export function getAdminUrl(path = '') {
  const basePath = `/${ADMIN_SECRET_PATH}`
  
  if (!path) return basePath
  if (path.startsWith('/')) return `${basePath}${path}`
  return `${basePath}/${path}`
}

// For client components, use:
// const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'alims-write-admin4me'