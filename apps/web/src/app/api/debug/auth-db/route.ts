import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@pokemon-catalog/database'

// Use singleton pattern for Prisma in serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: NextRequest) {
  try {
    // Check if NextAuth tables exist and get counts
    const [userCount, accountCount, sessionCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.account.count().catch(() => 0),
      prisma.session.count().catch(() => 0),
    ])

    // Test table existence by trying to query them
    let userTable = false
    let accountTable = false
    let sessionTable = false
    let verificationTokenTable = false

    try {
      await prisma.user.findFirst()
      userTable = true
    } catch (e) {
      console.error('User table check failed:', e)
    }

    try {
      await prisma.account.findFirst()
      accountTable = true
    } catch (e) {
      console.error('Account table check failed:', e)
    }

    try {
      await prisma.session.findFirst()
      sessionTable = true
    } catch (e) {
      console.error('Session table check failed:', e)
    }

    try {
      await prisma.verificationToken.findFirst()
      verificationTokenTable = true
    } catch (e) {
      console.error('VerificationToken table check failed:', e)
    }

    return NextResponse.json({
      userTable,
      accountTable,
      sessionTable,
      verificationTokenTable,
      userCount,
      accountCount,
      sessionCount,
    })
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown database error',
        userTable: false,
        accountTable: false,
        sessionTable: false,
        verificationTokenTable: false,
        userCount: 0,
        accountCount: 0,
        sessionCount: 0,
      },
      { status: 500 }
    )
  }
}