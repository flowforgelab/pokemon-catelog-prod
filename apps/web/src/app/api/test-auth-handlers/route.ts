import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    test: 'Auth handlers initialization test'
  }

  // Test if we can create Better Auth handlers
  try {
    const { auth } = await import('@/lib/auth-memory')
    const { toNextJsHandler } = await import('better-auth/next-js')
    
    const handlers = toNextJsHandler(auth)
    
    results.handlersTest = {
      authImported: true,
      handlersCreated: !!handlers,
      hasGET: typeof handlers.GET === 'function',
      hasPOST: typeof handlers.POST === 'function',
      authConfig: {
        baseURL: (auth as any).options?.baseURL,
        hasGoogleProvider: !!(auth as any).options?.socialProviders?.google,
        googleClientId: (auth as any).options?.socialProviders?.google?.clientId?.substring(0, 20) + '...',
      }
    }

    // Test the sign-in URL generation
    try {
      results.urlTest = {
        expectedSignInUrl: `${(auth as any).options?.baseURL}/api/auth/signin/google`,
        expectedCallbackUrl: `${(auth as any).options?.baseURL}/api/auth/callback/google`,
      }
    } catch (urlError) {
      results.urlTest = {
        error: urlError instanceof Error ? urlError.message : 'URL generation failed'
      }
    }

  } catch (error) {
    results.handlersTest = {
      authImported: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }
  }

  // Test environment variables
  results.envTest = {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '[NOT SET]',
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? '[SET]' : '[NOT SET]',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '[SET]' : '[NOT SET]',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '[SET]' : '[NOT SET]',
    NODE_ENV: process.env.NODE_ENV
  }

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}