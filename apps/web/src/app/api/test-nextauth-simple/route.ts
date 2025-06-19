import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if we can import NextAuth and our config
    const { authOptions } = await import('@/lib/auth')
    const NextAuth = await import('next-auth')
    
    return NextResponse.json({
      success: true,
      nextAuthImported: !!NextAuth.default,
      authOptionsValid: !!authOptions,
      providersCount: authOptions.providers?.length || 0,
      hasSecret: !!authOptions.secret,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}