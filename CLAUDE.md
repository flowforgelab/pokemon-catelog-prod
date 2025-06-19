# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Enterprise-grade Pokemon TCG platform with:
- User authentication and profiles (OAuth with Google/GitHub)
- Collection management with real-time pricing
- Deck building with validation and AI analysis
- Advanced search with 18,555+ cards
- Real-time market pricing integration (93% coverage)
- **NEW**: AI-powered deck analysis and recommendations (Phase 1 complete)

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

**Phase 7: AI Features Phase 1** (Completed - December 19, 2024)
- Platform: Railway (API) + Vercel (Frontend) + Supabase (Database)
- Status: **DEPLOYED** - Basic deck analysis and recommendations live
- Current Issue: NextAuth redirect loop preventing full testing

### Recent Accomplishments

1. **AI Features Phase 1**: 
   - Rule-based deck analysis (strategy detection)
   - Consistency scoring algorithm
   - Energy curve calculation
   - Basic card recommendations
   - UI components for analysis display

2. **Database Schema Updates**: 
   - Added DeckAnalysis table
   - Stores strategy, consistency scores, recommendations

3. **GraphQL API Extensions**: 
   - `analyzeDeck` mutation
   - `deckAnalysis` query
   - `deckRecommendations` query

### Current Issues

1. **NextAuth Redirect Loop**: 🔧 IN PROGRESS
   - Google OAuth authenticates but redirects to signin
   - Environment variables verified in Vercel
   - Debug endpoints deployed at `/test-env` and `/api/check-env`

2. **TCGPlayer URLs**: ⏳ PENDING
   - Update script needs to complete for 18,266 cards
   - Currently ~1,200 cards updated

### Deployment URLs
- **Frontend**: https://pokemon-catelog-prod.vercel.app
- **API**: https://pokemon-catelog-prod-production.up.railway.app
- **GraphQL Playground**: https://pokemon-catelog-prod-production.up.railway.app/graphql

## Key Features Implemented

### Backend (Complete)
- JWT authentication with refresh tokens
- GraphQL API with all resolvers
- Smart pricing system with tiered updates
- Collection CRUD with real-time value tracking
- Deck validation (60 cards, format rules)
- **NEW**: Deck analysis service (strategy detection, consistency scoring)
- **NEW**: Recommendation engine (card suggestions based on strategy)
- Advanced search with 9 sort options + anime era filtering
- Automated data import from Pokemon TCG API

### Frontend (Complete)
- Full design system with 18 Pokemon type colors
- All core pages (Home, Cards, Collections, Decks, Profile, Auth)
- **NEW**: DeckAnalysisCard component with energy curve visualization
- **NEW**: CardRecommendations component with priority badges
- shadcn/ui component library with Progress component
- Apollo Client with auth integration
- Responsive design with dark mode
- Search with pagination and filters

### Infrastructure (Complete)
- Docker containerization
- CI/CD with GitHub Actions
- E2E testing with Playwright
- Health monitoring endpoints
- Rate limiting middleware
- Production deployments on Railway + Vercel

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