import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@pokemon-catalog/database'

// Use singleton pattern to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'database', // Use database sessions for better reliability
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`[NextAuth Debug] SignIn callback:`, {
        userEmail: user.email,
        provider: account?.provider,
        accountType: account?.type
      })
      
      // Always allow sign in for OAuth providers
      return true
    },
    
    async session({ session, user, token }) {
      console.log(`[NextAuth Debug] Session callback:`, {
        sessionUser: session.user?.email,
        dbUser: user?.email,
        hasToken: !!token
      })
      
      // Add user ID to session
      if (user && session.user) {
        session.user.id = user.id
      }
      
      return session
    },
  },
  events: {
    async signIn(message) {
      console.log(`[NextAuth Debug] SignIn event:`, message.user.email)
    },
    async signOut(message) {
      console.log(`[NextAuth Debug] SignOut event:`, message.session)
    },
    async createUser(message) {
      console.log(`[NextAuth Debug] CreateUser event:`, message.user.email)
    },
    async linkAccount(message) {
      console.log(`[NextAuth Debug] LinkAccount event:`, message.user.email)
    },
    async session(message) {
      console.log(`[NextAuth Debug] Session event:`, message.session.user?.email)
    },
  },
})

export { handler as GET, handler as POST }