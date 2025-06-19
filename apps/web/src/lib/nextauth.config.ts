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
  debug: true, // Re-enable debug to capture callback errors
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`[NextAuth Debug] SignIn callback:`, {
        userEmail: user.email,
        userName: user.name,
        userImage: user.image,
        provider: account?.provider,
        accountType: account?.type,
        accountProviderAccountId: account?.providerAccountId,
        profileId: profile?.sub || (profile as any)?.id,
        emailFromParam: email,
        timestamp: new Date().toISOString(),
      })
      
      try {
        // Always allow OAuth sign in for now
        console.log(`[NextAuth Debug] SignIn callback returning true`)
        return true
      } catch (error) {
        console.error(`[NextAuth Debug] SignIn callback error:`, error)
        return false
      }
    },
    
    async session({ session, user, token }) {
      console.log(`[NextAuth Debug] Session callback:`, {
        sessionUserEmail: session.user?.email,
        userIdFromDb: user?.id,
        tokenSub: token?.sub,
        timestamp: new Date().toISOString(),
      })
      
      // Add user ID to session
      if (user && session.user) {
        session.user.id = user.id
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      console.log(`[NextAuth Debug] Redirect callback:`, {
        url,
        baseUrl,
        timestamp: new Date().toISOString(),
      })
      
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      return baseUrl
    },
  },
  events: {
    async signIn(message) {
      console.log(`[NextAuth Debug] SignIn event:`, {
        email: message.user.email,
        id: message.user.id,
        isNewUser: message.isNewUser,
      })
    },
    async signOut(message) {
      console.log(`[NextAuth Debug] SignOut event:`, message.session)
    },
    async createUser(message) {
      console.log(`[NextAuth Debug] CreateUser event:`, {
        email: message.user.email,
        id: message.user.id,
      })
    },
    async linkAccount(message) {
      console.log(`[NextAuth Debug] LinkAccount event:`, {
        email: message.user.email,
        provider: message.account.provider,
        providerAccountId: message.account.providerAccountId,
      })
    },
    async session(message) {
      console.log(`[NextAuth Debug] Session event:`, message.session.user?.email)
    },
  },
}