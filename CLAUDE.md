# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Enterprise-grade Pokemon TCG platform with:
- User authentication and profiles (NextAuth.js with Google/GitHub OAuth)
- Collection management with real-time pricing (93% coverage)
- Deck building with validation and AI-powered analysis
- Advanced search with 18,555+ cards
- Real-time market pricing integration via TCGPlayer API
- **Phase 1 AI Features**: Rule-based deck analysis and recommendations (COMPLETED)

**Current Status**: Production deployed on Railway (API) + Vercel (Frontend) + Supabase (Database)

## Essential Commands

### Development
```bash
# Start all services (from project root)
docker compose up -d      # PostgreSQL, Redis, Elasticsearch (optional for local)
pnpm dev                  # Runs both web (port 3000) and API (port 3001)

# Individual services
cd apps/web && pnpm dev    # Frontend only (Next.js 15)
cd apps/api && pnpm dev    # Backend only (NestJS)
```

### Building
```bash
pnpm build                # Build all apps
pnpm build:web           # Build frontend only
pnpm build:api           # Build backend only
pnpm turbo build --filter=@pokemon-catalog/web  # Turbo-specific build
```

### Database Operations
```bash
# Prisma operations (from project root)
pnpm --filter @pokemon-catalog/database db:generate  # Generate client
pnpm --filter @pokemon-catalog/database db:push     # Push schema changes
pnpm --filter @pokemon-catalog/database migrate     # Run migrations (dev)
pnpm --filter @pokemon-catalog/database studio      # Open Prisma Studio

# Data import scripts
node scripts/import-cards-full.js        # Import all Pokemon cards (run once)
node scripts/update-tcgplayer-urls.js    # Update TCGPlayer purchase URLs
```

### Testing
```bash
pnpm test                 # Run all tests
pnpm test:e2e            # Run Playwright E2E tests
cd apps/api && pnpm test:cov  # API coverage report

# Testing specific features
cd apps/web && npm run build  # Test frontend build
node scripts/test-deck-analysis.js  # Test AI analysis in production
```

## Architecture Overview

### Monorepo Structure
```
apps/
├── web/         # Next.js 15 frontend (App Router, React 19)
├── api/         # NestJS GraphQL backend
└── mobile/      # React Native (planned)

packages/
├── database/    # Prisma schema & client
├── shared/      # Shared types/utilities
├── ui/          # Shared UI components (planned)
└── config/      # Shared configs

scripts/         # Data import, TCGPlayer updates, testing utilities
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Apollo Client
- **Backend**: NestJS, GraphQL, Prisma, PostgreSQL, Redis
- **Auth**: NextAuth.js with database sessions (Google/GitHub OAuth)
- **Deployment**: Railway (API), Vercel (Frontend), Supabase (Database)
- **Build**: Turborepo, pnpm workspaces

### Key Architectural Patterns

**Authentication Flow**:
- NextAuth.js configuration in `src/lib/nextauth.config.ts` 
- Database session strategy with PrismaAdapter
- Session verification via `getServerSession(authOptions)` pattern
- Protected routes use `ProtectedRoute` component wrapper

**GraphQL API Structure** (`apps/api/src/modules/`):
- `auth/` - JWT authentication, OAuth login/signup
- `search/` - Card search with database fallback  
- `collection/` - User collection CRUD operations
- `deck/` - Deck building, validation, AI analysis
- `pricing/` - TCGPlayer integration, smart pricing updates
- `user/` - User profiles and settings

**Database Design** (15+ tables):
- `User` - User accounts with OAuth providers
- `Card` - 18,555+ Pokemon cards with gameplay data
- `Collection` - User collections with card conditions
- `Deck` - User decks with format validation
- `DeckAnalysis` - AI analysis results (strategy, consistency, recommendations)
- `Account/Session` - NextAuth database sessions
- `CardPrice` - Historical pricing with smart update scheduling

**AI Analysis System**:
- Rule-based deck analyzer in `apps/api/src/modules/deck/deck-analyzer.service.ts`
- Strategy detection (aggro/control/combo/midrange)
- Consistency scoring algorithm (0-100 based on energy ratios)
- Card recommendation engine with priority scoring
- UI components: `DeckAnalysisCard`, `CardRecommendations`

## Production Deployment Status

**Current Phase**: AI Features Phase 1 ✅ COMPLETE (December 19, 2024)
- **Frontend**: https://pokemon-catelog-prod.vercel.app (Vercel)
- **API**: https://pokemon-catelog-prod-production.up.railway.app (Railway)  
- **Database**: Supabase PostgreSQL with 18,555+ cards imported
- **GraphQL Playground**: https://pokemon-catelog-prod-production.up.railway.app/graphql

### ✅ Completed Features
- **Rule-based deck analysis**: Strategy detection, consistency scoring, energy curve analysis
- **Card recommendation engine**: Priority-based suggestions with reasoning
- **UI components**: `DeckAnalysisCard` with visualizations, `CardRecommendations` with badges
- **Database schema**: `DeckAnalysis` table storing AI analysis results
- **GraphQL API**: `analyzeDeck` mutation, `deckAnalysis`/`deckRecommendations` queries
- **Smart pricing system**: Tiered update schedule (daily hot cards, weekly standard, monthly all)

### 🔧 Critical Issues
1. **NextAuth OAuth Redirect Loop**: 
   - Google OAuth completes but redirects back to signin page
   - Multiple comprehensive fixes attempted (authOptions, database sessions, middleware)
   - Blocks testing of deck analysis features
   - Debug endpoints available: `/test-env`, `/auth-test-comprehensive`, `/debug-oauth`

2. **TCGPlayer URL Completion**:
   - Background script updating ~12,735 remaining cards with purchase links
   - Rate-limited by Pokemon TCG API (2-second delays)
   - Affects user purchase experience but not core functionality

### 📅 Next Phase
- **Phase 2**: Collection-to-deck builder (budget optimization, owned card filtering)
- **Prerequisite**: Resolve NextAuth redirect loop to enable full testing

## Important Development Patterns

### NextAuth.js Integration
- **Configuration**: `src/lib/nextauth.config.ts` exports `authOptions`
- **Session Verification**: Always use `getServerSession(authOptions)`, never without the parameter
- **Protected Routes**: Wrap components with `<ProtectedRoute>` for auth-required pages
- **Database Sessions**: Uses PrismaAdapter with database session storage (more reliable than JWT)

### GraphQL Patterns
- **Apollo Client**: Configured in `src/lib/apollo-client.ts` with auth headers
- **Error Handling**: Uses `errorPolicy: 'all'` for graceful degradation
- **Queries**: Centralized in `src/lib/graphql/queries.ts` and `src/lib/graphql/mutations.ts`
- **Testing**: Use Apollo MockedProvider for component testing

### Database Operations
- **Schema Changes**: Always run `pnpm --filter @pokemon-catalog/database db:generate` after Prisma schema updates
- **Production Migrations**: Use `migrate:prod` for production deployments
- **Seeding**: Large datasets use scripts in `/scripts/` rather than Prisma seed files

### Component Architecture
- **shadcn/ui**: Base components in `src/components/ui/`
- **Feature Components**: Organized by domain (`deck/`, `collection/`, `pokemon/`)
- **Providers**: Wrap app with session, theme, and Apollo providers in specific order
- **Type Safety**: All components use proper TypeScript with GraphQL generated types

## Common Development Tasks

### Adding New Features
1. **Database**: Update Prisma schema → run `db:generate` → create migration
2. **API**: Add GraphQL resolvers/types → update `schema.gql`
3. **Frontend**: Create components → add GraphQL queries → integrate with UI

### Debugging Production Issues
- **Auth Issues**: Check `/test-env` and `/auth-test-comprehensive` debug pages
- **GraphQL**: Use playground at Railway API URL + `/graphql`
- **Database**: Use Prisma Studio or direct scripts in `/scripts/`
- **Pricing**: Check `pricing.service.ts` logs for TCGPlayer API issues

### Environment Configuration
**Production Environment Variables**:
```bash
DATABASE_URL=postgresql://...          # Supabase connection
NEXTAUTH_SECRET=64-byte-hex-string     # Auth secret  
NEXTAUTH_URL=https://domain.vercel.app # Exact production URL
GOOGLE_CLIENT_ID=oauth-client-id       # Google OAuth
GOOGLE_CLIENT_SECRET=oauth-secret      # Google OAuth
NEXT_PUBLIC_GRAPHQL_URL=https://api... # Railway API URL
```

## Key GraphQL Operations

```graphql
# Deck Analysis (AI Features)
mutation AnalyzeDeck($deckId: String!) {
  analyzeDeck(deckId: $deckId) {
    strategy          # "aggro", "control", "combo", "midrange"
    consistencyScore  # 0-100 integer
    energyCurve      # Array of cost distribution
    recommendations  # Array of suggestion strings
    warnings         # Array of warning strings
  }
}

# Card Search with Filtering
query SearchCards($input: SearchInput!) {
  searchCards(input: $input) {
    total
    cards {
      id name hp marketPrice tcgplayerUrl
      types rarity setName imageSmall
    }
  }
}

# User Collections
query MyCollections {
  myCollections {
    id name totalValue cardCount
    cards { 
      quantity condition language
      card { name marketPrice imageSmall }
    }
  }
}
```

## Critical Known Issues

### NextAuth OAuth Redirect Loop
**Status**: UNRESOLVED despite multiple comprehensive fix attempts
**Impact**: Blocks user authentication, preventing deck analysis testing
**Debug Tools**: 
- `/test-env` - Environment variable verification
- `/auth-test-comprehensive` - Interactive auth testing 
- `/debug-oauth` - OAuth flow debugging

**Attempted Fixes**:
- Fixed `getServerSession(authOptions)` parameter issue
- Database session strategy implementation
- Middleware exclusion of `/api/auth` routes
- VerificationToken table addition
- Google OAuth configuration verification

**Next Investigation Areas**:
- Google Cloud Console redirect URI configuration
- NextAuth v4 + Next.js 15 compatibility issues
- Production domain/CORS issues