// app/blog/[slug]/page.jsx
// NO 'use client' here - this is a Server Component!

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiCalendar, FiShare2, FiMessageSquare, FiEye } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CommentSection from '@/components/blog/CommentSection'
import { formatDate } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize' // ✅ NEW: Import sanitizer

// Fetch blog post from database
async function getBlogPost(slug) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    })

    if (post) {
      // Increment views
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      }).catch(() => {})
    }

    return post
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

// Fetch related posts
async function getRelatedPosts(categoryId, currentPostId) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        categoryId,
        id: { not: currentPostId },
        status: 'published',
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    })
    return posts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Get comment count
async function getCommentCount(postId) {
  try {
    const count = await prisma.comment.count({
      where: {
        postId,
        status: 'approved',
      },
    })
    return count
  } catch (error) {
    return 0
  }
}

// Calculate read time
function calculateReadTime(content) {
  if (!content) return '5 min read'
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Generate metadata - ONLY works in Server Components!
export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  // If post not found or not published, show 404
  if (!post || post.status !== 'published') {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)
  const commentCount = await getCommentCount(post.id)
  const readTime = calculateReadTime(post.content)

  const shareUrl = `https://alimswrite.com/blog/${post.slug}`

  // ✅ NEW: Sanitize the blog content before rendering
  const safeContent = sanitizeHtml(post.content)

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-dark-500 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="text-dark-300">/</span>
            <Link href="/blog" className="text-dark-500 hover:text-primary-600 transition-colors">
              Blog
            </Link>
            <span className="text-dark-300">/</span>
            <span className="text-dark-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center text-dark-500 hover:text-primary-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`}>
                <Badge variant="primary" size="sm" className="mb-4">
                  {post.category.name}
                </Badge>
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-dark-600 mb-4">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
              <span className="flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                {readTime}
              </span>
              <span className="flex items-center gap-1">
                <FiEye className="w-4 h-4" />
                {post.views} views
              </span>
              <span className="flex items-center gap-1">
                <FiMessageSquare className="w-4 h-4" />
                {commentCount} comments
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage ? (
            <div className="mb-8">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-8">
              <span className="text-6xl font-bold text-primary-300">
                {post.title.charAt(0)}
              </span>
            </div>
          )}

          {/* Content - ✅ NOW SANITIZED */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 pt-8 border-t">
              <h4 className="text-sm font-medium text-dark-700 mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 text-dark-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mb-12 p-6 bg-gray-50 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FiShare2 className="w-5 h-5 text-dark-500" />
                <span className="font-medium text-dark-700">Share this article:</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                >
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Author Box */}
          <div className="mb-12 p-6 bg-primary-50 rounded-xl border border-primary-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary-900 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {post.authorName?.charAt(0) || 'A'}
              </div>
              <div>
                <h4 className="font-semibold text-dark-900 mb-1">{post.authorName}</h4>
                <p className="text-dark-500 text-sm mb-3">
                  We are a team of academic writing experts dedicated to helping students succeed.
                </p>
                <Link href="/about" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  Learn more about us
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-dark-900 mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <h4 className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h4>
                    <span className="text-sm text-dark-500">
                      {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          {post.allowComments && (
            <CommentSection postId={post.id} />
          )}
        </div>
      </article>

      {/* CTA */}
      <section className="py-12 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Professional Help With Your Project?
          </h2>
          <p className="text-primary-100 mb-6">
            Our team of experts is ready to assist you with any academic writing task.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button variant="secondary" size="lg">
                Start Your Project
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                Browse Topics
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}