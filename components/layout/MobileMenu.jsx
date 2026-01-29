// components/layout/MobileMenu.jsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { FiX, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function MobileMenu({ isOpen, onClose, navigation, currentPath }) {
  const menuRef = useRef(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const isActive = (href) => {
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link href="/" onClick={onClose} className="flex items-center">
              <span className="text-xl font-bold text-primary-900">Alims</span>
              <span className="text-xl font-bold text-secondary-500">Write</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6 text-dark-700" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                      isActive(item.href)
                        ? 'text-primary-900 bg-primary-50'
                        : 'text-dark-600 hover:text-primary-900 hover:bg-gray-50'
                    )}
                  >
                    <span>{item.name}</span>
                    <FiArrowRight className={cn(
                      'w-4 h-4 transition-opacity',
                      isActive(item.href) ? 'opacity-100' : 'opacity-0'
                    )} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-6 px-4 space-y-3">
              <Link href="/order" onClick={onClose} className="block">
                <Button variant="primary" className="w-full justify-center">
                  Start Your Project
                </Button>
              </Link>
              <a
                href="https://wa.me/2349039611238?text=Hello%2C%20I%20need%20help%20with%20my%20academic%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="whatsapp" className="w-full justify-center">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4">
            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <a
                href="tel:09039611238"
                className="flex items-center gap-3 text-dark-600 hover:text-primary-900 transition-colors"
              >
                <FiPhone className="w-5 h-5" />
                <span>09039611238</span>
              </a>
              <a
                href="mailto:contact@alimswrite.com"
                className="flex items-center gap-3 text-dark-600 hover:text-primary-900 transition-colors"
              >
                <FiMail className="w-5 h-5" />
                <span>contact@alimswrite.com</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-gray-100 text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-100 text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-gray-100 text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2349039611238"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-100 text-dark-600 hover:bg-green-500 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}