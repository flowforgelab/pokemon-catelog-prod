import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Create a minimal NextAuth instance without database
export async function GET() {
  try {
    // Test if we can create a basic NextAuth instance
    const testAuth = NextAuth({
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
      ],
      secret: process.env.NEXTAUTH_SECRET,
      callbacks: {
        async signIn({ user, account }) {
          console.log('[Test Minimal] SignIn:', { user: user.email, provider: account?.provider })
          return true
        },
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id
          }
          return token
        },
        async session({ session, token }) {
          if (token && session.user) {
            session.user.id = token.id as string
          }
          return session
        }
      },
      session: {
        strategy: 'jwt' // Use JWT instead of database sessions
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'NextAuth instance created successfully',
      providers: ['google'],
      sessionStrategy: 'jwt',
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      secretLength: process.env.NEXTAUTH_SECRET?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}