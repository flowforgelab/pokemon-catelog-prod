'use client'

import { signIn, useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useRouter } from 'next/navigation'

function SignInContent() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Redirect if already signed in
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl)
    }
  }, [status, session, callbackUrl, router])

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Callback':
        return 'OAuth callback failed. Please check that the redirect URI is configured correctly in Google Cloud Console. Expected: https://pokemon-catelog-prod.vercel.app/api/auth/callback/google'
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL.'
      case 'OAuthCallback':
        return 'Error in handling the response from an OAuth provider.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account in the database.'
      case 'EmailCreateAccount':
        return 'Could not create email account in the database.'
      case 'Signin':
        return 'Error in signing in.'
      case 'OAuthAccountNotLinked':
        return 'Email on the account is already linked, but not with this OAuth account.'
      case 'EmailSignin':
        return 'Sending the e-mail with the verification token failed.'
      case 'CredentialsSignin':
        return 'The authorize callback returned null in the Credentials provider.'
      case 'SessionRequired':
        return 'The content of this page requires you to be signed in at all times.'
      default:
        return error ? `Authentication error: ${error}` : null
    }
  }

  if (status === 'loading') {
    return <div className="container mx-auto py-16 max-w-md">Loading...</div>
  }

  if (status === 'authenticated') {
    return <div className="container mx-auto py-16 max-w-md">Redirecting...</div>
  }

  return (
    <div className="container mx-auto py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {getErrorMessage(error)}
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full"
            variant="outline"
          >
            Continue with Google
          </Button>
          <Button
            onClick={() => signIn('github', { callbackUrl })}
            className="w-full"
            variant="outline"
          >
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 max-w-md">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}