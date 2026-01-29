// components/admin/AdminLayoutClient.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  FiHome,
  FiFileText,
  FiBook,
  FiShoppingBag,
  FiMessageSquare,
  FiStar,
  FiPhone,
  FiSettings,
  FiMenu,
  FiX,
  FiBell,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiEdit,
  FiUsers,
} from 'react-icons/fi'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Chat', href: '/admin/chat', icon: FiMessageSquare },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag, badge: 'orders' },
  { name: 'Topics', href: '/admin/topics', icon: FiBook },
  { name: 'Blog Posts', href: '/admin/blog', icon: FiEdit },
  { name: 'Comments', href: '/admin/comments', icon: FiMessageSquare, badge: 'comments' },
  { name: 'Testimonials', href: '/admin/testimonials', icon: FiStar, badge: 'testimonials' },
  { name: 'Callbacks', href: '/admin/callbacks', icon: FiPhone, badge: 'callbacks' },
  { name: 'Departments', href: '/admin/departments', icon: FiUsers },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
]

export default function AdminLayoutClient({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-white">Alims</span>
            <span className="text-xl font-bold text-secondary-500">Write</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-dark-400 hover:text-white"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  0
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* View Site Link */}
        <div className="p-3 border-t border-dark-700">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
          >
            <FiFileText className="w-5 h-5" />
            View Website
          </a>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-dark-500 hover:text-dark-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Page title placeholder */}
            <div className="hidden lg:block" />

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-dark-500 hover:text-dark-700">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-dark-700">
                    {user?.name || 'Admin'}
                  </span>
                  <FiChevronDown className="w-4 h-4 text-dark-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-dark-900">{user?.name}</p>
                        <p className="text-xs text-dark-500">{user?.email}</p>
                      </div>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FiSettings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}