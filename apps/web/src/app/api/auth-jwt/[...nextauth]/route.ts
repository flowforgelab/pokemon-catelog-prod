import NextAuth from 'next-auth'
import { authOptionsJWT } from '@/lib/nextauth.config.jwt'

const handler = NextAuth(authOptionsJWT)

export { handler as GET, handler as POST }