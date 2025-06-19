'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestOAuth() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSignIn = async () => {
    setLoading(true)
    try {
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: false 
      })
      setResult(result)
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
    setLoading(false)
  }

  const checkSession = async () => {
    const session = await getSession()
    setResult({ session })
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>OAuth Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testSignIn} disabled={loading}>
            {loading ? 'Testing...' : 'Test Sign In (No Redirect)'}
          </Button>
          <Button onClick={checkSession} variant="outline">
            Check Session
          </Button>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Expected callback URL:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs mt-1">
              https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}