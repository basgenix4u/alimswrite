// app/api/blog/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'

// Get blog posts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
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
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// Create blog post
export async function POST(request) {
  try {
    const body = await request.json()

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

    if (!title || !excerpt || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug
    let slug = slugify(title, { lower: true, strict: true })

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId,
        tags: tags || [],
        keywords: keywords || [],
        featuredImage: featuredImage || null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt.substring(0, 160),
        status: status || 'draft',
        isFeatured: isFeatured || false,
        allowComments: allowComments !== false,
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post,
    })
  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post: ' + error.message },
      { status: 500 }
    )
  }
}
