'use client'

import { useState, useEffect } from 'react'

export default function DebugClientId() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the configuration
    fetch('/api/debug/nextauth-config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(error => {
        setConfig({ error: error.message })
        setLoading(false)
      })
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    })
  }

  if (loading) {
    return <div className="container mx-auto p-8">Loading configuration...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Google OAuth Client Debug</h1>
      
      <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-4">
        <h2 className="font-semibold text-red-800 dark:text-red-200">Error: invalid_client</h2>
        <p className="text-sm text-red-700 dark:text-red-300">
          Google is rejecting the OAuth client. This usually means the Client ID is incorrect or the OAuth client type is wrong.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Environment Variables Status</h3>
          <div className="space-y-1 text-sm">
            <p>Has Google Client ID: {config?.hasGoogleClientId ? '✅' : '❌'}</p>
            <p>Has Google Client Secret: {config?.hasGoogleClientSecret ? '✅' : '❌'}</p>
            <p>NEXTAUTH_URL: {config?.nextAuthUrl || 'Not set'}</p>
          </div>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          <h3 className="font-semibold mb-2">Action Required in Google Cloud Console</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 underline">Google Cloud Console → Credentials</a></li>
            <li>Find your OAuth 2.0 Client ID</li>
            <li>Verify it's type "Web application" (not Desktop or other)</li>
            <li>Check that the Client ID matches what's in Vercel environment variables</li>
            <li>Ensure these Authorized redirect URIs are added:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><code>https://pokemon-catelog-prod.vercel.app/api/auth/callback/google</code></li>
                <li><code>https://pokemon-catelog-prod.vercel.app/debug-google-direct</code></li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
          <h3 className="font-semibold mb-2">Common Fixes</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Wrong Client Type</strong>: Create a new "Web application" OAuth client</li>
            <li><strong>Wrong Client ID</strong>: Copy the correct Client ID from Google Cloud Console</li>
            <li><strong>Domain Restriction</strong>: Remove any domain restrictions temporarily</li>
            <li><strong>API Not Enabled</strong>: Enable "Google+ API" or "Google Identity" API</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <p className="text-sm mb-2">Expected callback URL (click to copy):</p>
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs font-mono cursor-pointer"
               onClick={() => copyToClipboard('https://pokemon-catelog-prod.vercel.app/api/auth/callback/google')}>
            https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
          </div>
          <p className="text-sm mt-2 mb-2">Debug redirect URI (for testing):</p>
          <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-xs font-mono cursor-pointer"
               onClick={() => copyToClipboard('https://pokemon-catelog-prod.vercel.app/debug-google-direct')}>
            https://pokemon-catelog-prod.vercel.app/debug-google-direct
          </div>
        </div>
      </div>
    </div>
  )
}