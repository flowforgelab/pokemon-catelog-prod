'use client'

import { useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { GET_ME } from '@/lib/graphql/queries'

export function useCurrentUser() {
  const { data: session, status } = useSession()
  
  const { data, loading, error } = useQuery(GET_ME, {
    skip: !session?.user?.email,
    errorPolicy: 'all'
  })

  return {
    user: data?.me || session?.user,
    loading: status === 'loading' || loading,
    error,
    isAuthenticated: !!session
  }
}