'use client'

import { useSession, signIn, signOut, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthTestComprehensive() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [clientSession, setClientSession] = useState<any>(null)

  useEffect(() => {
    // Fetch debug info from our API
    fetch('/api/debug/auth-flow')
      .then(res => res.json())
      .then(data => setDebugInfo(data))
      .catch(err => console.error('Failed to fetch debug info:', err))
  }, [])

  const refreshSession = async () => {
    const newSession = await getSession()
    setClientSession(newSession)
  }

  const testGoogleSignIn = () => {
    signIn('google', { 
      callbackUrl: '/',
      redirect: true 
    })
  }

  const testGitHubSignIn = () => {
    signIn('github', { 
      callbackUrl: '/',
      redirect: true 
    })
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Comprehensive Auth Test</h1>
      
      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Session Status</CardTitle>
          <CardDescription>Real-time authentication state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          {session ? (
            <div className="space-y-2">
              <div><strong>Email:</strong> {session.user?.email}</div>
              <div><strong>Name:</strong> {session.user?.name}</div>
              <div><strong>Image:</strong> {session.user?.image}</div>
              <div><strong>Session Expires:</strong> {session.expires}</div>
              <div><strong>User ID:</strong> {(session.user as any)?.id || 'Not set'}</div>
            </div>
          ) : (
            <div>No active session</div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={refreshSession}>Refresh Session</Button>
            {session ? (
              <Button onClick={() => signOut()} variant="destructive">
                Sign Out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={testGoogleSignIn}>
                  Sign In with Google
                </Button>
                <Button onClick={testGitHubSignIn} variant="outline">
                  Sign In with GitHub
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Session Debug */}
      {clientSession && (
        <Card>
          <CardHeader>
            <CardTitle>Client Session (Manual Refresh)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(clientSession, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Debug Information */}
      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Auth Flow Debug Info</CardTitle>
            <CardDescription>Server-side authentication analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Manual Auth Flow Test */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Auth Flow Test</CardTitle>
          <CardDescription>Step-by-step authentication testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => window.open('/api/auth/signin', '_blank')}
              variant="outline"
            >
              Open Sign In Page (New Tab)
            </Button>
            
            <Button 
              onClick={() => window.open('/api/auth/session', '_blank')}
              variant="outline"
            >
              Check API Session (New Tab)
            </Button>
            
            <Button 
              onClick={() => window.open('/api/auth/providers', '_blank')}
              variant="outline"
            >
              Check Providers (New Tab)
            </Button>
            
            <Button 
              onClick={() => window.open('/api/debug/auth-flow', '_blank')}
              variant="outline"
            >
              Debug Auth Flow (New Tab)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Check the current session status above</li>
            <li>If not signed in, try the "Sign In with Google" button</li>
            <li>Watch for redirects and check if you get back to this page</li>
            <li>If successful, you should see your session info populated</li>
            <li>Check the debug info for any error messages</li>
            <li>Try signing out and signing in again</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}