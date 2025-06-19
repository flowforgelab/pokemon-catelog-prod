import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

// Test NextAuth configuration directly
export async function GET(request: NextRequest) {
  try {
    // Test the auth configuration
    const testData = {
      timestamp: new Date().toISOString(),
      authConfig: {
        hasProviders: authOptions.providers?.length > 0,
        providerCount: authOptions.providers?.length || 0,
        providerTypes: authOptions.providers?.map(p => p.type) || [],
        sessionStrategy: authOptions.session?.strategy || 'default',
        hasSecret: !!authOptions.secret,
        secretLength: authOptions.secret?.length || 0,
        hasCallbacks: !!authOptions.callbacks,
        callbackKeys: Object.keys(authOptions.callbacks || {}),
        debug: authOptions.debug || false,
      },
      googleProvider: {
        clientId: process.env.GOOGLE_CLIENT_ID ? 
          `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'Not set',
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      },
      urls: {
        expected: {
          authorization: `https://accounts.google.com/o/oauth2/v2/auth`,
          callback: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
          token: `https://oauth2.googleapis.com/token`,
        }
      }
    }
    
    console.log('[QA DEBUG] NextAuth Config Test:', JSON.stringify(testData, null, 2))
    
    return NextResponse.json(testData)
  } catch (error) {
    const errorData = {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }
    
    console.error('[QA DEBUG] NextAuth Config Error:', errorData)
    
    return NextResponse.json(errorData, { status: 500 })
  }
}