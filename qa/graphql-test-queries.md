# GraphQL Test Queries for Phase 1

## Test Authentication First
```graphql
query TestAuth {
  me {
    id
    email
  }
}
```

## TC-001: Empty Deck Analysis
```graphql
mutation TestEmptyDeck {
  analyzeDeck(id: "70ad357e-2c12-49a4-a26d-f026a5753b45") {
    id
    strategy
    consistencyScore
    energyCurve
    recommendations
    warnings
  }
}
```
**Expected**: 
- consistencyScore: 0
- warnings includes "Deck must be exactly 60 cards"

## TC-002: Aggro Deck Analysis  
```graphql
mutation TestAggroDeck {
  analyzeDeck(id: "e907402d-a074-4453-acf1-ad1f303d4602") {
    id
    strategy
    consistencyScore
    energyCurve
    recommendations
    warnings
  }
}
```
**Expected**:
- strategy: "aggro"
- consistencyScore: > 60
- energyCurve weighted toward low costs

## TC-003: Control Deck Analysis
```graphql
mutation TestControlDeck {
  analyzeDeck(id: "be45a5f4-2dea-4d8e-beb0-c8157d467365") {
    id
    strategy
    consistencyScore
    energyCurve
    recommendations
    warnings
  }
}
```
**Expected**:
- strategy: "control"
- Higher energy curve values

## TC-004: 4-Card Rule Validation
```graphql
mutation Test4CardRule {
  analyzeDeck(id: "e9940dd1-0486-47c9-873e-1bcf807b7532") {
    warnings
  }
}
```
**Expected**:
- warnings includes "Too many copies of Caterpie (max 4 allowed)"

## TC-005: Multi-Type Consistency
```graphql
mutation TestMultiType {
  analyzeDeck(id: "652d7a49-c5bd-4454-bffd-dbd5902658bc") {
    consistencyScore
    warnings
  }
}
```
**Expected**:
- consistencyScore: < 50
- warnings includes "Consider reducing energy types"

## TC-006: Get Recommendations
```graphql
query TestRecommendations {
  deckRecommendations(id: "e907402d-a074-4453-acf1-ad1f303d4602") {
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
**Expected**:
- Array of recommendations
- Each has reasoning and priority

## TC-007: Check Saved Analysis
```graphql
query GetSavedAnalysis {
  deckAnalysis(id: "e907402d-a074-4453-acf1-ad1f303d4602") {
    id
    strategy
    consistencyScore
    createdAt
  }
}
```
**Expected**:
- Returns previously saved analysis