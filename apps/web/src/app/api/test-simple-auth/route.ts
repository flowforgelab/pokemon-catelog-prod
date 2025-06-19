import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Simple Auth import...')
    
    // Test if we can import and create Better Auth instance
    const { auth } = await import('@/lib/auth-simple')
    console.log('✅ Simple Better Auth imported and created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Simple Better Auth test successful',
      authInstance: !!auth,
      config: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasSecret: !!process.env.BETTER_AUTH_SECRET,
        hasBaseURL: !!process.env.BETTER_AUTH_URL,
        hasGoogleClient: !!process.env.GOOGLE_CLIENT_ID,
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Simple auth test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}