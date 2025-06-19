'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function DebugOAuth() {
  const searchParams = useSearchParams()
  const [urlInfo, setUrlInfo] = useState<any>(null)

  useEffect(() => {
    // Capture all URL parameters and current state
    const info = {
      currentUrl: window.location.href,
      searchParams: Object.fromEntries(searchParams.entries()),
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    setUrlInfo(info)
    
    // Log to console for debugging
    console.log('OAuth Debug Info:', info)
  }, [searchParams])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Debug Page</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="font-semibold mb-2">URL Information</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(urlInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
          <h2 className="font-semibold mb-2">Expected OAuth Callback URL</h2>
          <p className="text-sm">
            <strong>Should be:</strong> https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
          </p>
          <p className="text-sm mt-2">
            <strong>Google Console should have:</strong><br/>
            - https://pokemon-catelog-prod.vercel.app/api/auth/callback/google<br/>
            - http://localhost:3000/api/auth/callback/google (for dev)
          </p>
        </div>

        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          <h2 className="font-semibold mb-2">Debug Instructions</h2>
          <ol className="text-sm list-decimal list-inside space-y-1">
            <li>Try OAuth signin and watch the browser network tab</li>
            <li>Look for any failed requests to /api/auth/callback/google</li>
            <li>Check if there are any CORS errors</li>
            <li>Verify the callback URL matches Google Console settings</li>
          </ol>
        </div>
      </div>
    </div>
  )
}