import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

async function handler(req: NextRequest) {
  try {
    // Log the incoming request for debugging
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const isCallback = pathSegments[3] === 'callback' // /api/auth/callback/google
    
    if (isCallback) {
      console.log('[NextAuth Debug] Callback received:', {
        url: req.url,
        method: req.method,
        pathname: url.pathname,
        searchParams: Object.fromEntries(url.searchParams.entries()),
        headers: {
          'user-agent': req.headers.get('user-agent'),
          'referer': req.headers.get('referer'),
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Use NextAuth with proper request handling
    return await NextAuth(req, authOptions)
  } catch (error) {
    console.error('[NextAuth Error]:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      timestamp: new Date().toISOString()
    })
    
    throw error // Let NextAuth handle the error
  }
}

export { handler as GET, handler as POST }