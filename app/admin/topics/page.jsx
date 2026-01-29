// app/admin/topics/page.jsx
'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiStar,
  FiMoreVertical,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function TopicsPage() {
  const [topics, setTopics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async (page = 1) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/topics?page=${page}&limit=20`)
      const data = await response.json()
      setTopics(data.topics || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Topic deleted successfully')
        fetchTopics(pagination.page)
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete topic')
    }
  }

  const toggleFeatured = async (id, currentValue) => {
    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentValue }),
      })

      if (response.ok) {
        toast.success(currentValue ? 'Removed from featured' : 'Added to featured')
        fetchTopics(pagination.page)
      }
    } catch (error) {
      toast.error('Failed to update topic')
    }
  }

  const filteredTopics = topics.filter(topic => {
    if (!searchQuery) return true
    return topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Project Topics</h1>
          <p className="text-dark-500 mt-1">Manage project topics in your database</p>
        </div>
        <Link href="/admin/topics/new">
          <Button variant="primary">
            <FiPlus className="w-4 h-4 mr-2" />
            Add Topic
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : filteredTopics.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-dark-900 line-clamp-1 max-w-md">
                          {topic.title}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark-600">{topic.department?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{topic.level}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark-600">{topic.views}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleFeatured(topic.id, topic.isFeatured)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            topic.isFeatured
                              ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                              : 'text-dark-400 hover:bg-gray-100'
                          }`}
                        >
                          <FiStar className={`w-4 h-4 ${topic.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/topics/${topic.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-dark-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </a>
                          <Link
                            href={`/admin/topics/${topic.id}/edit`}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(topic.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-dark-500">
                  Showing {filteredTopics.length} of {pagination.total} topics
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchTopics(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-dark-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchTopics(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-dark-500">
            <FiSearch className="w-12 h-12 text-dark-300 mb-3" />
            <p>No topics found</p>
            <Link href="/admin/topics/new" className="text-primary-600 hover:underline mt-2">
              Add your first topic
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
