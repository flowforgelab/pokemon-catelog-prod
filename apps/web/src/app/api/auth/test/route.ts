import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Auth route is working',
    url: request.url,
    timestamp: new Date().toISOString()
  })
}