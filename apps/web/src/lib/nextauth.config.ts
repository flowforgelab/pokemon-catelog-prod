import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@pokemon-catalog/database'
import type { NextAuthOptions } from 'next-auth'

// Use singleton pattern to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const authOptions: NextAuthOptions = {
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
    strategy: 'database' as const, // Use database sessions for better reliability
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log(`[NextAuth Debug] SignIn callback:`, {
        userEmail: user.email,
        provider: account?.provider,
      })
      
      // Always allow OAuth sign in for now
      return true
    },
    
    async session({ session, user }) {
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
}