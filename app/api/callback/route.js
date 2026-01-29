// app/api/callback/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Create callback request
export async function POST(request) {
  try {
    const body = await request.json()

    const {
      name,
      phone,
      department,
      departmentId,
      serviceNeeded,
      description,
      source = 'popup',
    } = body

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Create callback request
    const callback = await prisma.callbackRequest.create({
      data: {
        name,
        phone,
        departmentId: departmentId || null,
        departmentText: department || null,
        serviceNeeded: serviceNeeded || null,
        description: description || null,
        source,
        status: 'pending',
      },
    })

    // Create notification for admin
    await prisma.notification.create({
      data: {
        type: 'callback',
        title: 'New Callback Request',
        message: `${name} requested a callback - ${phone}`,
        link: '/admin/callbacks',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Callback request submitted successfully',
      id: callback.id,
    })
  } catch (error) {
    console.error('Callback request error:', error)
    return NextResponse.json(
      { error: 'Failed to submit callback request' },
      { status: 500 }
    )
  }
}

// Get callback requests (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where = status ? { status } : {}

    const [callbacks, total] = await Promise.all([
      prisma.callbackRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          department: true,
        },
      }),
      prisma.callbackRequest.count({ where }),
    ])

    return NextResponse.json({
      callbacks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get callbacks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch callback requests' },
      { status: 500 }
    )
  }
}