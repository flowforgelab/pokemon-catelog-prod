# Fix Authentication Redirect Loop

## The Problem
After signing in with Google, you're redirected back to the sign-in page instead of the app. This is because NextAuth can't establish a proper session.

## Root Causes
1. Missing `NEXTAUTH_URL` environment variable in Vercel
2. Possible database connection issues for session storage
3. JWT token not being properly set

## Solution

### 1. Add Missing Environment Variables in Vercel

Go to: https://vercel.com/[your-team]/pokemon-catelog-prod/settings/environment-variables

Add these **Production** environment variables:

```
NEXTAUTH_URL=https://pokemon-catelog-prod.vercel.app
NEXTAUTH_SECRET=[generate a 64-character random string]
```

To generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Verify All Auth Environment Variables

Make sure these are ALL set in Vercel:
- ✅ `NEXTAUTH_URL` = `https://pokemon-catelog-prod.vercel.app`
- ✅ `NEXTAUTH_SECRET` = [64-character random string]
- ✅ `GOOGLE_CLIENT_ID` = [your OAuth client ID]
- ✅ `GOOGLE_CLIENT_SECRET` = [your OAuth client secret]
- ✅ `DATABASE_URL` = [your Supabase connection string]
- ✅ `NEXT_PUBLIC_GRAPHQL_URL` = `https://pokemon-catelog-prod-production.up.railway.app/graphql`

### 3. Redeploy After Adding Variables

After adding the environment variables:
1. Go to Vercel dashboard
2. Click "Redeploy" 
3. Select "Redeploy with existing Build Cache"

### 4. Debug Session (if still not working)

Add this debug page to test:

Create `apps/web/src/app/api/auth/debug/route.ts`:
```typescript
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession()
  return NextResponse.json({
    session,
    env: {
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
      nextAuthUrl: process.env.NEXTAUTH_URL
    }
  })
}
```

Then visit: https://pokemon-catelog-prod.vercel.app/api/auth/debug

## Quick Checklist
- [ ] NEXTAUTH_URL is set in Vercel (not just locally)
- [ ] NEXTAUTH_SECRET is set in Vercel
- [ ] Google OAuth redirect URIs include your production URL
- [ ] Redeployed after adding environment variables
- [ ] Cleared browser cookies and tried again

## Expected Behavior
1. Click "Continue with Google"
2. Redirect to Google sign-in
3. After Google auth, redirect to `/` (home page)
4. Session is established and you can access `/decks`