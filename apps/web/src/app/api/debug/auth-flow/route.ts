import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: session ? {
        user: session.user,
        expires: session.expires,
        hasAccessToken: !!(session as any).accessToken
      } : null,
      environment: {
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasGraphQLUrl: !!process.env.NEXT_PUBLIC_GRAPHQL_URL,
        graphQLUrl: process.env.NEXT_PUBLIC_GRAPHQL_URL,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      },
      possibleIssues: []
    }

    // Analyze potential issues
    if (!process.env.NEXTAUTH_URL) {
      debugInfo.possibleIssues.push('NEXTAUTH_URL is not set')
    }
    
    if (!process.env.NEXTAUTH_SECRET) {
      debugInfo.possibleIssues.push('NEXTAUTH_SECRET is not set')
    }
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      debugInfo.possibleIssues.push('Google OAuth credentials missing')
    }
    
    if (!process.env.NEXT_PUBLIC_GRAPHQL_URL) {
      debugInfo.possibleIssues.push('GraphQL URL not configured')
    }

    return NextResponse.json(debugInfo, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to debug auth flow',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store'
      }
    })
  }
}