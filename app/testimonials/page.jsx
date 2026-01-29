// app/testimonials/page.jsx
'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import { FiStar, FiUser, FiCheck, FiSend } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const stats = [
  { label: 'Projects Delivered', value: '5,000+' },
  { label: 'Satisfied Students', value: '4,800+' },
  { label: 'Average Rating', value: '4.9/5' },
  { label: 'Success Rate', value: '98%' },
]

const services = [
  { value: 'project-writing', label: 'Project Writing' },
  { value: 'data-analysis', label: 'Data Analysis' },
  { value: 'thesis-dissertation', label: 'Thesis/Dissertation' },
  { value: 'assignment', label: 'Assignment Writing' },
  { value: 'other', label: 'Other Services' },
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    department: '',
    service: '',
    rating: 5,
    content: '',
  })

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?status=approved')
      const data = await response.json()
      
      if (data.testimonials) {
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={cn(
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            disabled={!interactive}
          >
            <FiStar
              className={cn(
                'w-5 h-5',
                star <= rating
                  ? 'text-secondary-500 fill-secondary-500'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'website',
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Thank you! Your review has been submitted for approval.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          university: '',
          department: '',
          service: '',
          rating: 5,
          content: '',
        })
        setShowForm(false)
      } else {
        throw new Error(data.error || 'Failed to submit')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Read reviews from students across Nigerian universities who have used our services.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-dark-900">Client Reviews</h2>
              <p className="text-dark-500">Verified reviews from real students</p>
            </div>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Share Your Experience
            </Button>
          </div>

          {/* Submit Review Form */}
          {showForm && (
            <div className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-dark-900 mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Input
                    label="Full Name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="University"
                    placeholder="e.g., University of Lagos"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    required
                  />
                  <Input
                    label="Department"
                    placeholder="e.g., Computer Science"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                  <Select
                    label="Service Used"
                    options={services}
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="Select service"
                  />
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Your Rating
                    </label>
                    {renderStars(formData.rating, true, (rating) => 
                      setFormData({ ...formData, rating })
                    )}
                  </div>
                </div>
                <Textarea
                  label="Your Review"
                  placeholder="Tell us about your experience with our service..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  required
                />
                <div className="flex items-center justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    <FiSend className="w-4 h-4 mr-2" />
                    Submit Review
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Testimonials Grid - Now from Database */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "bg-white rounded-xl p-6 shadow-sm border border-gray-100",
                    testimonial.isFeatured && "ring-2 ring-secondary-500"
                  )}
                >
                  {/* Featured Badge */}
                  {testimonial.isFeatured && (
                    <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full mb-3">
                      Featured
                    </span>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {testimonial.image ? (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.customerName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-dark-900">
                            {testimonial.customerName}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <FiCheck className="w-3 h-3" />
                            Verified
                          </span>
                        </div>
                        <p className="text-sm text-dark-500">
                          {testimonial.department}
                          {testimonial.university && `, ${testimonial.university}`}
                        </p>
                      </div>
                    </div>
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Content */}
                  {testimonial.isImageTestimonial && testimonial.image ? (
                    <div className="mb-4">
                      <img
                        src={testimonial.image}
                        alt="Testimonial screenshot"
                        className="w-full rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : (
                    <p className="text-dark-600 leading-relaxed mb-4">
                      &quot;{testimonial.content}&quot;
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    {testimonial.serviceUsed && (
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full">
                        {testimonial.serviceUsed}
                      </span>
                    )}
                    <span className="text-dark-400">
                      {new Date(testimonial.createdAt).toLocaleDateString('en-NG', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <FiStar className="w-12 h-12 text-dark-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-900 mb-2">No reviews yet</h3>
              <p className="text-dark-500 mb-6">Be the first to share your experience!</p>
              <Button variant="primary" onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join Our Satisfied Clients?
          </h2>
          <p className="text-primary-100 mb-8">
            Experience the quality service that has earned us these amazing reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/order">
              <Button variant="secondary" size="lg">
                Start Your Project
              </Button>
            </a>
            <a
              href="https://wa.me/2349039611238"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                Chat With Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}