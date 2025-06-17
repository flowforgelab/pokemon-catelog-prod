import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Paths that require authentication
const protectedPaths = [
  '/profile',
  '/collections',
  '/decks',
  '/trades',
  '/settings',
]

// Paths that should redirect to home if authenticated
const authPaths = [
  '/auth/signin',
  '/auth/signup',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const pathname = request.nextUrl.pathname

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )

  // Check if the path is an auth page
  const isAuthPath = authPaths.some(path => 
    pathname.startsWith(path)
  )

  // Redirect to signin if accessing protected path without auth
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect to home if accessing auth pages while authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}