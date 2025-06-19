'use client'

import { useState, useEffect } from 'react'

export default function DirectGoogleTest() {
  const [result, setResult] = useState<any>(null)
  const [callbackInfo, setCallbackInfo] = useState<any>(null)

  useEffect(() => {
    // Check if we're receiving a callback (client-side only)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const error = urlParams.get('error')
      const state = urlParams.get('state')

      if (code || error) {
        setCallbackInfo({
          code: code ? 'Present (length: ' + code.length + ')' : 'Missing',
          error: error,
          error_description: urlParams.get('error_description'),
          state: state,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }
    }
  }, [])

  const testDirectGoogleOAuth = () => {
    // We need to get the actual Google Client ID from the server
    // since GOOGLE_CLIENT_ID is not exposed as NEXT_PUBLIC_
    setResult({
      action: 'Getting Google Client ID',
      timestamp: new Date().toISOString()
    })

    // For now, show instructions
    const instructionsUrl = '/debug-client-id'
    
    setResult({
      error: 'Cannot proceed - Google Client ID not publicly accessible',
      instructions: 'The Google Client ID needs to be retrieved from Google Cloud Console',
      nextStep: 'Redirecting to debug instructions...',
      timestamp: new Date().toISOString()
    })

    // Redirect to instructions page
    setTimeout(() => {
      window.location.href = instructionsUrl
    }, 2000)
  }

  if (callbackInfo) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Google OAuth Callback Received</h1>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Callback Details</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(callbackInfo, null, 2)}
          </pre>
        </div>

        {callbackInfo.code !== 'Missing' && (
          <div className="mt-4 bg-green-100 dark:bg-green-900 p-4 rounded">
            <p className="text-green-800 dark:text-green-200">
              ✅ Success! Google OAuth returned an authorization code. 
              This means the redirect URI is correctly configured in Google Cloud Console.
            </p>
          </div>
        )}

        {callbackInfo.error && (
          <div className="mt-4 bg-red-100 dark:bg-red-900 p-4 rounded">
            <p className="text-red-800 dark:text-red-200">
              ❌ Error: {callbackInfo.error}
            </p>
            {callbackInfo.error_description && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                {callbackInfo.error_description}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => window.location.href = '/debug-google-direct'}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Again
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Direct Google OAuth Test</h1>
      
      <p className="mb-4 text-gray-600">
        This test bypasses NextAuth and tests Google OAuth directly to verify 
        if the redirect URI configuration is working.
      </p>

      <button
        onClick={testDirectGoogleOAuth}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test Direct Google OAuth
      </button>

      {result && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">Test Result</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
        <h2 className="font-semibold mb-2">What This Test Does</h2>
        <ul className="text-sm space-y-1">
          <li>• Constructs a direct Google OAuth URL</li>
          <li>• Uses the same redirect URI that NextAuth expects</li>
          <li>• If Google accepts it, the redirect URI is correctly configured</li>
          <li>• If Google rejects it, there's a configuration mismatch</li>
        </ul>
      </div>
    </div>
  )
}