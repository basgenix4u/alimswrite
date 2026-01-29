// app/api/chat/[sessionId]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get messages for a specific session
export async function GET(request, { params }) {
  try {
    const { sessionId } = await params
    const { searchParams } = new URL(request.url)
    const afterId = searchParams.get('after')
    const afterTimestamp = searchParams.get('afterTimestamp')

    let where = { sessionId }

    // If afterTimestamp provided, get messages after that time
    if (afterTimestamp) {
      where.createdAt = {
        gt: new Date(afterTimestamp),
      }
    } else if (afterId) {
      // Get the timestamp of the last message
      const lastMessage = await prisma.chatMessage.findUnique({
        where: { id: afterId },
        select: { createdAt: true },
      })
      
      if (lastMessage) {
        where.createdAt = {
          gt: lastMessage.createdAt,
        }
      }
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ 
      messages,
      sessionId,
      timestamp: new Date().toISOString(), // Return server timestamp for next poll
    })
  } catch (error) {
    console.error('Get chat messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// Update session
export async function PATCH(request, { params }) {
  try {
    const { sessionId } = await params
    const body = await request.json()

    const session = await prisma.chatSession.update({
      where: { id: sessionId },
      data: body,
    })

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Update chat session error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}