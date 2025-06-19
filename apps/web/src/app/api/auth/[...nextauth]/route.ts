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
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        // New login - get JWT from our backend
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://pokemon-catelog-prod-production.up.railway.app/graphql'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `mutation OAuthLogin($email: String!, $name: String) {
                oauthLogin(email: $email, name: $name) {
                  accessToken
                  user { id email name }
                }
              }`,
              variables: {
                email: user.email,
                name: user.name
              }
            })
          })
          
          const data = await response.json()
          if (data.data?.oauthLogin?.accessToken) {
            token.accessToken = data.data.oauthLogin.accessToken
            token.backendUserId = data.data.oauthLogin.user.id
          }
        } catch (error) {
          console.error('Failed to get backend token:', error)
        }
        
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        // @ts-ignore
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})

export { handler as GET, handler as POST }