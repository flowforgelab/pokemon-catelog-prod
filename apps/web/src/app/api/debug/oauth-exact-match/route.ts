import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Test exact URL construction that NextAuth uses
  const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin
  const constructedCallback = `${baseUrl}/api/auth/callback/google`
  
  // Check for common issues
  const analysis = {
    timestamp: new Date().toISOString(),
    urlAnalysis: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      requestOrigin: request.nextUrl.origin,
      constructedCallback,
      
      // Check for common issues
      hasTrailingSlash: baseUrl.endsWith('/'),
      hasWww: baseUrl.includes('www.'),
      protocol: baseUrl.startsWith('https://') ? 'https' : 'http',
      
      // Character analysis
      callbackLength: constructedCallback.length,
      hasSpecialChars: /[^\w\-\.\/\:]/g.test(constructedCallback),
      
      // Compare with expected
      expected: 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google',
      exactMatch: constructedCallback === 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google'
    },
    
    headers: {
      host: request.headers.get('host'),
      'x-forwarded-host': request.headers.get('x-forwarded-host'),
      'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      'x-vercel-deployment-url': request.headers.get('x-vercel-deployment-url'),
    },
    
    // Test different variations that might be getting constructed
    variations: [
      `${baseUrl}/api/auth/callback/google`,
      `${request.nextUrl.origin}/api/auth/callback/google`,
      `https://${request.headers.get('host')}/api/auth/callback/google`,
      `https://pokemon-catelog-prod.vercel.app/api/auth/callback/google`,
    ]
  }
  
  console.log('[QA DEBUG] OAuth URL Analysis:', JSON.stringify(analysis, null, 2))
  
  return NextResponse.json(analysis)
}