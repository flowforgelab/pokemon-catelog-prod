import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

async function handler(req: NextRequest, context: { params: { nextauth: string[] } }) {
  try {
    // Log the incoming request for debugging
    const { params } = context
    const isCallback = params.nextauth?.[0] === 'callback'
    
    if (isCallback) {
      console.log('[NextAuth Debug] Callback received:', {
        url: req.url,
        method: req.method,
        params: params.nextauth,
        searchParams: Object.fromEntries(req.nextUrl.searchParams.entries()),
        headers: {
          'user-agent': req.headers.get('user-agent'),
          'referer': req.headers.get('referer'),
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Call NextAuth with proper App Router signature
    return await NextAuth(req as any, context as any, authOptions)
  } catch (error) {
    console.error('[NextAuth Error]:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      timestamp: new Date().toISOString()
    })
    
    // Return a proper error response
    return NextResponse.redirect(new URL('/api/auth/signin?error=Configuration', req.url))
  }
}

export { handler as GET, handler as POST }