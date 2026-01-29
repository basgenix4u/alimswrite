// app/api/departments/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'

// Get single department
export async function GET(request, { params }) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        faculty: true,
        _count: {
          select: { topics: true },
        },
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ department })
  } catch (error) {
    console.error('Get department error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch department' },
      { status: 500 }
    )
  }
}

// Update department
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    const existing = await prisma.department.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    // If name changed, update slug
    let updateData = { ...body }
    if (body.name && body.name !== existing.name) {
      let newSlug = slugify(body.name, { lower: true, strict: true })
      
      // Check if new slug exists (excluding current)
      const slugExists = await prisma.department.findFirst({
        where: {
          slug: newSlug,
          id: { not: params.id },
        },
      })
      
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`
      }
      
      updateData.slug = newSlug
    }

    const department = await prisma.department.update({
      where: { id: params.id },
      data: updateData,
      include: {
        faculty: {
          select: { id: true, name: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      department,
    })
  } catch (error) {
    console.error('Update department error:', error)
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    )
  }
}

// Delete department
export async function DELETE(request, { params }) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { topics: true },
        },
      },
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    if (department._count.topics > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${department._count.topics} topics exist` },
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Department deleted',
    })
  } catch (error) {
    console.error('Delete department error:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}
