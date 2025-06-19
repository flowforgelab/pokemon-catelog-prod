import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  useSecureCookies: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('[NextAuth] SignIn callback:', { user: user.email, provider: account?.provider })
      return true
    },
    async jwt({ token, user, account }) {
      console.log('[NextAuth] JWT callback:', { token: !!token, user: !!user, account: !!account })
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('[NextAuth] Session callback:', { session: !!session, token: !!token })
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  events: {
    async signIn(message) {
      console.log('[NextAuth] SignIn event:', message.user.email)
    },
    async signOut(message) {
      console.log('[NextAuth] SignOut event')
    },
  },
}