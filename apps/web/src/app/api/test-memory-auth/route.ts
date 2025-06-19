import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Memory Auth import...')
    
    // Test if we can import and create Better Auth instance without database
    const { auth } = await import('@/lib/auth-memory')
    console.log('✅ Memory Better Auth imported and created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Memory Better Auth test successful - no database required',
      authInstance: !!auth,
      sessionType: 'cookie-based',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Memory auth test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}