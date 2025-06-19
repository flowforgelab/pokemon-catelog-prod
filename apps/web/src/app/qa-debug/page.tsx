'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function QADebugPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const runTest = async (testName: string, url: string) => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    try {
      const response = await fetch(url)
      const data = await response.json()
      setResults(prev => ({ ...prev, [testName]: data }))
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }
    setLoading(prev => ({ ...prev, [testName]: false }))
  }

  const testNextAuthDirectly = async () => {
    setLoading(prev => ({ ...prev, 'nextauth-direct': true }))
    try {
      // Test the NextAuth endpoints directly
      const providers = await fetch('/api/auth/providers')
      const providersData = await providers.json()
      
      const session = await fetch('/api/auth/session')
      const sessionData = await session.json()
      
      setResults(prev => ({ 
        ...prev, 
        'nextauth-direct': { 
          providers: providersData,
          session: sessionData,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        'nextauth-direct': { error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    }
    setLoading(prev => ({ ...prev, 'nextauth-direct': false }))
  }

  const manualOAuthTest = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '834811537620-g4avg3hc1ggm97pqr6q5r7qjgi8j836b.apps.googleusercontent.com'
    const redirectUri = encodeURIComponent('https://pokemon-catelog-prod.vercel.app/api/debug/oauth-flow')
    const scope = encodeURIComponent('openid profile email')
    const state = 'qa-test-' + Date.now()
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${state}`
    
    window.open(authUrl, '_blank')
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">QA Debug Dashboard</h1>
      
      <Tabs defaultValue="environment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="nextauth">NextAuth</TabsTrigger>
          <TabsTrigger value="oauth">OAuth Flow</TabsTrigger>
          <TabsTrigger value="manual">Manual Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Environment Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => runTest('env', '/api/auth-debug')}
                disabled={loading.env}
              >
                {loading.env ? 'Testing...' : 'Test Environment Variables'}
              </Button>
              
              <Button 
                onClick={() => runTest('oauth-flow', '/api/debug/oauth-flow')}
                disabled={loading['oauth-flow']}
              >
                {loading['oauth-flow'] ? 'Testing...' : 'Test OAuth Flow Debug'}
              </Button>
              
              {results.env && (
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results.env, null, 2)}
                </pre>
              )}
              
              {results['oauth-flow'] && (
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results['oauth-flow'], null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nextauth">
          <Card>
            <CardHeader>
              <CardTitle>NextAuth Configuration Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => runTest('nextauth-config', '/api/debug/test-nextauth')}
                disabled={loading['nextauth-config']}
              >
                {loading['nextauth-config'] ? 'Testing...' : 'Test NextAuth Config'}
              </Button>
              
              <Button 
                onClick={testNextAuthDirectly}
                disabled={loading['nextauth-direct']}
              >
                {loading['nextauth-direct'] ? 'Testing...' : 'Test NextAuth Endpoints'}
              </Button>
              
              {results['nextauth-config'] && (
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results['nextauth-config'], null, 2)}
                </pre>
              )}
              
              {results['nextauth-direct'] && (
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {JSON.stringify(results['nextauth-direct'], null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oauth">
          <Card>
            <CardHeader>
              <CardTitle>OAuth Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Expected Callback URL:</strong></p>
                <code className="block bg-gray-100 p-2 rounded">
                  https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
                </code>
                
                <p><strong>Debug Callback URL:</strong></p>
                <code className="block bg-gray-100 p-2 rounded">
                  https://pokemon-catelog-prod.vercel.app/api/debug/oauth-flow
                </code>
              </div>
              
              <Button onClick={manualOAuthTest}>
                Test Manual OAuth (Debug Callback)
              </Button>
              
              <div className="text-xs text-gray-500">
                This will open a new tab with direct Google OAuth using our debug callback
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Testing Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-4">
                <div>
                  <h3 className="font-semibold">1. Environment Verification</h3>
                  <p>Run environment tests to verify all variables are set correctly</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">2. NextAuth Configuration</h3>
                  <p>Verify NextAuth is configured properly and can access providers</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">3. OAuth Flow Debugging</h3>
                  <p>Test the manual OAuth flow to see what Google returns</p>
                </div>
                
                <div>
                  <h3 className="font-semibold">4. Callback Analysis</h3>
                  <p>Check Vercel function logs for detailed callback information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}