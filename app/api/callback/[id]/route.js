// app/api/callback/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get single callback
export async function GET(request, { params }) {
  try {
    const callback = await prisma.callbackRequest.findUnique({
      where: { id: params.id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!callback) {
      return NextResponse.json(
        { error: 'Callback not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ callback })
  } catch (error) {
    console.error('Get callback error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch callback' },
      { status: 500 }
    )
  }
}

// Update callback
export async function PATCH(request, { params }) {
  try {
    // Handle potentially empty body
    let body = {}
    
    try {
      const text = await request.text()
      if (text && text.trim()) {
        body = JSON.parse(text)
      }
    } catch (parseError) {
      // Body is empty or invalid JSON, use empty object
      console.log('Empty or invalid body, using defaults')
    }

    // Check if callback exists
    const existing = await prisma.callbackRequest.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Callback not found' },
        { status: 404 }
      )
    }

    // Build update data
    const updateData = {}
    
    if (body.status) {
      updateData.status = body.status
      
      // Set calledAt when status changes to called or completed
      if (body.status === 'called' || body.status === 'completed') {
        updateData.calledAt = new Date()
      }
    }
    
    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes
    }

    // Only update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        callback: existing,
        message: 'No changes made',
      })
    }

    const callback = await prisma.callbackRequest.update({
      where: { id: params.id },
      data: updateData,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      callback,
    })
  } catch (error) {
    console.error('Update callback error:', error)
    return NextResponse.json(
      { error: 'Failed to update callback: ' + error.message },
      { status: 500 }
    )
  }
}

// Delete callback
export async function DELETE(request, { params }) {
  try {
    const existing = await prisma.callbackRequest.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Callback not found' },
        { status: 404 }
      )
    }

    await prisma.callbackRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Callback deleted successfully',
    })
  } catch (error) {
    console.error('Delete callback error:', error)
    return NextResponse.json(
      { error: 'Failed to delete callback' },
      { status: 500 }
    )
  }
}