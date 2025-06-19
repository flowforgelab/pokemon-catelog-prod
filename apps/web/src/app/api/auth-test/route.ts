import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length || 0,
    nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
    hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
    nodeEnv: process.env.NODE_ENV,
  })
}