# Deploying Pokemon Catalog API to Railway

## Prerequisites
1. Railway account (https://railway.app)
2. Railway CLI installed: `brew install railway` or `npm i -g @railway/cli`

## Setup Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Create a new Railway project
```bash
cd /Users/greg/new-better-app/pokemon-catalog-production/apps/api
railway init
```

### 3. Add Redis service (optional but recommended)
In Railway dashboard:
- Click "New" → "Database" → "Add Redis"
- Railway will automatically set REDIS_URL environment variable

### 4. Set Environment Variables
In Railway dashboard or CLI:

```bash
# Required variables
railway variables set DATABASE_URL="postgresql://postgres:tesfa5-peHbuv-sojnuz@db.zgzvwrhoprhdvdnwofiq.supabase.co:5432/postgres"
railway variables set JWT_SECRET="<generate-64-byte-hex-string>"
railway variables set FRONTEND_URL="https://pokemon-catalog-production.vercel.app"
railway variables set PORT="3001"

# Optional (if not using Railway Redis)
railway variables set REDIS_HOST="your-redis-host"
railway variables set REDIS_PORT="your-redis-port"
```

### 5. Deploy
```bash
railway up
```

### 6. Get your API URL
```bash
railway domain
```

### 7. Update Vercel Frontend
In your Vercel project settings:
- Go to Environment Variables
- Update `NEXT_PUBLIC_GRAPHQL_URL` to your Railway API URL + `/graphql`
- Example: `https://your-app.up.railway.app/graphql`

## Monitoring
- View logs: `railway logs`
- Open dashboard: `railway open`

## Notes
- Railway automatically handles SSL certificates
- The build command in railway.json handles the monorepo structure
- Health check endpoint is available at `/health`
- GraphQL playground available at `/graphql` in development