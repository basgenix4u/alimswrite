// app/api/blog-test/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    console.log('blog-test: Starting query...')
    
    // Simple query without any complex options
    const posts = await prisma.blogPost.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    })
    
    console.log('blog-test: Found posts:', posts.length)
    
    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
      }))
    })
    
  } catch (error) {
    console.error('blog-test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      name: error.name,
      code: error.code,
    }, { status: 500 })
  }
}