'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestJWTAuth() {
  const [result, setResult] = useState<any>(null)

  const testJWTAuth = () => {
    // Use JWT-based auth endpoint
    window.location.href = '/api/auth-jwt/signin?callbackUrl=/'
  }

  const checkJWTSession = async () => {
    try {
      const response = await fetch('/api/auth-jwt/session')
      const session = await response.json()
      setResult({ session, hasSession: !!session?.user })
    } catch (error) {
      setResult({ error: 'Failed to check session' })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test JWT-based Auth</CardTitle>
          <CardDescription>
            Test authentication using JWT sessions instead of database sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={testJWTAuth} className="w-full">
              Sign In with JWT Auth
            </Button>
            <Button onClick={checkJWTSession} variant="outline" className="w-full">
              Check JWT Session
            </Button>
          </div>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          
          <div className="text-sm text-gray-600">
            <p>This uses a separate auth endpoint with JWT sessions to isolate database issues.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}