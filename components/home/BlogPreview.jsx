// components/home/BlogPreview.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiClock } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export default function BlogPreview() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog?status=published&limit=3')
      const data = await res.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null // Don't show section if no posts
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Resources to Help You Succeed
            </h2>
            <p className="text-lg text-dark-500">
              Free guides, tutorials, and project topics to support your academic journey.
            </p>
          </div>
          <Link href="/blog" className="flex-shrink-0">
            <Button variant="outline">
              View All Articles
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image */}
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/10 group-hover:bg-primary-900/20 transition-colors z-10" />
                {post.featuredImage ? (
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-300">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-900 text-xs font-medium rounded-full">
                    {post.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-semibold text-dark-900 mb-2 group-hover:text-primary-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-dark-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-dark-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {Math.ceil((post.content?.length || 0) / 1000)} min read
                    </span>
                  </div>
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}