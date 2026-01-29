// app/api/testimonials/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Create new testimonial
export async function POST(request) {
  try {
    const body = await request.json()

    // Handle both field naming conventions
    const {
      // From website form
      name,
      email,
      phone,
      university,
      department,
      service,
      rating,
      content,
      // From admin form
      customerName,
      customerEmail,
      customerPhone,
      serviceUsed,
      image,
      isImageTestimonial,
      source,
      status,
      isFeatured,
    } = body

    // Use whichever field is provided
    const finalName = customerName || name
    const finalEmail = customerEmail || email
    const finalPhone = customerPhone || phone
    const finalService = serviceUsed || service

    // Validate required fields
    if (!finalName || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    // Determine if admin is adding (auto-approve)
    const isAdminAdd = source === 'admin_added'

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: finalName,
        customerEmail: finalEmail || null,
        customerPhone: finalPhone || null,
        university: university || null,
        department: department || null,
        serviceUsed: finalService || null,
        rating: parseInt(rating) || 5,
        content,
        image: image || null,
        isImageTestimonial: isImageTestimonial || false,
        source: source || 'website',
        // Admin-added = auto approved, website = pending
        status: isAdminAdd ? (status || 'approved') : 'pending',
        isFeatured: isAdminAdd ? (isFeatured || false) : false,
      },
    })

    // Create notification only for website submissions
    if (!isAdminAdd) {
      await prisma.notification.create({
        data: {
          type: 'review',
          title: 'New Review Pending Approval',
          message: `${finalName} submitted a ${rating || 5}-star review`,
          link: '/admin/testimonials',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: isAdminAdd 
        ? 'Testimonial added successfully' 
        : 'Review submitted for approval',
      id: testimonial.id,
      testimonial,
    })
  } catch (error) {
    console.error('Testimonial submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit review: ' + error.message },
      { status: 500 }
    )
  }
}

// Get testimonials
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'approved'
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where = {}
    
    // Handle status filter
    if (status !== 'all') {
      where.status = status
    }
    
    if (featured === 'true') {
      where.isFeatured = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}