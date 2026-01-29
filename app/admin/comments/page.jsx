// app/admin/comments/page.jsx
'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  FiSearch,
  FiCheck,
  FiX,
  FiMessageSquare,
  FiCornerDownRight,
  FiTrash2,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Textarea from '@/components/ui/Textarea'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

const statusBadgeVariant = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  spam: 'default',
}

export default function CommentsPage() {
  const searchParams = useSearchParams()
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'pending')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    fetchComments()
  }, [statusFilter])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      // Fetch all comments (in production, create a proper admin endpoint)
      const response = await fetch(`/api/comments?status=${statusFilter}&postId=all`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      // Use sample data for demo
      setComments([
        {
          id: '1',
          authorName: 'John Doe',
          authorEmail: 'john@example.com',
          content: 'This article was very helpful! Thank you for sharing.',
          status: 'pending',
          createdAt: new Date().toISOString(),
          post: { title: 'How to Write Chapter One' },
        },
        {
          id: '2',
          authorName: 'Jane Smith',
          authorEmail: 'jane@example.com',
          content: 'Can you write more about data analysis using SPSS?',
          status: 'pending',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          post: { title: 'SPSS Data Analysis Guide' },
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success(`Comment ${newStatus}`)
        fetchComments()
      }
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleReply = async (id) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply')
      return
    }

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminReply: replyContent,
          status: 'approved',
        }),
      })

      if (response.ok) {
        toast.success('Reply sent and comment approved')
        setReplyingTo(null)
        setReplyContent('')
        fetchComments()
      }
    } catch (error) {
      toast.error('Failed to send reply')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Comment deleted')
        fetchComments()
      }
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Comments</h1>
          <p className="text-dark-500 mt-1">Manage blog comments and replies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['pending', 'approved', 'rejected', 'spam'].map((status) => (
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

      {/* Comments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMessageSquare className="w-5 h-5 text-primary-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-dark-900">{comment.authorName}</span>
                      <Badge variant={statusBadgeVariant[comment.status]} size="sm">
                        {comment.status}
                      </Badge>
                      <span className="text-xs text-dark-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-500 mb-2">
                      On: <span className="font-medium">{comment.post?.title || 'Unknown Post'}</span>
                    </p>
                    <p className="text-dark-700 mb-4">{comment.content}</p>

                    {/* Admin Reply */}
                    {comment.adminReply && (
                      <div className="ml-4 p-3 bg-primary-50 rounded-lg border-l-2 border-primary-500 mb-4">
                        <p className="text-sm font-medium text-primary-900 mb-1">Your Reply:</p>
                        <p className="text-sm text-dark-600">{comment.adminReply}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <Textarea
                          placeholder="Write your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent('')
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleReply(comment.id)}
                          >
                            Reply and Approve
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {comment.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => updateStatus(comment.id, 'approved')}
                          >
                            <FiCheck className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateStatus(comment.id, 'rejected')}
                          >
                            <FiX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {!comment.adminReply && replyingTo !== comment.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReplyingTo(comment.id)}
                        >
                          <FiCornerDownRight className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-dark-500">
            <FiMessageSquare className="w-12 h-12 text-dark-300 mb-3" />
            <p>No {statusFilter} comments</p>
          </div>
        )}
      </div>
    </div>
  )
}
