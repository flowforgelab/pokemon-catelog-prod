# Railway Setup Guide for Pokemon Catalog Production API

## Step 1: Create New Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Empty Project" (not a template)
4. Give it a name like "pokemon-catalog-production-api"

## Step 2: Connect GitHub Repository

1. In your new project, click "Add Service" → "GitHub Repo"
2. Connect your GitHub account if not already connected
3. Select your repository: `pokemon-catalog-production` (or whatever your repo is named)
4. **IMPORTANT**: Set the "Root Directory" to `apps/api`
5. Railway will auto-detect it's a Node.js app

## Step 3: Configure Environment Variables

Click on your service, then go to "Variables" tab and add these:

```bash
DATABASE_URL=postgresql://postgres:tesfa5-peHbuv-sojnuz@db.zgzvwrhoprhdvdnwofiq.supabase.co:5432/postgres
JWT_SECRET=2e327ba0dffbb28955dcc7adaf67e59385e31d4df7294c3b6e6f419dc49d64b7c1b95678b5b04065d39c2899cccbbd312b4e532835b784c31e5aae795063f9c6
FRONTEND_URL=https://pokemon-catalog-production.vercel.app
NODE_ENV=production
```

**DO NOT SET PORT** - Railway provides this automatically

## Step 4: Configure Build Settings

1. Go to "Settings" tab
2. Under "Build Command", it should auto-detect or you can set:
   ```
   cd ../.. && pnpm install && pnpm build:api
   ```
3. Under "Start Command", set:
   ```
   node dist/main.js
   ```

## Step 5: Add Redis Service (Optional but Recommended)

1. Click "New" → "Database" → "Redis"
2. Railway will automatically inject `REDIS_URL` into your API service
3. No additional configuration needed

## Step 6: Generate Domain

1. Go to your API service settings
2. Under "Networking", click "Generate Domain"
3. You'll get a URL like: `https://pokemon-catalog-production-api.up.railway.app`

## Step 7: Deploy

1. If connected to GitHub, it will auto-deploy on push
2. Or click "Deploy" button to trigger manual deployment
3. Watch the deploy logs for any errors

## Step 8: Verify Deployment

Once deployed, test these endpoints:

```bash
# Health check
curl https://your-api-domain.up.railway.app/health

# GraphQL playground (if not in production mode)
open https://your-api-domain.up.railway.app/graphql

# Test GraphQL query
curl -X POST https://your-api-domain.up.railway.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

## Step 9: Update Vercel Frontend

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Update or add:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://your-api-domain.up.railway.app/graphql
   ```
4. Redeploy your Vercel frontend

## Troubleshooting

### If build fails:
- Check the build logs in Railway
- Ensure the monorepo paths are correct
- Verify all dependencies are in package.json

### If app crashes on start:
- Check runtime logs
- Verify DATABASE_URL is correct
- Ensure all required env vars are set

### Database connection issues:
- Verify Supabase allows connections from Railway IPs
- Check if database URL has proper SSL settings

## Monitoring

- Use Railway's built-in metrics
- Set up health check monitoring
- Enable error notifications in Railway settings