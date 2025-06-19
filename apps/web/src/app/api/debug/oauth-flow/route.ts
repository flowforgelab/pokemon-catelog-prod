import { NextRequest, NextResponse } from 'next/server'

// Comprehensive OAuth flow debugger
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? `Set (${process.env.NEXTAUTH_SECRET.length} chars)` : 'Not set',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'Not set',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      VERCEL_URL: process.env.VERCEL_URL || 'Not set',
    },
    request: {
      url: request.url,
      method: request.method,
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'referer': request.headers.get('referer'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'host': request.headers.get('host'),
      },
      searchParams: Object.fromEntries(searchParams.entries()),
    },
    expectedUrls: {
      authUrl: `${process.env.NEXTAUTH_URL || 'https://pokemon-catelog-prod.vercel.app'}/api/auth`,
      callbackUrl: `${process.env.NEXTAUTH_URL || 'https://pokemon-catelog-prod.vercel.app'}/api/auth/callback/google`,
      signInUrl: `${process.env.NEXTAUTH_URL || 'https://pokemon-catelog-prod.vercel.app'}/api/auth/signin`,
    },
    oauth: {
      hasCode: !!searchParams.get('code'),
      hasError: !!searchParams.get('error'),
      hasState: !!searchParams.get('state'),
      code: searchParams.get('code')?.substring(0, 20) + '...' || 'None',
      error: searchParams.get('error') || 'None',
      state: searchParams.get('state') || 'None',
    }
  }
  
  console.log('[QA DEBUG] Complete OAuth Flow Debug:', JSON.stringify(debugInfo, null, 2))
  
  return NextResponse.json(debugInfo)
}