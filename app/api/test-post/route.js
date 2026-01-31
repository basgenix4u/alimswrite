// app/api/test-post/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'GET works', method: 'GET' })
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ message: 'POST works', method: 'POST', received: body })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 })
}