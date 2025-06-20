import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const searchParams = Object.fromEntries(url.searchParams)
  
  // Log what Google is sending back
  const callbackData: any = {
    timestamp: new Date().toISOString(),
    fullUrl: request.url,
    searchParams,
    headers: {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    },
    analysis: {
      hasCode: !!searchParams.code,
      hasError: !!searchParams.error,
      hasState: !!searchParams.state,
      codeLength: searchParams.code?.length || 0,
      errorDetails: searchParams.error ? {
        error: searchParams.error,
        errorDescription: searchParams.error_description,
        errorUri: searchParams.error_uri
      } : null
    }
  }

  // If there's an authorization code, test if we can exchange it
  if (searchParams.code) {
    try {
      // Test the Better Auth callback processing
      const { auth } = await import('@/lib/auth-memory')
      
      callbackData.betterAuthTest = {
        authImported: true,
        codeReceived: true,
        note: 'Authorization code received from Google'
      }
    } catch (error) {
      callbackData.betterAuthTest = {
        authImported: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return NextResponse.json(callbackData, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}