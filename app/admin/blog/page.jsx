// app/admin/blog/page.jsx
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
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusBadgeVariant = {
  draft: 'default',
  published: 'success',
  archived: 'warning',
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })

  useEffect(() => {
    fetchPosts()
  }, [statusFilter])

  const fetchPosts = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      params.set('page', page.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()
      setPosts(data.posts || [])
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        fetchPosts(pagination.page)
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const toggleFeatured = async (slug, currentValue) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentValue }),
      })

      if (response.ok) {
        toast.success(currentValue ? 'Removed from featured' : 'Added to featured')
        fetchPosts(pagination.page)
      }
    } catch (error) {
      toast.error('Failed to update post')
    }
  }

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    return post.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Blog Posts</h1>
          <p className="text-dark-500 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary">
            <FiPlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {post.isFeatured && (
                            <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                          <p className="font-medium text-dark-900 line-clamp-1 max-w-md">
                            {post.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark-600">{post.category?.name || 'Uncategorized'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusBadgeVariant[post.status] || 'default'}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark-600">{post.views}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-dark-600">
                          {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleFeatured(post.slug, post.isFeatured)}
                            className={`p-2 rounded-lg transition-colors ${
                              post.isFeatured
                                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                                : 'text-dark-400 hover:bg-gray-100'
                            }`}
                            title={post.isFeatured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <FiStar className={`w-4 h-4 ${post.isFeatured ? 'fill-current' : ''}`} />
                          </button>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-dark-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </a>
                          <Link
                            href={`/admin/blog/${post.slug}/edit`}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.slug)}
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
                  Showing {filteredPosts.length} of {pagination.total} posts
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchPosts(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-dark-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchPosts(pagination.page + 1)}
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
            <p>No blog posts found</p>
            <Link href="/admin/blog/new" className="text-primary-600 hover:underline mt-2">
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
