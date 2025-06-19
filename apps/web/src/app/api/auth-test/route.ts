import { NextResponse } from 'next/server'

export async function GET() {
  // Check all possible env var names
  const config = {
    // NextAuth v5 uses AUTH_ prefix
    AUTH_SECRET: process.env.AUTH_SECRET ? 'Set' : 'Not set',
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? 'Set' : 'Not set', 
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? 'Set' : 'Not set',
    
    // Old v4 names
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    
    // URLs
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
    AUTH_URL: process.env.AUTH_URL || 'Not set',
    
    // Other
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL || 'Not set',
  }
  
  return NextResponse.json(config)
}