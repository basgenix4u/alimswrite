// app/api/upload/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Allowed MIME types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  voice: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
  file: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
}

// Extension mapping
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'audio/webm': '.weba',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const type = formData.get('type') || 'file'

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: 'No valid file uploaded' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }

    // Validate MIME type
    const allowedMimes = ALLOWED_MIME_TYPES[type] || ALLOWED_MIME_TYPES.file
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed: ${allowedMimes.join(', ')}` },
        { status: 400 }
      )
    }

    // Get safe extension from MIME type
    const safeExtension = MIME_TO_EXT[file.type]
    if (!safeExtension) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // Generate random filename
    const randomName = crypto.randomBytes(16).toString('hex')
    const fileName = `${type}/${randomName}${safeExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName)

    const fileUrl = urlData.publicUrl

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      fileType: type,
      size: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
