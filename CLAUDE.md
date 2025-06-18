# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Enterprise-grade Pokemon TCG platform with:
- User authentication and profiles
- Collection management with real-time pricing
- Deck building and validation
- Advanced search with 19,155+ cards
- Real-time market pricing integration

## Essential Commands

### Development
```bash
# Start all services (from project root)
docker compose up -d
pnpm dev              # Runs both web (port 3000) and API (port 3001)

# Individual services
cd apps/web && pnpm dev    # Web only
cd apps/api && pnpm dev    # API only
```

### Building
```bash
pnpm build                 # Build all apps
pnpm build:web            # Build web only  
pnpm build:api            # Build API only
pnpm turbo build --filter=@pokemon-catalog/web  # Turbo-specific web build
```

### Database Operations
```bash
# From packages/database directory
pnpm db:generate          # Generate Prisma client after schema changes
pnpm db:push             # Push schema to database
pnpm migrate             # Run migrations (dev)
pnpm studio              # Open Prisma Studio GUI

# Import Pokemon cards (from apps/api)
cd apps/api && pnpm import:cards
```

### Testing
```bash
pnpm test                 # Run all tests
pnpm test:e2e            # Run Playwright E2E tests
cd apps/api && pnpm test:cov  # API coverage report
```

### Docker Services
```bash
docker compose up -d      # Start PostgreSQL, Redis, Elasticsearch, Kibana
docker compose ps         # Check service status
docker compose logs -f    # View logs
docker compose down -v    # Stop and remove volumes
```

## Architecture Overview

### Monorepo Structure
```
apps/
├── web/         # Next.js 15 frontend (App Router)
├── api/         # NestJS GraphQL backend
└── mobile/      # React Native (planned)

packages/
├── database/    # Prisma schema & client
├── shared/      # Shared types/utilities
├── ui/          # Shared UI components (planned)
└── config/      # Shared configs
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Apollo Client
- **Backend**: NestJS, GraphQL, Prisma, PostgreSQL, Redis, Elasticsearch
- **Auth**: NextAuth.js + JWT with Google/GitHub OAuth
- **Build**: Turborepo, pnpm workspaces

### GraphQL API Structure

Key modules in `apps/api/src/modules/`:
- `auth/` - Authentication with JWT refresh tokens
- `search/` - Card search with Elasticsearch integration
- `collection/` - User collection management
- `deck/` - Deck building with validation
- `pricing/` - TCGPlayer price integration
- `user/` - User profiles and relationships

### Database Schema

15 tables including:
- `User` - User accounts with profiles
- `Card` - 19,155+ Pokemon cards with full gameplay data
- `Collection` - User collections
- `Deck` - User decks with format validation
- `CardPrice` - Historical pricing data

## Current Deployment Status

**Phase 5: Production Deployment** (Active)
- Platform: Vercel + Supabase
- Status: Build issues with path resolution in Vercel environment

### Known Issues

1. **Vercel Build Error**: Module resolution fails for `@/components/ui/*` imports
   - Works locally but fails in Vercel build environment
   - Related to monorepo TypeScript path mappings

2. **Port Configuration**: API runs on port 3001 (not 4000 as documented)

3. **Environment Variables**: 
   - OAuth secrets removed from commits for security
   - Must be manually configured in Vercel dashboard

## Key Features Implemented

### Backend (Complete)
- JWT authentication with refresh tokens
- GraphQL API with all resolvers
- Smart pricing system with tiered updates
- Collection CRUD with real-time value tracking
- Deck validation (60 cards, format rules)
- Advanced search with 9 sort options + anime era filtering
- Automated data import from Pokemon TCG API

### Frontend (Complete)
- Full design system with 18 Pokemon type colors
- All core pages (Home, Cards, Collections, Decks, Profile, Auth)
- shadcn/ui component library
- Apollo Client with auth integration
- Responsive design with dark mode
- Search with pagination and filters

### Infrastructure (Complete)
- Docker containerization
- CI/CD with GitHub Actions
- E2E testing with Playwright
- Health monitoring endpoints
- Rate limiting middleware

## Deployment Configuration

### Vercel Settings (Recommended)
- **Root Directory**: `apps/web`
- **Build Command**: `pnpm build` or `pnpm turbo build --filter=@pokemon-catalog/web`
- **Install Command**: `pnpm install`
- **Framework**: Next.js (auto-detected)

### Required Environment Variables
```
DATABASE_URL              # Supabase PostgreSQL URL
JWT_SECRET               # 64-byte hex string
NEXTAUTH_SECRET          # 64-byte hex string
NEXTAUTH_URL             # Production URL
GOOGLE_CLIENT_ID         # OAuth credentials
GOOGLE_CLIENT_SECRET     # OAuth credentials
NEXT_PUBLIC_GRAPHQL_URL  # API endpoint
```

## API Query Examples

```graphql
# Search cards with filtering
query searchCards($input: SearchInput!) {
  searchCards(input: $input) {
    total
    cards {
      id name hp marketPrice
      types rarity imageSmall
    }
  }
}

# User collections
query myCollections {
  myCollections {
    id name totalValue
    cards { card { name marketPrice } }
  }
}
```

## Quick Fixes

### Kill MVP processes (if conflicts arise)
```bash
lsof -ti:3001 | xargs kill -9
ps aux | grep pokemon-catalog-mvp | grep -v grep | awk '{print $2}' | xargs kill -9
```

### Manual Prisma operations (if standard commands fail)
```bash
docker exec -i pokemon-catalog-db psql -U postgres -d pokemon_catalog < packages/database/init.sql
```

### Export data for production
```bash
./scripts/export-data.sh  # Creates pokemon-cards-data.sql
```