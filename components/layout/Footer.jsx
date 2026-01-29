// components/layout/Footer.jsx
'use client'

import Link from 'next/link'
import { FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { useSettings } from '@/lib/SettingsContext'

const footerLinks = {
  services: [
    { name: 'Project Writing', href: '/services/project-writing' },
    { name: 'Thesis & Dissertation', href: '/services/thesis-dissertation' },
    { name: 'Research Proposals', href: '/services/research-proposals' },
    { name: 'Data Analysis', href: '/services/data-analysis' },
    { name: 'Assignment Writing', href: '/services/assignment-writing' },
    { name: 'All Services', href: '/services' },
  ],
  resources: [
    { name: 'Topic Bank', href: '/topics' },
    { name: 'Blog', href: '/blog' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Testimonials', href: '/testimonials' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
  departments: [
    { name: 'Computer Science', href: '/topics?department=computer-science' },
    { name: 'Business Administration', href: '/topics?department=business-administration' },
    { name: 'Accounting', href: '/topics?department=accounting' },
    { name: 'Economics', href: '/topics?department=economics' },
    { name: 'Engineering', href: '/topics?faculty=engineering-technology' },
    { name: 'All Departments', href: '/topics' },
  ],
}

export default function Footer() {
  const { settings } = useSettings()
  const currentYear = new Date().getFullYear()

  // Format WhatsApp link
  const formatWhatsAppLink = (phone) => {
    if (!phone) return 'https://wa.me/2349039611238'
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1)
    if (!cleaned.startsWith('234')) cleaned = '234' + cleaned
    return `https://wa.me/${cleaned}`
  }

  const phoneNumber = settings.whatsappNumber || settings.phone || '09039611238'
  const email = settings.email || 'contact@alimswrite.com'
  const whatsappLink = formatWhatsAppLink(settings.whatsappNumber)
  const address = settings.address || 'Lagos, Nigeria'

  return (
    <footer className="bg-dark-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center mb-6">
              <span className="text-2xl font-bold text-white">
                {settings.siteName?.split('Write')[0] || 'Alims'}
              </span>
              <span className="text-2xl font-bold text-secondary-500">Write</span>
            </Link>
            <p className="text-dark-300 mb-6 leading-relaxed">
              {settings.tagline || 'Professional academic writing services trusted by students across Nigerian universities. From first draft to final defense, we are your partners in academic success.'}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-dark-300 hover:text-secondary-400 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
                <span>{phoneNumber}</span>
              </a>
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center gap-3 text-dark-300 hover:text-secondary-400 transition-colors"
              >
                <FiPhone className="w-5 h-5 flex-shrink-0" />
                <span>{phoneNumber}</span>
              </a>
              <a 
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-dark-300 hover:text-secondary-400 transition-colors"
              >
                <FiMail className="w-5 h-5 flex-shrink-0" />
                <span>{email}</span>
              </a>
              <div className="flex items-start gap-3 text-dark-300">
                <FiMapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-dark-800 text-dark-300 hover:bg-secondary-500 hover:text-dark-900 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-dark-800 text-dark-300 hover:bg-secondary-500 hover:text-dark-900 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-dark-800 text-dark-300 hover:bg-secondary-500 hover:text-dark-900 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-dark-800 text-dark-300 hover:bg-secondary-500 hover:text-dark-900 transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              )}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-dark-800 text-dark-300 hover:bg-green-500 hover:text-white transition-all duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-dark-300 hover:text-secondary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Departments
            </h3>
            <ul className="space-y-3">
              {footerLinks.departments.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-dark-300 hover:text-secondary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-dark-300 hover:text-secondary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-dark-300 hover:text-secondary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Link 
                href="/order"
                className="inline-flex items-center gap-2 text-secondary-400 hover:text-secondary-300 font-medium text-sm transition-colors group"
              >
                Start Your Project
                <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-dark-400 text-sm">
              {currentYear} {settings.siteName || 'AlimsWrite'}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="text-dark-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-dark-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}