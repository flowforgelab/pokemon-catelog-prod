import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/nextauth.config'

export async function GET(request: NextRequest) {
  try {
    // Don't expose secrets, just validate they exist
    const config = {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasGitHubId: !!process.env.GITHUB_ID,
      hasGitHubSecret: !!process.env.GITHUB_SECRET,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      
      // NextAuth config validation
      sessionStrategy: authOptions.session?.strategy,
      sessionMaxAge: authOptions.session?.maxAge,
      hasAdapter: !!authOptions.adapter,
      providersCount: authOptions.providers?.length || 0,
      hasSignInPage: !!authOptions.pages?.signIn,
      hasErrorPage: !!authOptions.pages?.error,
      debugEnabled: authOptions.debug,
      
      // URLs for validation
      expectedCallbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
      currentHost: request.headers.get('host'),
      currentUrl: request.url,
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('NextAuth config check error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}