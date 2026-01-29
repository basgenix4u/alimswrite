// components/blog/CommentSection.jsx
'use client'

import { useState, useEffect } from 'react'
import { FiMessageSquare, FiSend, FiUser } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState({
    name: '',
    email: '',
    content: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Fetch comments on mount
  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}&status=approved`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newComment.name || !newComment.email || !newComment.content) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: String(postId), // Ensure it's a string
          authorName: newComment.name,
          authorEmail: newComment.email,
          content: newComment.content,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Comment submitted! It will appear after approval.')
        setNewComment({ name: '', email: '', content: '' })
        setShowForm(false)
      } else {
        throw new Error(data.error || 'Failed to submit')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="comments">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-dark-900 flex items-center gap-2">
          <FiMessageSquare className="w-5 h-5" />
          Comments ({comments.length})
        </h3>
        {!showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Leave a Comment
          </Button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-dark-900 mb-4">Leave a Comment</h4>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                placeholder="Your name"
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                required
              />
              <Input
                type="email"
                placeholder="Your email (not published)"
                value={newComment.email}
                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                required
              />
            </div>
            <Textarea
              placeholder="Write your comment..."
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              rows={4}
              required
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-dark-400">
                Your comment will appear after approval.
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
                  <FiSend className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-dark-400 mt-2">Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              {/* Original Comment */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-dark-900">{comment.authorName}</span>
                    <span className="text-xs text-dark-400">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-dark-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>

              {/* Admin Reply */}
              {comment.adminReply && (
                <div className="ml-14 mt-4 flex gap-4">
                  <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="flex-1 p-4 bg-primary-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-primary-900">AlimsWrite Team</span>
                      <span className="text-xs text-primary-600">
                        {formatRelativeTime(comment.repliedAt)}
                      </span>
                    </div>
                    <p className="text-dark-600 text-sm leading-relaxed">
                      {comment.adminReply}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FiMessageSquare className="w-12 h-12 text-dark-300 mx-auto mb-3" />
          <p className="text-dark-500 mb-4">No comments yet. Be the first to comment!</p>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            Leave a Comment
          </Button>
        </div>
      )}
    </div>
  )
}