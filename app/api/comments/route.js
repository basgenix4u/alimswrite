// app/api/comments/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit' // ✅ NEW
import { sanitizeText, sanitizeHtml } from '@/lib/sanitize' // ✅ NEW

// Get comments
export async function GET(request) {
  try {
    // ✅ NEW: Rate limiting
    const limiter = await rateLimit(request, 'api')
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const status = searchParams.get('status') || 'approved'

    // Build where clause
    const where = {}
    
    // Handle postId - allow 'all' or empty to get all comments
    if (postId && postId !== 'all') {
      where.postId = postId
    }
    
    // Handle status - allow 'all' to get all statuses
    if (status && status !== 'all') {
      where.status = status
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        replies: {
          where: { status: 'approved' },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// Create new comment
export async function POST(request) {
  try {
    // ✅ NEW: Rate limiting - strict for comments to prevent spam
    const limiter = await rateLimit(request, 'comment')
    if (!limiter.success) {
      console.log(`[SECURITY] Comment rate limit hit from ${limiter.ip}`)
      return NextResponse.json(
        { error: 'You are commenting too fast. Please wait a minute and try again.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      postId,
      authorName,
      authorEmail,
      content,
      parentId,
    } = body

    // Validate required fields
    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, authorName, authorEmail, content' },
        { status: 400 }
      )
    }

    // ✅ NEW: Validate content length
    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'Comment is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      )
    }

    // ✅ NEW: Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Find the blog post - try by ID first, then by slug
    let post = await prisma.blogPost.findUnique({
      where: { id: postId },
    })

    // If not found by ID, try finding by slug
    if (!post) {
      post = await prisma.blogPost.findUnique({
        where: { slug: postId },
      })
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Validate parentId if provided
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    // ✅ NEW: Sanitize all inputs before saving
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorName: sanitizeText(authorName),
        authorEmail: sanitizeText(authorEmail),
        content: sanitizeText(content), // Sanitize comment content
        parentId: parentId || null,
        status: 'pending',
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'comment',
        title: 'New Comment Pending Approval',
        message: `${sanitizeText(authorName)} commented on "${post.title}"`,
        link: '/admin/comments',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment submitted for approval',
      id: comment.id,
    })
  } catch (error) {
    console.error('Comment submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit comment: ' + error.message },
      { status: 500 }
    )
  }
}
