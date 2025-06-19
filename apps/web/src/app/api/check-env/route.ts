import { NextResponse } from 'next/server'

export async function GET() {
  // Check critical environment variables
  const envStatus = {
    NEXTAUTH_URL: {
      isSet: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL || 'NOT SET',
      expected: 'https://pokemon-catelog-prod.vercel.app'
    },
    NEXTAUTH_SECRET: {
      isSet: !!process.env.NEXTAUTH_SECRET,
      value: process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT SET'
    },
    DATABASE_URL: {
      isSet: !!process.env.DATABASE_URL,
      value: process.env.DATABASE_URL ? '***SET***' : 'NOT SET'
    },
    GOOGLE_CLIENT_ID: {
      isSet: !!process.env.GOOGLE_CLIENT_ID,
      value: process.env.GOOGLE_CLIENT_ID ? '***SET***' : 'NOT SET'
    },
    NEXT_PUBLIC_GRAPHQL_URL: {
      isSet: !!process.env.NEXT_PUBLIC_GRAPHQL_URL,
      value: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'NOT SET'
    },
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  }

  // Check if all critical vars are set
  const allSet = envStatus.NEXTAUTH_URL.isSet && 
                 envStatus.NEXTAUTH_SECRET.isSet && 
                 envStatus.DATABASE_URL.isSet &&
                 envStatus.GOOGLE_CLIENT_ID.isSet

  return NextResponse.json({
    status: allSet ? 'ready' : 'missing_env_vars',
    environment: envStatus,
    recommendation: !envStatus.NEXTAUTH_URL.isSet ? 
      'Add NEXTAUTH_URL=https://pokemon-catelog-prod.vercel.app to Vercel environment variables' : 
      'All critical environment variables appear to be set'
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store'
    }
  })
}