import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    url: request.url,
    environment: process.env.NODE_ENV,
  }

  // Test Environment Variables
  results.envVars = {
    BETTER_AUTH_URL: {
      exists: !!process.env.BETTER_AUTH_URL,
      value: process.env.BETTER_AUTH_URL || '[NOT SET]'
    },
    BETTER_AUTH_SECRET: {
      exists: !!process.env.BETTER_AUTH_SECRET,
      length: process.env.BETTER_AUTH_SECRET?.length || 0
    },
    GOOGLE_CLIENT_ID: {
      exists: !!process.env.GOOGLE_CLIENT_ID,
      length: process.env.GOOGLE_CLIENT_ID?.length || 0,
      prefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) || '[NOT SET]'
    },
    GOOGLE_CLIENT_SECRET: {
      exists: !!process.env.GOOGLE_CLIENT_SECRET,
      length: process.env.GOOGLE_CLIENT_SECRET?.length || 0
    }
  }

  // Test Better Auth Import
  try {
    const { auth: memoryAuth } = await import('@/lib/auth-memory')
    results.memoryAuth = {
      imported: true,
      baseURL: (memoryAuth as any).options?.baseURL || '[NOT SET]',
      hasGoogleProvider: !!(memoryAuth as any).options?.socialProviders?.google
    }
  } catch (error) {
    results.memoryAuth = {
      imported: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  try {
    const { auth: mainAuth } = await import('@/lib/auth')
    results.mainAuth = {
      imported: true,
      baseURL: (mainAuth as any).options?.baseURL || '[NOT SET]',
      hasGoogleProvider: !!(mainAuth as any).options?.socialProviders?.google,
      hasDatabase: !!(mainAuth as any).options?.database
    }
  } catch (error) {
    results.mainAuth = {
      imported: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Test OAuth URLs
  const baseURL = process.env.BETTER_AUTH_URL || 'https://pokemon-catelog-prod.vercel.app'
  results.oauthUrls = {
    expectedCallback: `${baseURL}/api/auth/callback/google`,
    signInUrl: `${baseURL}/api/auth/signin/google`,
    baseURL: baseURL
  }

  // Test Current Handler Configuration
  try {
    // Check which auth config the handler is using
    const handlerPath = '/src/app/api/auth/[...all]/route.ts'
    results.handlerConfig = {
      path: handlerPath,
      note: 'Check logs for which auth config is being imported'
    }
  } catch (error) {
    results.handlerConfig = {
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return NextResponse.json(results, { 
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}