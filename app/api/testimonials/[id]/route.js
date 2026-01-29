// app/api/testimonials/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Update testimonial
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      testimonial,
    })
  } catch (error) {
    console.error('Update testimonial error:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

// Delete testimonial
export async function DELETE(request, { params }) {
  try {
    await prisma.testimonial.delete({
      where: { id: params.id },
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