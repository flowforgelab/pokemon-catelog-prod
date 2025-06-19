# Phase 1 Testing Guide

## Backend Testing

### 1. Unit Tests
```bash
cd apps/api
pnpm test deck-analyzer.service.spec.ts
pnpm test recommendation.service.spec.ts
```

### 2. GraphQL Playground Testing
Start the API server:
```bash
cd apps/api
pnpm dev
```

Visit http://localhost:3001/graphql and test these queries:

```graphql
# First, get a deck ID from your user
query MyDecks {
  myDecks {
    id
    name
    format
  }
}

# Analyze a deck
mutation AnalyzeDeck {
  analyzeDeck(id: "YOUR_DECK_ID") {
    id
    strategy
    consistencyScore
    energyCurve
    recommendations
    warnings
  }
}

# Get recommendations
query GetRecommendations {
  deckRecommendations(id: "YOUR_DECK_ID") {
    card {
      id
      name
      marketPrice
    }
    reasoning
    priority
    synergies
  }
}
```

## Frontend Testing

### 1. Manual UI Testing
```bash
cd apps/web
pnpm dev
```

1. Navigate to /decks
2. Select or create a deck
3. Click "Analyze Deck" button
4. Verify:
   - Analysis card shows strategy badge
   - Consistency score displays correctly
   - Energy curve chart renders
   - Warnings/recommendations appear

### 2. Component Testing
Create test deck data:
```bash
cd apps/web
# Create a test file to verify components render
```

## Integration Testing Checklist

- [ ] Create a new deck with mixed Pokemon types
- [ ] Add 10-15 cards of various types
- [ ] Run deck analysis
- [ ] Verify strategy detection matches deck composition
- [ ] Check consistency score reflects deck balance
- [ ] Confirm energy curve visualization is accurate
- [ ] Test recommendations appear for incomplete decks
- [ ] Verify warnings show for rule violations

## Quick Smoke Test Script
```bash
# From project root
cd apps/api && pnpm test
cd ../web && pnpm build
```

## Common Issues to Check

1. **Database Connection**: Ensure DeckAnalysis table was created
2. **GraphQL Schema**: Verify new types are exposed
3. **UI State**: Check loading/error states in components
4. **Edge Cases**: Test with empty decks, single card, 100+ cards