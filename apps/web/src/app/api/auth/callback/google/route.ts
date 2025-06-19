import { NextRequest, NextResponse } from 'next/server'

// Debug the actual callback to see what Google is sending
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const headers = Object.fromEntries(request.headers.entries())
  
  console.log('[DEBUG] Google OAuth Callback:', {
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
    headers: {
      'user-agent': headers['user-agent'],
      'referer': headers['referer'],
      'x-forwarded-for': headers['x-forwarded-for'],
    },
    timestamp: new Date().toISOString()
  })
  
  // Forward to NextAuth handler
  return NextResponse.redirect(new URL('/api/auth/callback/google', request.url))
}