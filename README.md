# Pokemon Card Catalog - Production Version

A full-featured Pokemon TCG collection manager and deck builder with real-time pricing, social features, and mobile support.

## 🚀 Features

### Core Features
- **User Authentication** - OAuth and email/password login
- **Collection Management** - Track your cards with condition and language
- **Deck Building** - Create and share competitive decks
- **Advanced Search** - Elasticsearch-powered search with filters
- **Real-time Pricing** - TCGPlayer and Cardmarket integration
- **Trading System** - Post trades and make offers
- **Social Features** - Follow users and share collections

### Technical Features
- **Monorepo Architecture** - Turborepo for efficient builds
- **Type Safety** - Full TypeScript coverage
- **GraphQL API** - Type-safe API with code generation
- **Real-time Updates** - WebSocket subscriptions
- **Optimized Images** - Cloudinary integration
- **Mobile App** - React Native for iOS/Android

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, GraphQL, Prisma
- **Database**: PostgreSQL, Redis, Elasticsearch
- **Mobile**: React Native
- **Infrastructure**: Docker, AWS, GitHub Actions

## 📦 Project Structure

```
pokemon-catalog-production/
├── apps/
│   ├── web/              # Next.js web app
│   ├── api/              # NestJS GraphQL API
│   └── mobile/           # React Native app
├── packages/
│   ├── database/         # Prisma schemas
│   ├── shared/           # Shared types/utils
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs
├── docker/               # Docker configs
└── scripts/              # Build scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker Desktop
- PostgreSQL 15+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokemon-catalog-production
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

4. Start Docker services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
pnpm db:migrate
```

6. Start development servers:
```bash
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run tests across all apps
- `pnpm lint` - Lint all apps
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## 📱 Mobile Development

To run the React Native app:

```bash
cd apps/mobile
pnpm ios     # For iOS
pnpm android # For Android
```

## 🧪 Testing

Run tests with:
```bash
pnpm test           # Run all tests
pnpm test:e2e       # Run E2E tests
pnpm test:coverage  # Generate coverage report
```

## 📊 Database Schema

Key tables:
- `users` - User accounts
- `cards` - Pokemon card data
- `collections` - User collections
- `decks` - User-created decks
- `prices` - Historical pricing
- `trades` - Trade listings

## 🔒 Security

- JWT authentication with refresh tokens
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection via Prisma
- XSS prevention
- CORS properly configured

## 🚀 Deployment

### Production Build

```bash
pnpm build
```

### Docker Production

```bash
docker build -t pokemon-catalog .
docker run -p 3000:3000 pokemon-catalog
```

### Environment Variables

See `.env.example` for all required variables.

## 📝 API Documentation

GraphQL playground available at http://localhost:3001/graphql

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with conventional commits
4. Push to your fork
5. Open a pull request

## 📄 License

Private and confidential. All rights reserved.

## 🙏 Credits

- Pokemon TCG API for card data
- TCGPlayer for pricing data
- Pokemon and all related names are trademarks of Nintendo/Game Freak