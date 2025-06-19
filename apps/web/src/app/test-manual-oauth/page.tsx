'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestManualOAuth() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testGoogleOAuth = () => {
    // Use the actual credentials from the env
    const clientId = '834811537620-g4avg3hc1ggm97pqr6q5r7qjgi8j836b.apps.googleusercontent.com'
    const redirectUri = 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google'
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    setResult({
      message: 'Redirecting to Google OAuth...',
      authUrl,
      expectedCallback: redirectUri
    })
    
    // Redirect after showing the info
    setTimeout(() => {
      window.location.href = authUrl
    }, 2000)
  }

  const checkSession = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/test-direct')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to check session' })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Manual OAuth Test</CardTitle>
          <CardDescription>
            Test Google OAuth flow manually to diagnose issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={testGoogleOAuth} className="w-full">
              Test Google OAuth Manually
            </Button>
            <Button onClick={checkSession} variant="outline" className="w-full" disabled={loading}>
              {loading ? 'Checking...' : 'Check Current Session'}
            </Button>
          </div>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>Expected callback URL:</p>
            <code className="block bg-gray-100 p-2 rounded text-xs">
              https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}