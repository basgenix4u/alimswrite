// app/api/departments/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from 'slugify'

// Helper function to generate unique slug
async function generateUniqueSlug(name) {
  let slug = slugify(name, { lower: true, strict: true })
  
  // Check if slug exists
  const existing = await prisma.department.findUnique({
    where: { slug },
  })
  
  if (existing) {
    // Add random suffix
    const suffix = Math.random().toString(36).substring(2, 6)
    slug = `${slug}-${suffix}`
  }
  
  return slug
}

// Get all departments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const facultyId = searchParams.get('facultyId')
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const where = {}
    
    if (!includeInactive) {
      where.isActive = true
    }
    
    if (facultyId) {
      where.facultyId = facultyId
    }

    const departments = await prisma.department.findMany({
      where,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            topics: true,
          },
        },
      },
      orderBy: [
        { faculty: { name: 'asc' } },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Get departments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

// Create department
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, facultyId, aliases, description, icon } = body

    // Validate required fields
    if (!name || !facultyId) {
      return NextResponse.json(
        { error: 'Name and facultyId are required' },
        { status: 400 }
      )
    }

    // Check if faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    })

    if (!faculty) {
      return NextResponse.json(
        { error: 'Faculty not found' },
        { status: 404 }
      )
    }

    // Check if department with same name exists in same faculty
    const existingDept = await prisma.department.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        facultyId,
      },
    })

    if (existingDept) {
      return NextResponse.json(
        { error: 'A department with this name already exists in this faculty' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name)

    const department = await prisma.department.create({
      data: {
        name,
        slug,
        facultyId,
        aliases: aliases || [],
        description: description || null,
        icon: icon || null,
        isActive: true,
      },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Department created successfully',
      department,
    })
  } catch (error) {
    console.error('Create department error:', error)
    return NextResponse.json(
      { error: 'Failed to create department: ' + error.message },
      { status: 500 }
    )
  }
}

// Delete department
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Department ID is required' },
        { status: 400 }
      )
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id },
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

    // Check if department has topics
    if (department._count.topics > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${department._count.topics} topics are linked to this department` },
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Department deleted successfully',
    })
  } catch (error) {
    console.error('Delete department error:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}
