// app/admin/testimonials/page.jsx
'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FiSearch,
  FiCheck,
  FiX,
  FiStar,
  FiTrash2,
  FiPlus,
  FiImage,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusBadgeVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export default function TestimonialsPage() {
  const searchParams = useSearchParams()
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'pending')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    customerName: '',
    university: '',
    department: '',
    content: '',
    rating: 5,
    image: '',
    isImageTestimonial: false,
  })

  useEffect(() => {
    fetchTestimonials()
  }, [statusFilter])

  const fetchTestimonials = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/testimonials?status=${statusFilter}`)
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Testimonial ${newStatus}`)
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Failed to update testimonial')
    }
  }

  const toggleFeatured = async (id, currentValue) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentValue }),
      })

      if (response.ok) {
        toast.success(currentValue ? 'Removed from featured' : 'Added to featured')
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Testimonial deleted')
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleAddTestimonial = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTestimonial,
          source: 'admin_added',
        }),
      })

      if (response.ok) {
        // Auto-approve admin-added testimonials
        const data = await response.json()
        await fetch(`/api/testimonials/${data.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        })

        toast.success('Testimonial added')
        setShowAddForm(false)
        setNewTestimonial({
          customerName: '',
          university: '',
          department: '',
          content: '',
          rating: 5,
          image: '',
          isImageTestimonial: false,
        })
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Failed to add testimonial')
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Testimonials</h1>
          <p className="text-dark-500 mt-1">Manage customer reviews and testimonials</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Add New Testimonial</h2>
          <form onSubmit={handleAddTestimonial}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Customer Name"
                value={newTestimonial.customerName}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, customerName: e.target.value })}
                required
              />
              <Input
                label="University"
                value={newTestimonial.university}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, university: e.target.value })}
                required
              />
              <Input
                label="Department"
                value={newTestimonial.department}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, department: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                      className="p-1"
                    >
                      <FiStar
                        className={`w-6 h-6 ${
                          star <= newTestimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Textarea
              label="Testimonial Content"
              value={newTestimonial.content}
              onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
              rows={4}
              required
            />
            <div className="mt-4">
              <Input
                label="Image URL (for screenshot testimonials)"
                value={newTestimonial.image}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.value })}
                placeholder="https://..."
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTestimonial.isImageTestimonial}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, isImageTestimonial: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm text-dark-700">This is an image/screenshot testimonial</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Testimonial
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {testimonial.customerName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-dark-900">{testimonial.customerName}</p>
                      <Badge variant={statusBadgeVariant[testimonial.status]} size="sm">
                        {testimonial.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-dark-500">
                      {testimonial.department}, {testimonial.university}
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
                <p className="text-dark-600 mb-4 line-clamp-4">&quot;{testimonial.content}&quot;</p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-sm text-dark-400 mb-4">
                <span>{formatRelativeTime(testimonial.createdAt)}</span>
                <span className="capitalize">{testimonial.source?.replace('_', ' ')}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                {testimonial.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => updateStatus(testimonial.id, 'approved')}
                    >
                      <FiCheck className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => updateStatus(testimonial.id, 'rejected')}
                    >
                      <FiX className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <button
                  onClick={() => toggleFeatured(testimonial.id, testimonial.isFeatured)}
                  className={`p-2 rounded-lg transition-colors ${
                    testimonial.isFeatured
                      ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                      : 'text-dark-400 hover:bg-gray-100'
                  }`}
                  title={testimonial.isFeatured ? 'Remove from featured' : 'Add to featured'}
                >
                  <FiStar className={`w-4 h-4 ${testimonial.isFeatured ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-64 text-dark-500 bg-white rounded-xl">
            <FiStar className="w-12 h-12 text-dark-300 mb-3" />
            <p>No {statusFilter} testimonials</p>
          </div>
        )}
      </div>
    </div>
  )
}
