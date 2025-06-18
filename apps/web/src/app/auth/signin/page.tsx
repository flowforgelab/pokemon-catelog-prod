'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
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
          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full"
            variant="outline"
          >
            Continue with Google
          </Button>
          <Button
            onClick={() => signIn('github', { callbackUrl: '/' })}
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