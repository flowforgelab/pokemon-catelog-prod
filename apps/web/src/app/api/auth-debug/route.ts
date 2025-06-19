import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    env: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'Not set',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV,
    },
    expectedRedirectUris: [
      'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google',
    ]
  })
}