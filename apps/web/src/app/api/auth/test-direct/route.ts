import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth.config'

// Test the auth directly
export async function GET(request: NextRequest) {
  try {
    // Try to get the session
    const session = await getServerSession(authOptions)
    
    // Also check cookies
    const cookies = request.cookies.getAll()
    const sessionCookie = cookies.find(c => c.name.includes('session-token'))
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      sessionCookie: sessionCookie ? { name: sessionCookie.name, exists: true } : null,
      cookies: cookies.map(c => ({ name: c.name, length: c.value.length })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}