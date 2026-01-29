// app/api/settings/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Default settings
const defaultSettings = {
  id: 'main',
  siteName: 'AlimsWrite',
  tagline: 'Your Academic Writing Partner',
  whatsappNumber: '09039611238',
  email: '',
  phone: '',
  address: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  tiktok: '',
  metaTitle: 'AlimsWrite - Professional Academic Writing Services in Nigeria',
  metaDescription: 'Get quality project writing, thesis, dissertation, data analysis, and research services. Trusted by students across Nigerian universities.',
  metaKeywords: '',
  ogImage: '',
  googleAnalytics: '',
  primaryColor: '#1E3A8A',
  secondaryColor: '#F59E0B',
  accentColor: '#3B82F6',
  chatEnabled: true,
  popupEnabled: true,
  chatTimeout: 60,
}

// Get site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' },
    })

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: defaultSettings,
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Get settings error:', error)
    
    // Return default settings if database error
    return NextResponse.json({ settings: defaultSettings })
  }
}

// Update site settings
export async function PATCH(request) {
  try {
    let body = {}
    
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Check if settings exist
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' },
    })

    if (!settings) {
      // Create with provided data merged with defaults
      settings = await prisma.siteSettings.create({
        data: {
          ...defaultSettings,
          ...body,
        },
      })
    } else {
      // Update existing
      settings = await prisma.siteSettings.update({
        where: { id: 'main' },
        data: body,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings: ' + error.message },
      { status: 500 }
    )
  }
}
