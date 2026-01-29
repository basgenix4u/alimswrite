// components/home/FinalCTA.jsx
'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '@/lib/SettingsContext'

const benefits = [
  'Free topic consultation',
  'Plagiarism-free guarantee',
  'Unlimited revisions',
  'Confidential service',
  '24/7 WhatsApp support',
  'Money-back guarantee',
]

export default function FinalCTA() {
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
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Submit Work You Can Be{' '}
              <span className="text-secondary-400">Proud Of?</span>
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-xl mx-auto lg:mx-0">
              Join thousands of students who have achieved academic success with our help. 
              Your project is just a conversation away.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/order">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Start Your Project
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href={`${whatsappLink}?text=${encodeURIComponent('Hello, I am interested in your academic writing services')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-900"
                >
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Right Content - Benefits */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">
              What You Get With Every Order
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="w-4 h-4 text-dark-900" />
                  </div>
                  <span className="text-white/90">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Urgency Note */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-primary-200 text-sm">
                Deadline approaching? We offer express delivery for urgent projects. 
                Contact us now to discuss your timeline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
