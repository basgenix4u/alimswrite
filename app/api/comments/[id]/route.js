// app/api/comments/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Update comment (approve, reject, reply)
export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const { status, adminReply } = body

    const updateData = {}
    
    if (status) {
      updateData.status = status
    }
    
    if (adminReply) {
      updateData.adminReply = adminReply
      updateData.repliedAt = new Date()
    }

    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('Update comment error:', error)
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    )
  }
}

// Delete comment
export async function DELETE(request, { params }) {
  try {
    await prisma.comment.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}