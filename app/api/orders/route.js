// app/api/orders/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sanitizeText } from '@/lib/sanitize'

function generateOrderNumber() {
  const prefix = 'ALW'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// GET orders
export async function GET(request) {
  console.log('📋 Orders GET request')
  
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const skip = (page - 1) * limit
    const where = {}

    if (status && status !== 'all') where.status = status
    if (priority && priority !== 'all') where.priority = priority

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
    console.error('❌ Get orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message, orders: [], total: 0 },
      { status: 500 }
    )
  }
}

// POST - Create order
export async function POST(request) {
  console.log('📦 Order POST request received')
  
  try {
    const body = await request.json()
    console.log('📦 Order data keys:', Object.keys(body))

    // Accept multiple field name formats
    const customerName = body.customerName || body.name || body.fullName
    const customerEmail = body.customerEmail || body.email
    const customerPhone = body.customerPhone || body.phone || body.phoneNumber
    const customerWhatsapp = body.customerWhatsapp || body.whatsapp || customerPhone

    // Validate required fields
    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!customerPhone?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

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
      source,
    } = body

    const orderNumber = generateOrderNumber()

    const finalEmail = customerEmail?.trim() 
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
        description: description ? sanitizeText(description) : 'No description',
        attachments: attachments || [],
        status: 'pending',
        priority: 'normal',
        source: source || 'website',
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
        message: `${sanitizeText(customerName)} placed an order`,
        link: `/admin/orders/${order.id}`,
      },
    }).catch(err => console.error('Notification error:', err))

    console.log('✅ Order created:', order.orderNumber)

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully!',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) {
    console.error('❌ Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    )
  }
}