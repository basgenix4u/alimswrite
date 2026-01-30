// app/api/debug/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {},
  }

  // Check environment variables (don't expose values, just if they exist)
  debug.checks.envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    DIRECT_URL: !!process.env.DIRECT_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Missing',
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    debug.checks.database = '✅ Connected'
    
    // Check tables
    const counts = await Promise.all([
      prisma.admin.count(),
      prisma.siteSettings.count(),
      prisma.testimonial.count(),
      prisma.blogPost.count(),
    ])
    debug.checks.tables = {
      admins: counts[0],
      settings: counts[1],
      testimonials: counts[2],
      blogPosts: counts[3],
    }
  } catch (error) {
    debug.checks.database = `❌ Error: ${error.message}`
  }

  // Check Supabase
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data, error } = await supabase.storage.listBuckets()
      if (error) throw error
      debug.checks.supabase = {
        status: '✅ Connected',
        buckets: data.map(b => ({ name: b.name, public: b.public })),
      }
    } else {
      debug.checks.supabase = '❌ Not configured'
    }
  } catch (error) {
    debug.checks.supabase = `❌ Error: ${error.message}`
  }

  return NextResponse.json(debug)
}