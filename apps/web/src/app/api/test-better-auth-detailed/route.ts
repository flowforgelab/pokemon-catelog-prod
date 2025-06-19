import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Better Auth detailed import...')
    
    // Test individual imports
    const betterAuthModule = await import('better-auth')
    console.log('✅ Better Auth core imported')
    
    const prismaAdapterModule = await import('better-auth/adapters/prisma')
    console.log('✅ Prisma adapter imported')
    
    const nextCookiesModule = await import('better-auth/next-js')
    console.log('✅ Next.js cookies imported')
    
    // Test Prisma client
    const { PrismaClient } = await import('@pokemon-catalog/database')
    const prisma = new PrismaClient()
    console.log('✅ Prisma client created')
    
    // Test Better Auth instance creation
    const auth = betterAuthModule.betterAuth({
      database: prismaAdapterModule.prismaAdapter(prisma, {
        provider: "postgresql",
      }),
      
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
      },

      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      },

      baseURL: process.env.BETTER_AUTH_URL || "https://pokemon-catelog-prod.vercel.app",
      secret: process.env.BETTER_AUTH_SECRET!,

      plugins: [nextCookiesModule.nextCookies()],
    })
    
    console.log('✅ Better Auth instance created successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Better Auth detailed test successful',
      modules: {
        betterAuth: !!betterAuthModule.betterAuth,
        prismaAdapter: !!prismaAdapterModule.prismaAdapter,
        nextCookies: !!nextCookiesModule.nextCookies,
        prismaClient: !!PrismaClient
      },
      authInstance: !!auth,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Better Auth detailed test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}