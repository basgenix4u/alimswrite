// app/api/faculties/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get all faculties
export async function GET(request) {
  try {
    const faculties = await prisma.faculty.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
        departments: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                topics: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ faculties })
  } catch (error) {
    console.error('Get faculties error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch faculties' },
      { status: 500 }
    )
  }
}

// Create faculty (admin)
export async function POST(request) {
  try {
    const body = await request.json()

    const { name, slug, icon, description, order } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    const faculty = await prisma.faculty.create({
      data: {
        name,
        slug,
        icon: icon || null,
        description: description || null,
        order: order || 0,
      },
    })

    return NextResponse.json({
      success: true,
      faculty,
    })
  } catch (error) {
    console.error('Create faculty error:', error)
    return NextResponse.json(
      { error: 'Failed to create faculty' },
      { status: 500 }
    )
  }
}