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

// GET orders
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status')

    const skip = (page - 1) * limit
    const where = {}
    if (status && status !== 'all') where.status = status

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

    return NextResponse.json({ orders, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders', orders: [], total: 0 }, { status: 500 })
  }
}

// POST - Create order
export async function POST(request) {
  try {
    const body = await request.json()

    const customerName = body.customerName || body.name || body.fullName
    const customerEmail = body.customerEmail || body.email
    const customerPhone = body.customerPhone || body.phone
    const customerWhatsapp = body.customerWhatsapp || body.whatsapp || customerPhone

    if (!customerName?.trim() || !customerPhone?.trim()) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()
    const finalEmail = customerEmail?.trim() || `order-${orderNumber.toLowerCase()}@alimswrite.com`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: sanitizeText(customerName),
        customerEmail: sanitizeText(finalEmail),
        customerPhone: sanitizeText(customerPhone),
        customerWhatsapp: sanitizeText(customerWhatsapp || customerPhone),
        serviceId: body.serviceId || null,
        departmentId: body.departmentId || null,
        projectTitle: body.projectTitle ? sanitizeText(body.projectTitle) : null,
        projectType: sanitizeText(body.projectType || 'Project'),
        level: body.level ? sanitizeText(body.level) : null,
        numberOfPages: body.numberOfPages ? parseInt(body.numberOfPages) : null,
        numberOfChapters: body.numberOfChapters ? parseInt(body.numberOfChapters) : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        description: body.description ? sanitizeText(body.description) : 'No description',
        attachments: body.attachments || [],
        status: 'pending',
        priority: 'normal',
        source: body.source || 'website',
      },
    })

    return NextResponse.json({ success: true, message: 'Order submitted!', order: { id: order.id, orderNumber } })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 })
  }
}