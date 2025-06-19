import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Fix for Next.js 15 compatibility
const handler = async (req: any, res: any) => {
  return await NextAuth(req, res, authOptions)
}

export { handler as GET, handler as POST }