import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers.entries()),
    searchParams: Object.fromEntries(searchParams.entries()),
    host: request.headers.get('host'),
    userAgent: request.headers.get('user-agent'),
    referer: request.headers.get('referer'),
    
    // OAuth specific parameters
    code: searchParams.get('code'),
    error: searchParams.get('error'),
    error_description: searchParams.get('error_description'),
    state: searchParams.get('state'),
    scope: searchParams.get('scope'),
    
    // Environment check
    environment: {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    }
  }

  console.log('[OAuth Debug] Callback received:', JSON.stringify(debugInfo, null, 2))

  return NextResponse.json(debugInfo)
}

export async function POST(request: NextRequest) {
  return GET(request) // Handle both GET and POST
}