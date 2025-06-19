import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

// JWT-based auth config for testing
export const authOptionsJWT: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT instead of database
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth JWT] SignIn callback:', {
        userEmail: user.email,
        provider: account?.provider,
        profileId: profile?.sub,
      })
      return true
    },
    async jwt({ token, user, account, profile }) {
      console.log('[NextAuth JWT] JWT callback:', {
        tokenSub: token.sub,
        userEmail: user?.email,
        provider: account?.provider,
      })
      
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      
      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth JWT] Session callback:', {
        sessionUser: session.user?.email,
        tokenEmail: token.email,
      })
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      
      return session
    },
  },
  logger: {
    error(code, metadata) {
      console.error('[NextAuth JWT Error]', code, JSON.stringify(metadata, null, 2))
    },
    warn(code) {
      console.warn('[NextAuth JWT Warning]', code)
    },
    debug(code, metadata) {
      console.log('[NextAuth JWT Debug]', code, metadata)
    }
  },
}