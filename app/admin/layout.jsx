// app/admin/layout.jsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | AlimsWrite Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }) {
  // Try to get session - but don't redirect if we can't
  let session = null
  
  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error('Session error:', error)
  }

  // If no session, check if we're rendering login page
  // Login page's layout will handle its own rendering
  if (!session) {
    // Return children directly - login page will show
    // Middleware will protect other routes
    return <>{children}</>
  }

  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>
}