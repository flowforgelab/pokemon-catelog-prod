'use client'

import { useEffect, useState } from 'react'

export default function DebugAuthSimple() {
  const [authTest, setAuthTest] = useState<any>(null)
  const [clientTest, setClientTest] = useState<any>(null)

  useEffect(() => {
    // Test server auth endpoint
    fetch('/api/test-better-auth')
      .then(res => res.json())
      .then(data => setAuthTest(data))
      .catch(err => setAuthTest({ error: err.message }))

    // Test client import
    try {
      import('@/lib/auth-client').then(module => {
        setClientTest({
          success: true,
          hasSignIn: !!module.signIn,
          hasUseSession: !!module.useSession,
          hasAuthClient: !!module.authClient
        })
      })
    } catch (error) {
      setClientTest({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Better Auth Debug</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Server Auth Test</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(authTest, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Client Import Test</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(clientTest, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Manual Sign In Test</h2>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={async () => {
              try {
                const { signIn } = await import('@/lib/auth-client')
                console.log('signIn function:', signIn)
                await signIn.social({ provider: 'google' })
              } catch (error) {
                console.error('Sign in error:', error)
                alert(`Error: ${error}`)
              }
            }}
          >
            Test Google Sign In
          </button>
        </div>
      </div>
    </div>
  )
}