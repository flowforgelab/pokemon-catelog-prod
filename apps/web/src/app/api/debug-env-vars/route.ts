import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      BETTER_AUTH_SECRET: {
        exists: !!process.env.BETTER_AUTH_SECRET,
        length: process.env.BETTER_AUTH_SECRET?.length || 0,
        value: process.env.BETTER_AUTH_SECRET ? '[SET]' : '[NOT SET]'
      },
      BETTER_AUTH_URL: {
        exists: !!process.env.BETTER_AUTH_URL,
        value: process.env.BETTER_AUTH_URL || '[NOT SET]'
      },
      DATABASE_URL: {
        exists: !!process.env.DATABASE_URL,
        prefix: process.env.DATABASE_URL?.substring(0, 20) || '[NOT SET]'
      },
      GOOGLE_CLIENT_ID: {
        exists: !!process.env.GOOGLE_CLIENT_ID,
        length: process.env.GOOGLE_CLIENT_ID?.length || 0
      },
      GOOGLE_CLIENT_SECRET: {
        exists: !!process.env.GOOGLE_CLIENT_SECRET,
        length: process.env.GOOGLE_CLIENT_SECRET?.length || 0
      },
      // Legacy vars (might still be set)
      NEXTAUTH_SECRET: {
        exists: !!process.env.NEXTAUTH_SECRET,
        length: process.env.NEXTAUTH_SECRET?.length || 0
      },
      NEXTAUTH_URL: {
        exists: !!process.env.NEXTAUTH_URL,
        value: process.env.NEXTAUTH_URL || '[NOT SET]'
      }
    }
  })
}