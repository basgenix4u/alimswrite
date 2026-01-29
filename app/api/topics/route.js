// app/api/topics/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'

// Get topics with search and filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const departmentId = searchParams.get('departmentId')
    const level = searchParams.get('level')
    const featured = searchParams.get('featured')

    const skip = (page - 1) * limit

    // Build where clause
    const where = {
      isActive: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { keywords: { has: search } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (level) {
      where.level = { equals: level, mode: 'insensitive' }
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true,
              slug: true,
              faculty: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.topic.count({ where }),
    ])

    return NextResponse.json({
      topics,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get topics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

// Create topic
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      title,
      departmentId,
      description,
      abstract,
      objectives,
      methodology,
      keywords,
      level,
      year,
      chapters,
      pages,
      metaTitle,
      metaDescription,
      isFeatured,
    } = body

    if (!title || !departmentId) {
      return NextResponse.json(
        { error: 'Title and department are required' },
        { status: 400 }
      )
    }

    // Generate slug
    let slug = slugify(title, { lower: true, strict: true })
    
    // Check if slug exists
    const existing = await prisma.topic.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        slug,
        departmentId,
        description: description || null,
        abstract: abstract || null,
        objectives: objectives || [],
        methodology: methodology || null,
        keywords: keywords || [],
        level: level || 'BSc',
        year: year || new Date().getFullYear(),
        chapters: chapters || 5,
        pages: pages || null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description?.substring(0, 160) || null,
        isFeatured: isFeatured || false,
        isActive: true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Topic created successfully',
      topic,
    })
  } catch (error) {
    console.error('Create topic error:', error)
    return NextResponse.json(
      { error: 'Failed to create topic: ' + error.message },
      { status: 500 }
    )
  }
}