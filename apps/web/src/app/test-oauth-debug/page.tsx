'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestOAuthDebug() {
  const [result, setResult] = useState<any>(null)

  const testGoogleOAuthDebug = () => {
    // Use debug callback URL
    const clientId = '834811537620-g4avg3hc1ggm97pqr6q5r7qjgi8j836b.apps.googleusercontent.com'
    const redirectUri = 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google/debug'
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: 'debug-' + Date.now(),
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    window.location.href = authUrl
  }

  const testNextAuthDirectly = async () => {
    try {
      // Call NextAuth providers endpoint
      const response = await fetch('/api/auth/providers')
      const providers = await response.json()
      setResult({ providers })
    } catch (error) {
      setResult({ error: 'Failed to fetch providers' })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>OAuth Debug Test</CardTitle>
          <CardDescription>
            Test OAuth with debug callback to see exact response
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={testGoogleOAuthDebug} className="w-full">
              Test OAuth with Debug Callback
            </Button>
            <Button onClick={testNextAuthDirectly} variant="outline" className="w-full">
              Check NextAuth Providers
            </Button>
          </div>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          
          <div className="text-sm text-gray-600">
            <p>Debug callback URL (add to Google Console):</p>
            <code className="block bg-gray-100 p-2 rounded text-xs mt-1">
              https://pokemon-catelog-prod.vercel.app/api/auth/callback/google/debug
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}