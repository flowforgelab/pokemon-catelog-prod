# Vercel Environment Variables Check

## Why Authentication Isn't Working

You're experiencing a redirect loop because after Google authenticates you, NextAuth can't establish a session. This happens when key environment variables are missing.

## Required Environment Variables in Vercel

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Make sure these are set for **Production**:

### 1. NEXTAUTH_URL
```
NEXTAUTH_URL=https://pokemon-catelog-prod.vercel.app
```
⚠️ This MUST match your deployment URL exactly

### 2. NEXTAUTH_SECRET  
Generate with:
```bash
openssl rand -base64 32
```
Example: `K5I8Q2FQ9P+UiVnGKLrBI3X2OZnTKB3vfVq7YrqBmHw=`

### 3. Google OAuth (should already be set)
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

### 4. Database (should already be set)
- DATABASE_URL

### 5. GraphQL API
```
NEXT_PUBLIC_GRAPHQL_URL=https://pokemon-catelog-prod-production.up.railway.app/graphql
```

## How to Add/Update

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. For each missing variable:
   - Enter the key (e.g., NEXTAUTH_URL)
   - Enter the value
   - Select "Production" environment
   - Click "Save"

5. **Important**: After adding variables, you must redeploy:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Select "Redeploy"
   - Choose "Use existing Build Cache"

## Quick Test After Fix

1. Clear all cookies for pokemon-catelog-prod.vercel.app
2. Go to https://pokemon-catelog-prod.vercel.app/auth/signin
3. Click "Continue with Google"
4. After Google auth, you should be redirected to the home page
5. Try accessing https://pokemon-catelog-prod.vercel.app/decks

## If Still Not Working

Check the Vercel Function Logs:
1. Go to Vercel Dashboard → Functions tab
2. Look for errors in the logs
3. Common issues:
   - "NEXTAUTH_URL is not defined"
   - "No secret found"
   - Database connection errors

## Alternative Test

Once variables are set and redeployed, this URL should work:
https://pokemon-catelog-prod.vercel.app/api/auth/csrf

It should return:
```json
{"csrfToken":"...some-token..."}
```

If it returns an error, the environment variables are still not set correctly.