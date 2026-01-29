// app/api/chat/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get chat sessions (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    const where = {}
    if (status !== 'all') {
      where.status = status
    }

    const sessions = await prisma.chatSession.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 100,
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Get chat sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    )
  }
}

// Create or update chat session / send message
export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      sessionId, 
      visitorId, 
      message, 
      sender, 
      visitorName, 
      visitorEmail, 
      visitorPhone,
      messageType,
      fileUrl,
      fileName,
      fileDuration,
      tempId, // Add tempId to track client-side messages
    } = body

    let session
    let createdMessage = null

    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      })

      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }
    } else {
      session = await prisma.chatSession.create({
        data: {
          visitorId: visitorId || `visitor_${Date.now()}`,
          visitorName: visitorName || null,
          visitorEmail: visitorEmail || null,
          visitorPhone: visitorPhone || null,
          status: 'active',
        },
      })

      await prisma.notification.create({
        data: {
          type: 'chat',
          title: 'New Chat Started',
          message: visitorName ? `${visitorName} started a chat` : 'New visitor started a chat',
          link: '/admin/chat',
        },
      }).catch(() => {}) // Don't fail if notification fails
    }

    // Add message if provided
    if (message || fileUrl) {
      createdMessage = await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          sender: sender || 'visitor',
          message: message || '',
          messageType: messageType || 'text',
          fileUrl: fileUrl || null,
          fileName: fileName || null,
          fileDuration: fileDuration || null,
        },
      })

      // Update session timestamp
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() },
      })

      // Create notification for admin when visitor sends message
      if (sender === 'visitor') {
        await prisma.notification.create({
          data: {
            type: 'chat',
            title: 'New Chat Message',
            message: message ? message.substring(0, 100) : 'New file received',
            link: '/admin/chat',
          },
        }).catch(() => {})
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        visitorId: session.visitorId,
        status: session.status,
      },
      message: createdMessage, // Return the created message with its ID
      tempId, // Return tempId for client-side matching
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat: ' + error.message },
      { status: 500 }
    )
  }
}
