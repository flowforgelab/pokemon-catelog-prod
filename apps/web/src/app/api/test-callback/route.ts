import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  return NextResponse.json({
    url: request.url,
    params: Object.fromEntries(searchParams.entries()),
    headers: {
      'user-agent': request.headers.get('user-agent'),
      'referer': request.headers.get('referer'),
    },
    timestamp: new Date().toISOString()
  })
}