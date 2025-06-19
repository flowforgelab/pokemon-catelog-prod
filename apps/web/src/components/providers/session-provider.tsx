'use client'

interface ProvidersProps {
  children: React.ReactNode
  session?: any // Better Auth doesn't need session prop
}

export function Providers({ children }: ProvidersProps) {
  // Better Auth doesn't require a provider wrapper
  return <>{children}</>
}