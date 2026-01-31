// app/api/blog/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'

// Simple sanitize functions (inline to avoid import issues)
function cleanHtml(dirty) {
  if (!dirty) return ''
  try {
    // Dynamic import for server-side only
    const DOMPurify = require('isomorphic-dompurify')
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'],
    })
  } catch (e) {
    // Fallback if DOMPurify fails
    return dirty.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }
}

function cleanText(input) {
  if (!input || typeof input !== 'string') return ''
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .substring(0, 10000)
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET blog posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit
    
    // Build where clause
    const where = {}
    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (featured === 'true') where.isFeatured = true

    // Execute queries
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages,
      pagination: {
        page,
        pages: totalPages,
        total,
      }
    })

  } catch (error) {
    console.error('GET /api/blog error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog posts',
        message: error.message,
        posts: [],
        total: 0,
        pagination: { page: 1, pages: 1, total: 0 }
      },
      { status: 500 }
    )
  }
}

// POST - Create blog post
export async function POST(request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const {
      title,
      excerpt,
      content,
      categoryId,
      tags,
      keywords,
      featuredImage,
      metaTitle,
      metaDescription,
      status,
      isFeatured,
      allowComments
    } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (!excerpt?.trim()) {
      return NextResponse.json({ error: 'Excerpt is required' }, { status: 400 })
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    if (!categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    // Clean inputs
    const cleanTitle = cleanText(title)
    const cleanExcerpt = cleanText(excerpt)
    const cleanContent = cleanHtml(content)

    // Generate unique slug
    let baseSlug = slugify(cleanTitle, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1
    
    let existingPost = await prisma.blogPost.findUnique({ where: { slug } })
    while (existingPost) {
      slug = `${baseSlug}-${counter}`
      counter++
      existingPost = await prisma.blogPost.findUnique({ where: { slug } })
    }

    // Process arrays
    const cleanTags = Array.isArray(tags) 
      ? tags.filter(t => t && typeof t === 'string').map(t => t.trim())
      : []
    
    const cleanKeywords = Array.isArray(keywords)
      ? keywords.filter(k => k && typeof k === 'string').map(k => k.trim())
      : []

    // Create the post
    const post = await prisma.blogPost.create({
      data: {
        title: cleanTitle,
        slug,
        excerpt: cleanExcerpt,
        content: cleanContent,
        categoryId,
        tags: cleanTags,
        keywords: cleanKeywords,
        featuredImage: featuredImage || null,
        metaTitle: metaTitle ? cleanText(metaTitle) : cleanTitle,
        metaDescription: metaDescription ? cleanText(metaDescription) : cleanExcerpt.substring(0, 160),
        status: status || 'draft',
        isFeatured: Boolean(isFeatured),
        allowComments: allowComments !== false,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: { category: true },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/blog error:', error)
    
    // Handle Prisma specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to create blog post',
        message: error.message 
      },
      { status: 500 }
    )
  }
}