// app/api/orders/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'

function generateOrderNumber() {
  const prefix = 'ALW'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function GET(request) {
  try {
    const limiter = await rateLimit(request, 'api')
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const skip = (page - 1) * limit
    const where = {}

    if (status) where.status = status
    if (priority) where.priority = priority

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          service: { select: { id: true, title: true } },
          department: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const limiter = await rateLimit(request, 'order')
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many orders. Please wait a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    // ✅ FIX: Accept both field name formats
    const customerName = body.customerName || body.name || body.fullName
    const customerEmail = body.customerEmail || body.email
    const customerPhone = body.customerPhone || body.phone || body.phoneNumber
    const customerWhatsapp = body.customerWhatsapp || body.whatsapp || body.whatsappNumber || customerPhone

    const {
      serviceId,
      departmentId,
      projectTitle,
      projectType,
      level,
      numberOfPages,
      numberOfChapters,
      deadline,
      description,
      attachments,
      status,
      priority,
      source,
      adminNotes,
      quotedPrice,
    } = body

    // ✅ Better validation with specific error messages
    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      )
    }

    if (!customerPhone?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // ✅ Validate phone format (Nigerian numbers)
    const cleanPhone = customerPhone.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 14) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    const orderNumber = generateOrderNumber()

    const finalEmail = customerEmail && customerEmail.trim() !== '' 
      ? customerEmail.toLowerCase().trim()
      : `order-${orderNumber.toLowerCase()}@alimswrite.com`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: sanitizeText(customerName),
        customerEmail: sanitizeText(finalEmail),
        customerPhone: sanitizeText(customerPhone),
        customerWhatsapp: sanitizeText(customerWhatsapp || customerPhone),
        serviceId: serviceId || null,
        departmentId: departmentId || null,
        projectTitle: projectTitle ? sanitizeText(projectTitle) : null,
        projectType: sanitizeText(projectType || 'Project'),
        level: level ? sanitizeText(level) : null,
        numberOfPages: numberOfPages ? parseInt(numberOfPages) : null,
        numberOfChapters: numberOfChapters ? parseInt(numberOfChapters) : null,
        deadline: deadline ? new Date(deadline) : null,
        description: description ? sanitizeText(description) : 'No description provided',
        attachments: attachments || [],
        status: status || 'pending',
        priority: priority || 'normal',
        source: source || 'website',
        adminNotes: adminNotes ? sanitizeText(adminNotes) : null,
        quotedPrice: quotedPrice || null,
      },
      include: {
        service: { select: { id: true, title: true } },
        department: { select: { id: true, name: true } },
      },
    })

    // Create notification (non-blocking)
    prisma.notification.create({
      data: {
        type: 'order',
        title: 'New Order Received',
        message: `${sanitizeText(customerName)} placed an order for ${projectType || 'a project'}`,
        link: `/admin/orders/${order.id}`,
      },
    }).catch((err) => console.error('Notification error:', err))

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully! We will contact you shortly.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}