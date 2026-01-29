// components/layout/Header.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSettings } from '@/lib/SettingsContext'
import Button from '@/components/ui/Button'
import MobileMenu from './MobileMenu'
import { FiMenu, FiPhone } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Topic Bank', href: '/topics' },
  { name: 'Blog', href: '/blog' },
  { name: 'Testimonials', href: '/testimonials' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Format WhatsApp number
  const formatWhatsAppLink = (phone) => {
    if (!phone) return 'https://wa.me/2349039611238'
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1)
    if (!cleaned.startsWith('234')) cleaned = '234' + cleaned
    return `https://wa.me/${cleaned}`
  }

  const whatsappLink = formatWhatsAppLink(settings.whatsappNumber)
  const phoneNumber = settings.whatsappNumber || settings.phone || '09039611238'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const isActive = (href) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-2 hover:text-secondary-400 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>{phoneNumber}</span>
              </a>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-secondary-400 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-200">Trusted by 5,000+ students across Nigeria</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-900">
                  {settings.siteName?.split('Write')[0] || 'Alims'}
                </span>
                <span className="text-2xl font-bold text-secondary-500">Write</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'text-primary-900 bg-primary-50'
                      : 'text-dark-600 hover:text-primary-900 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`${whatsappLink}?text=${encodeURIComponent('Hello, I need help with my academic project')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  <FaWhatsapp className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
              <Link href="/order">
                <Button variant="primary" size="sm">
                  Start Your Project
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6 text-dark-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        currentPath={pathname}
      />
    </>
  )
}