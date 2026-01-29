// app/api/contact/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'

export async function POST(request) {
  try {
    // Rate limiting
    const limiter = await rateLimit(request, 'api')
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      name,
      email,
      phone,
      inquiryType,
      subject,
      message,
    } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const cleanName = sanitizeText(name)
    const cleanEmail = sanitizeText(email.toLowerCase().trim())
    const cleanSubject = sanitizeText(subject)
    const cleanMessage = sanitizeText(message)
    const cleanPhone = phone ? sanitizeText(phone) : ''
    const cleanInquiryType = inquiryType ? sanitizeText(inquiryType) : 'General'

    // Store as callback request
    const contact = await prisma.callbackRequest.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        description: `[${cleanInquiryType}] ${cleanSubject}\n\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
        source: 'contact',
        status: 'pending',
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'contact',
        title: 'New Contact Form Submission',
        message: `${cleanName} sent a message: ${cleanSubject}`,
        link: '/admin/callbacks',
      },
    }).catch(() => {}) // Don't fail if notification fails

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}