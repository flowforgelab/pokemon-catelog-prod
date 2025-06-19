'use client'

import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return
    if (!session) {
      router.push('/')
    }
  }, [session, isPending, router])

  if (isPending) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}