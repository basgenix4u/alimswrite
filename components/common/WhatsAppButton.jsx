// components/common/WhatsAppButton.jsx
'use client'

import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    // Stop pulsing after 10 seconds
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false)
    }, 10000)

    return () => {
      clearTimeout(timer)
      clearTimeout(pulseTimer)
    }
  }, [])

  const whatsappMessage = encodeURIComponent(
    "Hello, I need help with my academic project. Please let me know how you can assist."
  )

  const whatsappLink = `https://wa.me/2349039611238?text=${whatsappMessage}`

  return (
    <div
      className={cn(
        'fixed bottom-6 left-6 z-40 transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      )}
    >
      {/* Tooltip */}
      <div className="absolute bottom-full left-0 mb-3 hidden sm:block">
        <div className="bg-dark-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute top-full left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-dark-900" />
        </div>
      </div>

      {/* Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl transition-all duration-300 hover:scale-110',
          isPulsing && 'animate-pulse'
        )}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>

      {/* Ripple Effect */}
      {isPulsing && (
        <>
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 animation-delay-200" />
        </>
      )}
    </div>
  )
}
