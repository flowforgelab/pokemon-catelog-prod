'use client'

import { useQuery } from '@apollo/client'
import { useSession } from '@/lib/auth-client'
import { GET_ME } from '@/lib/graphql/queries'

export function useCurrentUser() {
  const { data: session, isPending } = useSession()
  
  const { data, loading, error } = useQuery(GET_ME, {
    skip: !session?.user?.email,
    errorPolicy: 'all'
  })

  return {
    user: data?.me || session?.user,
    loading: isPending || loading,
    error,
    isAuthenticated: !!session
  }
}