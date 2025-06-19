import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Drizzle Auth import...')
    
    // Test Drizzle database connection
    const { db } = await import('@/lib/drizzle')
    console.log('✅ Drizzle database imported')
    
    // Test basic query
    const result = await db.execute('SELECT 1 as test')
    console.log('✅ Drizzle database connection successful')
    
    // Test Better Auth with Drizzle
    const { auth } = await import('@/lib/auth-drizzle')
    console.log('✅ Better Auth with Drizzle created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Drizzle Better Auth test successful',
      dbConnection: !!result,
      authInstance: !!auth,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Drizzle test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}