import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = request.nextUrl
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    fullUrl: request.url,
    pathname: url.pathname,
    searchParams: Object.fromEntries(searchParams.entries()),
    headers: {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
    },
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    expectedCallbackUrl: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    allEnvVars: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT_SET',
    }
  })
}