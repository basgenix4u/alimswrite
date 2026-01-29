// app/api/chat/typing/route.js
import { NextResponse } from 'next/server'

// In-memory store for typing status (in production, use Redis)
const typingStatus = new Map()

// Clean up old typing statuses every 30 seconds
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of typingStatus.entries()) {
    if (now - value.timestamp > 5000) {
      typingStatus.delete(key)
    }
  }
}, 30000)

// GET - Check if someone is typing
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const checkFor = searchParams.get('checkFor') // 'admin' or 'visitor'

    if (!sessionId) {
      return NextResponse.json({ isTyping: false })
    }

    const key = `${sessionId}_${checkFor}`
    const status = typingStatus.get(key)

    // Consider typing if updated within last 3 seconds
    const isTyping = status && (Date.now() - status.timestamp < 3000)

    return NextResponse.json({ 
      isTyping,
      typer: checkFor,
    })
  } catch (error) {
    return NextResponse.json({ isTyping: false })
  }
}

// POST - Set typing status
export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId, sender, isTyping } = body

    if (!sessionId || !sender) {
      return NextResponse.json({ success: false })
    }

    const key = `${sessionId}_${sender}`

    if (isTyping) {
      typingStatus.set(key, {
        timestamp: Date.now(),
        sender,
      })
    } else {
      typingStatus.delete(key)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false })
  }
}
