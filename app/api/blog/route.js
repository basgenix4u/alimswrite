// app/api/blog/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize'

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

    const where = {}

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
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

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: error.message, posts: [], total: 0 },
      { status: 500 }
    )
  }
}

// POST - Create blog post
export async function POST(request) {
  console.log('📝 Blog POST request received')
  
  try {
    const body = await request.json()
    console.log('📝 Blog data:', Object.keys(body))

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
      allowComments,
    } = body

    // Validate required fields
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

    // Check if category exists
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

    const post = await prisma.blogPost.create({
      data: {
        title: cleanTitle,
        slug,
        excerpt: cleanExcerpt,
        content: cleanContent,
        categoryId,
        tags: Array.isArray(tags) ? tags.filter(t => t).map(t => sanitizeText(t)) : [],
        keywords: Array.isArray(keywords) ? keywords.filter(k => k).map(k => sanitizeText(k)) : [],
        featuredImage: featuredImage || null,
        metaTitle: metaTitle ? sanitizeText(metaTitle) : cleanTitle,
        metaDescription: metaDescription ? sanitizeText(metaDescription) : cleanExcerpt.substring(0, 160),
        status: status || 'draft',
        isFeatured: Boolean(isFeatured),
        allowComments: allowComments !== false,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: {
        category: true,
      },
    })

    console.log('✅ Blog post created:', post.id)

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post,
    })
  } catch (error) {
    console.error('❌ Create blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post', details: error.message },
      { status: 500 }
    )
  }
}