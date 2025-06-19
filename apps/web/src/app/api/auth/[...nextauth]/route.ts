import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/nextauth.config'

// Create handler with proper types for Next.js 15
async function auth(req: NextRequest, context: { params: { nextauth: string[] } }) {
  return NextAuth(req as any, context as any, authOptions)
}

export { auth as GET, auth as POST }