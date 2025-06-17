import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }
  
  return session
}

export async function getOptionalAuth() {
  return await getServerSession()
}