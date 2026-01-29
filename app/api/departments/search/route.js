// app/api/departments/search/route.js
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json({ departments: [] })
    }

    // Search departments by name and aliases
    const departments = await prisma.department.findMany({
      where: {
        isActive: true,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            aliases: {
              hasSome: [query.toLowerCase()],
            },
          },
        ],
      },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 10,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Department search error:', error)
    return NextResponse.json(
      { error: 'Failed to search departments' },
      { status: 500 }
    )
  }
}
