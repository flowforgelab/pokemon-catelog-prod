'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <p>Status: {status}</p>
        <p>Session: {session ? 'Logged in' : 'Not logged in'}</p>
        {session && <p>Email: {session.user?.email}</p>}
      </div>

      {session ? (
        <button 
          onClick={() => signOut()} 
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      ) : (
        <button 
          onClick={() => signIn('google')} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In with Google
        </button>
      )}
    </div>
  )
}