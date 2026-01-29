// app/admin/callbacks/page.jsx
'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FiPhone,
  FiCheck,
  FiClock,
  FiMessageSquare,
  FiTrash2,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Textarea from '@/components/ui/Textarea'
import { formatRelativeTime, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusBadgeVariant = {
  pending: 'warning',
  called: 'info',
  no_answer: 'danger',
  completed: 'success',
}

export default function CallbacksPage() {
  const searchParams = useSearchParams()
  const [callbacks, setCallbacks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'pending')
  const [selectedCallback, setSelectedCallback] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchCallbacks()
  }, [statusFilter])

  const fetchCallbacks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/callback?status=${statusFilter}`)
      const data = await response.json()
      setCallbacks(data.callbacks || [])
    } catch (error) {
      console.error('Failed to fetch callbacks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id, newStatus, adminNotes = null) => {
    try {
      const body = { status: newStatus }
      if (adminNotes) body.adminNotes = adminNotes
      if (newStatus === 'called' || newStatus === 'completed') {
        body.calledAt = new Date().toISOString()
      }

      const response = await fetch(`/api/callback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`)
        setSelectedCallback(null)
        setNotes('')
        fetchCallbacks()
      }
    } catch (error) {
      toast.error('Failed to update callback')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this callback request?')) return

    try {
      const response = await fetch(`/api/callback/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Callback deleted')
        fetchCallbacks()
      }
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Callback Requests</h1>
          <p className="text-dark-500 mt-1">Manage customer callback requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['pending', 'called', 'no_answer', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-dark-600 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Callbacks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : callbacks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {callbacks.map((callback) => (
              <div key={callback.id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-green-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-dark-900">{callback.name}</span>
                      <Badge variant={statusBadgeVariant[callback.status]} size="sm">
                        {callback.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-dark-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FiPhone className="w-4 h-4" />
                        {callback.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {formatRelativeTime(callback.createdAt)}
                      </span>
                    </div>
                    {callback.departmentText && (
                      <p className="text-sm text-dark-600 mb-2">
                        <span className="font-medium">Department:</span> {callback.departmentText}
                      </p>
                    )}
                    {callback.serviceNeeded && (
                      <p className="text-sm text-dark-600 mb-2">
                        <span className="font-medium">Service:</span> {callback.serviceNeeded}
                      </p>
                    )}
                    {callback.description && (
                      <p className="text-dark-700 bg-gray-50 p-3 rounded-lg text-sm mb-4">
                        {callback.description}
                      </p>
                    )}
                    {callback.adminNotes && (
                      <p className="text-sm text-primary-700 bg-primary-50 p-3 rounded-lg mb-4">
                        <span className="font-medium">Notes:</span> {callback.adminNotes}
                      </p>
                    )}

                    {/* Notes Form */}
                    {selectedCallback === callback.id && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <Textarea
                          placeholder="Add notes about this call..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCallback(null)
                              setNotes('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateStatus(callback.id, 'completed', notes)}
                          >
                            Mark Completed
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${callback.phone?.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="whatsapp" size="sm">
                          <FaWhatsapp className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                      </a>
                      <a href={`tel:${callback.phone}`}>
                        <Button variant="outline" size="sm">
                          <FiPhone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </a>
                      {callback.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateStatus(callback.id, 'called')}
                          >
                            <FiCheck className="w-4 h-4 mr-1" />
                            Mark Called
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateStatus(callback.id, 'no_answer')}
                          >
                            No Answer
                          </Button>
                        </>
                      )}
                      {callback.status === 'called' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => setSelectedCallback(callback.id)}
                        >
                          <FiMessageSquare className="w-4 h-4 mr-1" />
                          Add Notes
                        </Button>
                      )}
                      <button
                        onClick={() => handleDelete(callback.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-dark-500">
            <FiPhone className="w-12 h-12 text-dark-300 mb-3" />
            <p>No {statusFilter.replace('_', ' ')} callback requests</p>
          </div>
        )}
      </div>
    </div>
  )
}
