import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: {
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasGraphQLUrl: !!process.env.NEXT_PUBLIC_GRAPHQL_URL,
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT SET',
      vercelUrl: process.env.VERCEL_URL || 'NOT SET'
    },
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}