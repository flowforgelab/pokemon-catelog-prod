import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if we can import Better Auth
    const { auth } = await import('@/lib/auth')
    
    return NextResponse.json({
      success: true,
      message: 'Better Auth import successful',
      hasAuth: !!auth,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}