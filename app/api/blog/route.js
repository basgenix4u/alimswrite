// app/api/blog/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize'

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
    // Log for debugging (check Vercel logs)
    console.log('API /api/blog GET called')
    
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit
    const where = {}

    if (status) where.status = status
    if (categoryId) where.categoryId = categoryId
    if (featured === 'true') where.isFeatured = true

    console.log('Query params:', { page, limit, status, categoryId, featured })

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

    console.log(`Found ${posts.length} posts, total: ${total}`)

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      // Add pagination object for admin page compatibility
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      }
    })
  } catch (error) {
    console.error('Get blog posts error:', error)
    
    // Return detailed error in development
    const errorResponse = {
      error: 'Failed to fetch blog posts',
      posts: [],
      total: 0,
      pagination: { page: 1, pages: 1, total: 0 },
    }
    
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = error.message
      errorResponse.stack = error.stack
    }
    
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// POST - Create blog post
export async function POST(request) {
  console.log('API /api/blog POST called')
  
  try {
    const body = await request.json()
    console.log('Received body:', JSON.stringify(body, null, 2))

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
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    if (!excerpt?.trim()) {
      return NextResponse.json(
        { error: 'Excerpt is required' },
        { status: 400 }
      )
    }
    
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId }
    })
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const cleanTitle = sanitizeText(title)
    const cleanExcerpt = sanitizeText(excerpt)
    const cleanContent = sanitizeHtml(content)

    // Generate unique slug
    let baseSlug = slugify(cleanTitle, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    console.log('Creating post with slug:', slug)

    // Create the post
    const post = await prisma.blogPost.create({
      data: {
        title: cleanTitle,
        slug,
        excerpt: cleanExcerpt,
        content: cleanContent,
        categoryId,
        tags: Array.isArray(tags) ? tags.filter(Boolean).map(t => sanitizeText(t)) : [],
        keywords: Array.isArray(keywords) ? keywords.filter(Boolean).map(k => sanitizeText(k)) : [],
        featuredImage: featuredImage || null,
        metaTitle: metaTitle ? sanitizeText(metaTitle) : cleanTitle,
        metaDescription: metaDescription ? sanitizeText(metaDescription) : cleanExcerpt.substring(0, 160),
        status: status || 'draft',
        isFeatured: Boolean(isFeatured),
        allowComments: allowComments !== false,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: { category: true },
    })

    console.log('Post created successfully:', post.id)

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post
    }, { status: 201 })

  } catch (error) {
    console.error('Create blog post error:', error)
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid category reference' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create blog post',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}