'use client'

import { useEffect, useState } from 'react'

interface DbCheck {
  userTable: boolean
  accountTable: boolean
  sessionTable: boolean
  verificationTokenTable: boolean
  userCount: number
  accountCount: number
  sessionCount: number
  error?: string
}

export default function DebugAuthDb() {
  const [dbCheck, setDbCheck] = useState<DbCheck | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkDb() {
      try {
        const response = await fetch('/api/debug/auth-db')
        const data = await response.json()
        setDbCheck(data)
      } catch (error) {
        setDbCheck({ 
          userTable: false, 
          accountTable: false, 
          sessionTable: false, 
          verificationTokenTable: false,
          userCount: 0, 
          accountCount: 0, 
          sessionCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      } finally {
        setLoading(false)
      }
    }

    checkDb()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-8">Loading database check...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">NextAuth Database Check</h1>
      
      {dbCheck?.error ? (
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded mb-4">
          <pre className="text-red-800 dark:text-red-200 whitespace-pre-wrap text-sm">
            Error: {dbCheck.error}
          </pre>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h2 className="font-semibold mb-2">Database Tables</h2>
            <div className="space-y-1 text-sm">
              <p>User table: {dbCheck?.userTable ? '✅' : '❌'}</p>
              <p>Account table: {dbCheck?.accountTable ? '✅' : '❌'}</p>
              <p>Session table: {dbCheck?.sessionTable ? '✅' : '❌'}</p>
              <p>VerificationToken table: {dbCheck?.verificationTokenTable ? '✅' : '❌'}</p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <h2 className="font-semibold mb-2">Record Counts</h2>
            <div className="space-y-1 text-sm">
              <p>Users: {dbCheck?.userCount || 0}</p>
              <p>Accounts: {dbCheck?.accountCount || 0}</p>
              <p>Sessions: {dbCheck?.sessionCount || 0}</p>
            </div>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
            <h2 className="font-semibold mb-2">NextAuth Expected URL</h2>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
            </p>
          </div>
        </div>
      )}
    </div>
  )
}