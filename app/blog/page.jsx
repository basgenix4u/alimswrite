// app/blog/page.jsx
'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiSearch, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'
import Badge from '@/components/ui/Badge'
import { SectionLoader } from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/lib/utils'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [selectedCategory])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('status', 'published')
      if (selectedCategory) params.set('categoryId', selectedCategory)

      const res = await fetch(`/api/blog?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories')
      const data = await res.json()
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Filter posts by search
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    return post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Calculate read time
  const getReadTime = (content) => {
    if (!content) return '5 min'
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return `${Math.ceil(words / 200)} min`
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Blog & Resources
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Tips, guides, and insights to help you succeed in your academic journey
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-dark-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-dark-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-dark-600 hover:bg-gray-50'
                    }`}
                  >
                    All Posts
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-dark-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Posts Grid */}
            <div className="flex-1">
              {loading ? (
                <SectionLoader />
              ) : filteredPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      {/* Image */}
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <span className="text-5xl font-bold text-primary-300">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        {post.category && (
                          <Badge variant="primary" size="sm" className="mb-3">
                            {post.category.name}
                          </Badge>
                        )}

                        <h2 className="text-lg font-semibold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h2>

                        <p className="text-dark-500 text-sm line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-sm text-dark-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              {getReadTime(post.content)} read
                            </span>
                          </div>
                          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiSearch className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-900 mb-2">No posts found</h3>
                  <p className="text-dark-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}