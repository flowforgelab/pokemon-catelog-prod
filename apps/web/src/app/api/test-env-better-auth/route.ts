import { NextResponse } from 'next/server'
import { PrismaClient } from '@pokemon-catalog/database'

export async function GET() {
  try {
    const envCheck = {
      timestamp: new Date().toISOString(),
      environment: {
        BETTER_AUTH_SECRET: {
          exists: !!process.env.BETTER_AUTH_SECRET,
          length: process.env.BETTER_AUTH_SECRET?.length || 0,
          isValid: (process.env.BETTER_AUTH_SECRET?.length || 0) >= 32
        },
        BETTER_AUTH_URL: {
          exists: !!process.env.BETTER_AUTH_URL,
          value: process.env.BETTER_AUTH_URL || 'NOT_SET',
          isProduction: process.env.BETTER_AUTH_URL?.includes('pokemon-catelog-prod.vercel.app')
        },
        DATABASE_URL: {
          exists: !!process.env.DATABASE_URL,
          isSupabase: process.env.DATABASE_URL?.includes('supabase.com'),
          hasPooler: process.env.DATABASE_URL?.includes('pooler')
        },
        DIRECT_URL: {
          exists: !!process.env.DIRECT_URL,
          isSupabase: process.env.DIRECT_URL?.includes('supabase.com')
        },
        GOOGLE_CLIENT_ID: {
          exists: !!process.env.GOOGLE_CLIENT_ID,
          length: process.env.GOOGLE_CLIENT_ID?.length || 0
        },
        GOOGLE_CLIENT_SECRET: {
          exists: !!process.env.GOOGLE_CLIENT_SECRET,
          length: process.env.GOOGLE_CLIENT_SECRET?.length || 0
        }
      }
    }

    // Test Prisma connection
    let prismaTest = null
    try {
      const prisma = new PrismaClient()
      await prisma.$connect()
      
      // Test if we can query the User table
      const userCount = await prisma.user.count()
      
      // Test if Account and Session tables have the new fields
      const accountFields = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Account' 
        AND column_name IN ('createdAt', 'updatedAt')
      `
      
      const sessionFields = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'Session' 
        AND column_name IN ('createdAt', 'updatedAt')
      `

      await prisma.$disconnect()
      
      prismaTest = {
        success: true,
        userCount,
        accountFields,
        sessionFields,
        migrationApplied: Array.isArray(accountFields) && accountFields.length === 2
      }
    } catch (error) {
      prismaTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      }
    }

    return NextResponse.json({
      success: true,
      ...envCheck,
      database: prismaTest
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}