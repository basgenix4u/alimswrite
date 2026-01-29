// components/home/Hero.jsx
'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '@/lib/SettingsContext'

const highlights = [
  'Chapter 1-5 Available',
  '70+ Departments Covered',
  'Timely Delivery Guaranteed',
  'Plagiarism-Free Content',
]

export default function Hero() {
  const { settings } = useSettings()

  // Format WhatsApp link
  const formatWhatsAppLink = (phone) => {
    if (!phone) return 'https://wa.me/2349039611238'
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) cleaned = '234' + cleaned.substring(1)
    if (!cleaned.startsWith('234')) cleaned = '234' + cleaned
    return `https://wa.me/${cleaned}`
  }

  const whatsappLink = formatWhatsAppLink(settings.whatsappNumber)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                Trusted by 5,000+ Students Nationwide
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                From First Draft to{' '}
                <span className="text-secondary-400">Final Defense</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {settings.tagline || 'Professional academic writing services trusted by students across Nigerian universities. We handle the research. You take the credit.'}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-md mx-auto lg:mx-0">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-white/90">
                    <FiCheck className="w-5 h-5 text-secondary-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/order">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Start Your Project
                    <FiArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a
                  href={`${whatsappLink}?text=${encodeURIComponent('Hello, I need help with my academic project')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-900">
                    <FaWhatsapp className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Content - Stats Cards */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-primary-50 rounded-xl">
                      <div className="text-4xl font-bold text-primary-900 mb-1">5,000+</div>
                      <div className="text-sm text-dark-500">Projects Delivered</div>
                    </div>
                    <div className="text-center p-4 bg-secondary-50 rounded-xl">
                      <div className="text-4xl font-bold text-secondary-600 mb-1">70+</div>
                      <div className="text-sm text-dark-500">Departments</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-4xl font-bold text-green-600 mb-1">98%</div>
                      <div className="text-sm text-dark-500">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <div className="text-4xl font-bold text-purple-600 mb-1">24/7</div>
                      <div className="text-sm text-dark-500">Support</div>
                    </div>
                  </div>

                  {/* Recent Order Notification */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark-800">New project completed</p>
                        <p className="text-xs text-dark-500 mt-0.5">
                          Computer Science project delivered to Unilag student
                        </p>
                        <p className="text-xs text-dark-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -right-4 bg-secondary-500 text-dark-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Fast Delivery
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary-400/20 rounded-full blur-2xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-400/20 rounded-full blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
