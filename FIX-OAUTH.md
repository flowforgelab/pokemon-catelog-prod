# Fix Google OAuth Redirect URI Error

## The Problem
Google OAuth is blocking login with error: `redirect_uri_mismatch`

This happens because the production URL doesn't match what's configured in Google Cloud Console.

## Solution Steps

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Find Your OAuth 2.0 Client
- Look for the OAuth client used by your app
- Click on it to edit

### 3. Add Production Redirect URIs
Add these **Authorized redirect URIs**:
```
https://pokemon-catelog-prod.vercel.app/api/auth/callback/google
https://www.pokemon-catelog-prod.vercel.app/api/auth/callback/google
```

### 4. Add Production JavaScript Origins
Add these **Authorized JavaScript origins**:
```
https://pokemon-catelog-prod.vercel.app
https://www.pokemon-catelog-prod.vercel.app
```

### 5. Save Changes
Click "Save" at the bottom

### 6. Environment Variables on Vercel
Make sure these are set in Vercel dashboard:
- `GOOGLE_CLIENT_ID` - Your OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your OAuth client secret
- `NEXTAUTH_URL` = `https://pokemon-catelog-prod.vercel.app`
- `NEXTAUTH_SECRET` - A random 64-character string

## Quick Test After Fix
1. Clear browser cookies for the domain
2. Try logging in again at https://pokemon-catelog-prod.vercel.app/auth/signin
3. Should redirect to Google and back successfully

## Alternative: Create New OAuth Client
If you can't modify the existing one:

1. Create new OAuth 2.0 Client ID
2. Application type: Web application
3. Name: Pokemon Catalog Production
4. Add the URIs listed above
5. Update Vercel env vars with new client ID/secret

## Common Issues
- **Still getting error?** Wait 5 minutes for Google to propagate changes
- **Wrong domain?** Make sure it matches EXACTLY (including https://)
- **Still blocked?** Check if app needs verification in Google Cloud Console