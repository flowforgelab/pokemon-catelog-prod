'use client'

import { useEffect, useState } from 'react'

export default function TestGoogleOAuth() {
  const [status, setStatus] = useState<string>('ready')
  
  // The actual Google Client ID
  const GOOGLE_CLIENT_ID = '834811537620-g4avg3hc1ggm97pqr6q5r7qjgi8j836b.apps.googleusercontent.com'
  
  useEffect(() => {
    // Check if we received a callback
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (code) {
      setStatus('success')
    } else if (error) {
      setStatus('error: ' + error + ' - ' + (urlParams.get('error_description') || ''))
    }
  }, [])
  
  const testOAuth = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: 'https://pokemon-catelog-prod.vercel.app/test-google-oauth',
      response_type: 'code',
      scope: 'openid email profile',
      state: 'test-' + Date.now(),
    })
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('Redirecting to:', authUrl)
    window.location.href = authUrl
  }
  
  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Direct Google OAuth Test</h1>
      
      {status === 'ready' && (
        <>
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded mb-4">
            <p className="text-sm">This will test Google OAuth with your actual client ID.</p>
            <p className="text-xs mt-2 font-mono">Client ID: {GOOGLE_CLIENT_ID}</p>
          </div>
          
          <button
            onClick={testOAuth}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Test Google OAuth
          </button>
          
          <div className="mt-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
            <h2 className="font-semibold mb-2">Required Redirect URI</h2>
            <p className="text-sm">Make sure this is added in Google Cloud Console:</p>
            <code className="text-xs block mt-1 bg-yellow-200 dark:bg-yellow-800 p-2 rounded">
              https://pokemon-catelog-prod.vercel.app/test-google-oauth
            </code>
          </div>
        </>
      )}
      
      {status === 'success' && (
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
          <h2 className="text-green-800 dark:text-green-200 font-semibold">✅ Success!</h2>
          <p className="text-sm mt-2">Google OAuth is working correctly. The authorization code was received.</p>
          <p className="text-sm mt-2">This confirms:</p>
          <ul className="list-disc list-inside text-sm mt-1">
            <li>Client ID is valid</li>
            <li>Redirect URI is properly configured</li>
            <li>Google OAuth flow is functional</li>
          </ul>
          <button onClick={() => window.location.href = '/'} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Go Home
          </button>
        </div>
      )}
      
      {status.startsWith('error') && (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded">
          <h2 className="text-red-800 dark:text-red-200 font-semibold">❌ Error</h2>
          <p className="text-sm mt-2">{status}</p>
          <button onClick={() => setStatus('ready')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}