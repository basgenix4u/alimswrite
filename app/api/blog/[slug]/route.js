// app/api/blog/[slug]/route.js
import { sanitizeHtml } from '@/lib/sanitize'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Get single blog post
export async function GET(request, { params }) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        comments: {
          where: { status: 'approved', parentId: null },
          orderBy: { createdAt: 'desc' },
          include: {
            replies: {
              where: { status: 'approved' },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    // Get related posts
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        categoryId: post.categoryId,
        id: { not: post.id },
        status: 'published',
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({
      post,
      relatedPosts,
    })
  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// Update blog post
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Handle slug update if title changed
    let updateData = { ...body }
    
    if (body.title && body.title !== existingPost.title) {
      let newSlug = slugify(body.title, { lower: true, strict: true })
      
      // Check if slug exists
      const slugExists = await prisma.blogPost.findFirst({
        where: {
          slug: newSlug,
          id: { not: existingPost.id },
        },
      })
      
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
      
      updateData.slug = newSlug
    }

    // Handle publishing
    if (body.status === 'published' && !existingPost.publishedAt) {
      updateData.publishedAt = new Date()
    }

    const post = await prisma.blogPost.update({
      where: { id: existingPost.id },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// Delete blog post
export async function DELETE(request, { params }) {
  try {
    // Find the post first
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        comments: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or already deleted' },
        { status: 404 }
      )
    }

    // Delete all comments first (including replies)
    if (post.comments && post.comments.length > 0) {
      // Delete replies first
      await prisma.comment.deleteMany({
        where: {
          postId: post.id,
          parentId: { not: null },
        },
      })
      
      // Then delete parent comments
      await prisma.comment.deleteMany({
        where: { postId: post.id },
      })
    }

    // Now delete the post
    await prisma.blogPost.delete({
      where: { id: post.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post: ' + error.message },
      { status: 500 }
    )
  }
}
