// app/api/health/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    status: 'checking',
    checks: {}
  }

  // 1. Database Connection Check
  try {
    await prisma.$queryRaw`SELECT 1`
    results.checks.database = { status: '✅ Connected' }
  } catch (error) {
    results.checks.database = { status: '❌ Failed', error: error.message }
  }

  // 2. Supabase Storage Check
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      const { data, error } = await supabase.storage.listBuckets()
      if (error) throw error
      results.checks.supabaseStorage = { 
        status: '✅ Connected', 
        buckets: data.map(b => b.name)
      }
    } else {
      results.checks.supabaseStorage = { status: '⚠️ Not configured' }
    }
  } catch (error) {
    results.checks.supabaseStorage = { status: '❌ Failed', error: error.message }
  }

  // 3. Environment Variables Check
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const envCheck = {}
  let allEnvSet = true
  requiredEnvVars.forEach(envVar => {
    const isSet = !!process.env[envVar]
    envCheck[envVar] = isSet ? '✅ Set' : '❌ Missing'
    if (!isSet) allEnvSet = false
  })
  results.checks.environmentVariables = envCheck

  // 4. Database Tables Check
  try {
    const [admins, posts, departments] = await Promise.all([
      prisma.admin.count(),
      prisma.blogPost.count(),
      prisma.department.count(),
    ])
    results.checks.databaseTables = {
      status: '✅ OK',
      counts: { admins, posts, departments }
    }
  } catch (error) {
    results.checks.databaseTables = { status: '❌ Failed', error: error.message }
  }

  // Overall Status
  const hasErrors = Object.values(results.checks).some(check => {
    if (typeof check === 'object' && check.status) {
      return check.status.includes('❌')
    }
    return Object.values(check).some(v => v.includes?.('❌'))
  })

  results.status = hasErrors ? '⚠️ Issues Detected' : '✅ All Systems Operational'

  return NextResponse.json(results, { 
    status: hasErrors ? 500 : 200 
  })
}