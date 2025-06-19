'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DebugClientAuth() {
  const [testResult, setTestResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAuthClient = async () => {
    setLoading(true)
    setTestResult('Testing...')
    
    try {
      // Test 1: Import auth client
      const authModule = await import('@/lib/auth-client')
      setTestResult(prev => prev + '\n✅ Auth client imported successfully')
      
      // Test 2: Check if signIn function exists
      const { signIn, useSession, authClient } = authModule
      setTestResult(prev => prev + '\n✅ signIn function exists: ' + !!signIn)
      setTestResult(prev => prev + '\n✅ useSession function exists: ' + !!useSession)
      setTestResult(prev => prev + '\n✅ authClient exists: ' + !!authClient)
      
      // Test 3: Try to call signIn.social
      setTestResult(prev => prev + '\n🔄 Testing signIn.social...')
      
      // Add event listener to catch any navigation
      const originalLocation = window.location.href
      
      await signIn.social({ 
        provider: 'google',
        callbackURL: window.location.origin + '/auth/callback'
      })
      
      setTestResult(prev => prev + '\n✅ signIn.social called without error')
      
      // Check if location changed
      setTimeout(() => {
        if (window.location.href !== originalLocation) {
          setTestResult(prev => prev + '\n🚀 Redirected to: ' + window.location.href)
        } else {
          setTestResult(prev => prev + '\n⚠️ No redirect occurred')
        }
      }, 1000)
      
    } catch (error) {
      setTestResult(prev => prev + '\n❌ Error: ' + (error instanceof Error ? error.message : String(error)))
      console.error('Auth client test error:', error)
    } finally {
      setLoading(false)
    }
  }

  const testDirectAPI = async () => {
    setLoading(true)
    setTestResult('Testing direct API calls...')
    
    try {
      // Test auth endpoints directly
      const sessionRes = await fetch('/api/auth/session')
      setTestResult(prev => prev + '\n🔄 /api/auth/session: ' + sessionRes.status)
      
      const providersRes = await fetch('/api/auth/providers') 
      setTestResult(prev => prev + '\n🔄 /api/auth/providers: ' + providersRes.status)
      
      if (sessionRes.ok) {
        const sessionData = await sessionRes.text()
        setTestResult(prev => prev + '\n📄 Session response: ' + sessionData.substring(0, 200))
      }
      
    } catch (error) {
      setTestResult(prev => prev + '\n❌ API Error: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug Client Auth</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testAuthClient} disabled={loading}>
          Test Auth Client
        </Button>
        
        <Button onClick={testDirectAPI} disabled={loading} variant="outline">
          Test Direct API
        </Button>
      </div>

      <div className="p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {testResult || 'Click a test button to see results...'}
        </pre>
      </div>
    </div>
  )
}