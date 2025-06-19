import { NextRequest, NextResponse } from 'next/server'

// Debug endpoint to capture what Google is sending back
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Capture all parameters
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  // Log headers
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    if (key.toLowerCase().includes('cookie') || key.toLowerCase().includes('auth')) {
      headers[key] = value.length > 50 ? value.substring(0, 50) + '...' : value
    } else {
      headers[key] = value
    }
  })
  
  return NextResponse.json({
    message: 'OAuth callback debug',
    params,
    hasCode: !!params.code,
    hasError: !!params.error,
    hasState: !!params.state,
    headers: {
      referer: headers.referer,
      'user-agent': headers['user-agent'],
      origin: headers.origin,
    },
    timestamp: new Date().toISOString()
  })
}