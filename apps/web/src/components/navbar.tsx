'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center px-2 py-2 text-gray-900 font-semibold">
              Pokemon Catalog
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
                <img
                  className="h-8 w-8 rounded-full"
                  src={session.user?.image || ''}
                  alt={session.user?.name || ''}
                />
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}