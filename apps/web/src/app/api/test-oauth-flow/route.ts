import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Import the memory auth configuration that's working
    const { auth } = await import('@/lib/auth-memory')
    
    // Get OAuth URLs from Better Auth
    const baseURL = process.env.BETTER_AUTH_URL || 'https://pokemon-catelog-prod.vercel.app'
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authConfigTest: {
        imported: true,
        baseURL: baseURL,
        googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      },
      oauthFlow: {
        signInUrl: `${baseURL}/api/auth/signin/google`,
        callbackUrl: `${baseURL}/api/auth/callback/google`,
        expectedFlow: [
          '1. User clicks sign in button',
          '2. Redirect to /api/auth/signin/google',
          '3. Better Auth redirects to Google OAuth',
          '4. Google redirects back to /api/auth/callback/google',
          '5. Better Auth processes callback and creates session'
        ]
      },
      troubleshooting: {
        checkGoogleConsole: `Verify redirect URI: ${baseURL}/api/auth/callback/google`,
        currentUrl: request.url,
        userAgent: request.headers.get('user-agent'),
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}