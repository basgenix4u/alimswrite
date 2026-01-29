// app/api/topics/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get single topic
export async function GET(request, { params }) {
  try {
    // Try to find by ID first, then by slug
    let topic = await prisma.topic.findUnique({
      where: { id: params.id },
      include: {
        department: {
          include: {
            faculty: true,
          },
        },
      },
    })

    if (!topic) {
      topic = await prisma.topic.findUnique({
        where: { slug: params.id },
        include: {
          department: {
            include: {
              faculty: true,
            },
          },
        },
      })
    }

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Increment views
    await prisma.topic.update({
      where: { id: topic.id },
      data: { views: { increment: 1 } },
    })

    // Get related topics
    const relatedTopics = await prisma.topic.findMany({
      where: {
        departmentId: topic.departmentId,
        id: { not: topic.id },
        isActive: true,
      },
      take: 4,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        level: true,
      },
    })

    return NextResponse.json({
      topic,
      relatedTopics,
    })
  } catch (error) {
    console.error('Get topic error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    )
  }
}

// Update topic
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      topic,
    })
  } catch (error) {
    console.error('Update topic error:', error)
    return NextResponse.json(
      { error: 'Failed to update topic' },
      { status: 500 }
    )
  }
}

// Delete topic
export async function DELETE(request, { params }) {
  try {
    await prisma.topic.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Topic deleted successfully',
    })
  } catch (error) {
    console.error('Delete topic error:', error)
    return NextResponse.json(
      { error: 'Failed to delete topic' },
      { status: 500 }
    )
  }
}