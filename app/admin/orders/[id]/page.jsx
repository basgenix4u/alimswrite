// app/admin/orders/[id]/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiUser,
  FiBook,
  FiFileText,
  FiSave,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Input from '@/components/ui/Input'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

const statusBadgeVariant = {
  pending: 'warning',
  contacted: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

export default function OrderDetailPage({ params }) {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    adminNotes: '',
    quotedPrice: '',
  })

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      if (data.order) {
        setOrder(data.order)
        setFormData({
          status: data.order.status || 'pending',
          priority: data.order.priority || 'normal',
          adminNotes: data.order.adminNotes || '',
          quotedPrice: data.order.quotedPrice || '',
        })
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
      toast.error('Failed to load order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Order updated successfully')
        fetchOrder()
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      toast.error('Failed to update order')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-500">Order not found</p>
        <Link href="/admin/orders" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-dark-500 flex items-center gap-2 mt-1">
              <FiClock className="w-4 h-4" />
              {formatRelativeTime(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${order.customerWhatsapp?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="whatsapp">
              <FaWhatsapp className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </a>
          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            <FiSave className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-primary-600" />
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-dark-500">Name</label>
                <p className="font-medium text-dark-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-dark-500">Email</label>
                <p className="font-medium text-dark-900">{order.customerEmail}</p>
              </div>
              <div>
                <label className="text-sm text-dark-500">Phone</label>
                <p className="font-medium text-dark-900">{order.customerPhone}</p>
              </div>
              <div>
                <label className="text-sm text-dark-500">WhatsApp</label>
                <p className="font-medium text-dark-900">{order.customerWhatsapp}</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
              <FiBook className="w-5 h-5 text-primary-600" />
              Project Details
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-dark-500">Service Type</label>
                  <p className="font-medium text-dark-900">{order.projectType}</p>
                </div>
                {order.level && (
                  <div>
                    <label className="text-sm text-dark-500">Academic Level</label>
                    <p className="font-medium text-dark-900">{order.level}</p>
                  </div>
                )}
                {order.department && (
                  <div>
                    <label className="text-sm text-dark-500">Department</label>
                    <p className="font-medium text-dark-900">{order.department.name}</p>
                  </div>
                )}
                {order.deadline && (
                  <div>
                    <label className="text-sm text-dark-500">Deadline</label>
                    <p className="font-medium text-dark-900">{formatDate(order.deadline)}</p>
                  </div>
                )}
                {order.numberOfChapters && (
                  <div>
                    <label className="text-sm text-dark-500">Chapters</label>
                    <p className="font-medium text-dark-900">{order.numberOfChapters}</p>
                  </div>
                )}
                {order.numberOfPages && (
                  <div>
                    <label className="text-sm text-dark-500">Pages</label>
                    <p className="font-medium text-dark-900">{order.numberOfPages}</p>
                  </div>
                )}
              </div>

              {order.projectTitle && (
                <div>
                  <label className="text-sm text-dark-500">Project Title</label>
                  <p className="font-medium text-dark-900">{order.projectTitle}</p>
                </div>
              )}

              <div>
                <label className="text-sm text-dark-500">Description / Requirements</label>
                <p className="text-dark-700 whitespace-pre-wrap mt-1 p-4 bg-gray-50 rounded-lg">
                  {order.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Status</h2>
            <div className="space-y-4">
              <Select
                label="Order Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
              <Select
                label="Priority"
                options={priorityOptions}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
              <Input
                label="Quoted Price"
                placeholder="e.g., N25,000"
                value={formData.quotedPrice}
                onChange={(e) => setFormData({ ...formData, quotedPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Admin Notes</h2>
            <Textarea
              placeholder="Add internal notes about this order..."
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              rows={5}
            />
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-500">Created</span>
                <span className="text-dark-700">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Last Updated</span>
                <span className="text-dark-700">{formatDate(order.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500">Source</span>
                <span className="text-dark-700 capitalize">{order.source}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
