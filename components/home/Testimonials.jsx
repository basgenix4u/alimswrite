// components/home/Testimonials.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FiChevronLeft, FiChevronRight, FiStar, FiArrowRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?status=approved&limit=10')
      const data = await res.json()
      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (testimonials.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const prevSlide = () => {
    if (testimonials.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, testimonials.length])

  const renderStars = (rating) => {
    return Array(5).fill(null).map((_, i) => (
      <FiStar
        key={i}
        className={cn(
          'w-4 h-4',
          i < rating ? 'text-secondary-500 fill-secondary-500' : 'text-gray-300'
        )}
      />
    ))
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show section if no testimonials
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-dark-500">
            Join thousands of satisfied students who have trusted us with their academic success.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
            {/* Quote Icon */}
            <div className="mb-6">
              <svg className="w-12 h-12 text-primary-200" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
              </svg>
            </div>

            {/* Content */}
            <div className="min-h-[120px]">
              <p className="text-lg md:text-xl text-dark-700 leading-relaxed mb-6">
                &quot;{currentTestimonial.content}&quot;
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {renderStars(currentTestimonial.rating)}
            </div>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-dark-900">
                  {currentTestimonial.customerName}
                </div>
                <div className="text-sm text-dark-500">
                  {currentTestimonial.department}
                  {currentTestimonial.university && `, ${currentTestimonial.university}`}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    prevSlide()
                    setIsAutoPlaying(false)
                  }}
                  className="p-2 rounded-full bg-white border border-gray-200 text-dark-600 hover:bg-primary-900 hover:text-white hover:border-primary-900 transition-all"
                  aria-label="Previous testimonial"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    nextSlide()
                    setIsAutoPlaying(false)
                  }}
                  className="p-2 rounded-full bg-white border border-gray-200 text-dark-600 hover:bg-primary-900 hover:text-white hover:border-primary-900 transition-all"
                  aria-label="Next testimonial"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all duration-300',
                  currentIndex === index
                    ? 'bg-primary-900 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/testimonials">
            <Button variant="outline">
              Read More Reviews
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}