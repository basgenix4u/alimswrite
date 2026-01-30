// app/api/testimonials/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET single testimonial
export async function GET(request, { params }) {
  try {
    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ testimonial })
  } catch (error) {
    console.error('Get testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

// UPDATE testimonial (approve/reject)
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log('📝 Updating testimonial:', id, body)

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    })

    console.log('✅ Testimonial updated:', testimonial.status)

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial,
    })
  } catch (error) {
    console.error('❌ Update testimonial error:', error.message)
    return NextResponse.json(
      { error: 'Failed to update testimonial', details: error.message },
      { status: 500 }
    )
  }
}

// Also support PATCH
export async function PATCH(request, { params }) {
  return PUT(request, { params })
}

// DELETE testimonial
export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    await prisma.testimonial.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully',
    })
  } catch (error) {
    console.error('Delete testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}