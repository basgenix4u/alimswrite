// app/api/stats/route.js
export const revalidate = 60
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    const startOfWeek = new Date(startOfDay)
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay())

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    const [
      totalOrders,
      pendingOrders,
      todayOrders,
      weekOrders,
      monthOrders,
      totalTopics,
      totalBlogPosts,
      pendingComments,
      pendingTestimonials,
      pendingCallbacks,
      recentOrders,
    ] = await prisma.$transaction([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.topic.count({ where: { isActive: true } }),
      prisma.blogPost.count({ where: { status: 'published' } }),
      prisma.comment.count({ where: { status: 'pending' } }),
      prisma.testimonial.count({ where: { status: 'pending' } }),
      prisma.callbackRequest.count({ where: { status: 'pending' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          projectType: true,
          status: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders,
          week: weekOrders,
          month: monthOrders,
        },
        content: {
          topics: totalTopics,
          blogPosts: totalBlogPosts,
        },
        pending: {
          comments: pendingComments,
          testimonials: pendingTestimonials,
          callbacks: pendingCallbacks,
        },
      },
      recentOrders,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
