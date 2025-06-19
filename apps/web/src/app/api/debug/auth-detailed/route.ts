import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@pokemon-catalog/database'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Test database connection and table structure
    const tests = {
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: null as string | null,
      },
      tables: {
        user: { exists: false, count: 0, canCreate: false },
        account: { exists: false, count: 0, canCreate: false },
        session: { exists: false, count: 0, canCreate: false },
        verificationToken: { exists: false, count: 0, canCreate: false },
      },
      testUser: null as any,
      environment: {
        databaseUrl: !!process.env.DATABASE_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        googleClientId: !!process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      }
    }

    // Test database connection
    try {
      await prisma.$connect()
      tests.database.connected = true
    } catch (error) {
      tests.database.error = error instanceof Error ? error.message : 'Unknown connection error'
    }

    // Test User table
    try {
      const userCount = await prisma.user.count()
      tests.tables.user.exists = true
      tests.tables.user.count = userCount
      
      // Try to create a test user
      try {
        const testUser = await prisma.user.create({
          data: {
            email: `test-${Date.now()}@example.com`,
            name: 'Test User',
          }
        })
        tests.tables.user.canCreate = true
        tests.testUser = testUser
        
        // Clean up
        await prisma.user.delete({ where: { id: testUser.id } })
      } catch (e) {
        console.error('User creation test failed:', e)
      }
    } catch (error) {
      console.error('User table test failed:', error)
    }

    // Test Account table
    try {
      const accountCount = await prisma.account.count()
      tests.tables.account.exists = true
      tests.tables.account.count = accountCount
    } catch (error) {
      console.error('Account table test failed:', error)
    }

    // Test Session table
    try {
      const sessionCount = await prisma.session.count()
      tests.tables.session.exists = true
      tests.tables.session.count = sessionCount
    } catch (error) {
      console.error('Session table test failed:', error)
    }

    // Disconnect
    await prisma.$disconnect()

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Debug test error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}