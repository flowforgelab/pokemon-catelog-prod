import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptionsJWT } from '@/lib/nextauth.config.jwt'

// Create handler with proper types for Next.js 15
async function auth(req: NextRequest, context: { params: { nextauth: string[] } }) {
  return NextAuth(req as any, context as any, authOptionsJWT)
}

export { auth as GET, auth as POST }