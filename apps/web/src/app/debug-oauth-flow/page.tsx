'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

interface OAuthTest {
  step: string
  timestamp: string
  details: any
}

function OAuthDebugContent() {
  const searchParams = useSearchParams()
  const [tests, setTests] = useState<OAuthTest[]>([])

  useEffect(() => {
    // Log the current URL and parameters
    const currentTest: OAuthTest = {
      step: 'Page Load',
      timestamp: new Date().toISOString(),
      details: {
        url: window.location.href,
        searchParams: Object.fromEntries(searchParams.entries()),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      }
    }
    setTests([currentTest])

    // Check if this is a callback
    if (searchParams.get('code') || searchParams.get('error')) {
      const callbackTest: OAuthTest = {
        step: 'OAuth Callback Received',
        timestamp: new Date().toISOString(),
        details: {
          code: searchParams.get('code') ? 'Present' : 'Missing',
          error: searchParams.get('error'),
          state: searchParams.get('state'),
          scope: searchParams.get('scope'),
          allParams: Object.fromEntries(searchParams.entries()),
        }
      }
      setTests(prev => [...prev, callbackTest])
    }
  }, [searchParams])

  const testGoogleOAuth = () => {
    const test: OAuthTest = {
      step: 'Google OAuth Initiated',
      timestamp: new Date().toISOString(),
      details: {
        redirecting: true,
        expectedCallback: 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/google'
      }
    }
    setTests(prev => [...prev, test])

    // Redirect to Google OAuth
    window.location.href = '/api/auth/signin/google'
  }

  const testGitHubOAuth = () => {
    const test: OAuthTest = {
      step: 'GitHub OAuth Initiated',
      timestamp: new Date().toISOString(),
      details: {
        redirecting: true,
        expectedCallback: 'https://pokemon-catelog-prod.vercel.app/api/auth/callback/github'
      }
    }
    setTests(prev => [...prev, test])

    // Redirect to GitHub OAuth
    window.location.href = '/api/auth/signin/github'
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Flow Debug</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testGoogleOAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
        >
          Test Google OAuth
        </button>
        <button
          onClick={testGitHubOAuth}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Test GitHub OAuth
        </button>
      </div>

      <div className="space-y-4">
        {tests.map((test, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h3 className="font-semibold text-green-600">{test.step}</h3>
            <p className="text-sm text-gray-600 mb-2">{test.timestamp}</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(test.details, null, 2)}
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-100 dark:bg-blue-900 p-4 rounded">
        <h2 className="font-semibold mb-2">Expected URLs</h2>
        <div className="text-sm space-y-1">
          <p><strong>Google Callback:</strong> https://pokemon-catelog-prod.vercel.app/api/auth/callback/google</p>
          <p><strong>GitHub Callback:</strong> https://pokemon-catelog-prod.vercel.app/api/auth/callback/github</p>
          <p><strong>NextAuth URL:</strong> https://pokemon-catelog-prod.vercel.app</p>
        </div>
      </div>
    </div>
  )
}

export default function OAuthDebugPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-8">Loading OAuth debug...</div>}>
      <OAuthDebugContent />
    </Suspense>
  )
}