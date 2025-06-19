# Phase 1 QA Test Plan

## Test Scope
Testing rule-based deck analysis and recommendation features

## Test Environment
- API: Local (http://localhost:3001)
- Database: Production Supabase
- Frontend: Local (http://localhost:3000)

## Test Cases

### TC-001: Deck Analysis - Empty Deck
**Precondition**: User has an empty deck
**Steps**:
1. Call analyzeDeck mutation with empty deck ID
**Expected**: 
- Strategy: midrange (default)
- ConsistencyScore: 0
- Warnings: "Deck must be exactly 60 cards (currently 0)"

### TC-002: Deck Analysis - Aggro Detection
**Precondition**: Deck with low-cost Pokemon (HP < 90)
**Steps**:
1. Create deck with 12 low HP Pokemon, 12 energy, 8 trainers
2. Call analyzeDeck mutation
**Expected**:
- Strategy: aggro
- ConsistencyScore: > 60
- Energy curve weighted toward 0-2 cost

### TC-003: Deck Analysis - Control Detection  
**Precondition**: Deck with high HP Pokemon (HP > 180)
**Steps**:
1. Create deck with high HP Pokemon and disruption trainers
2. Call analyzeDeck mutation
**Expected**:
- Strategy: control
- Energy curve weighted toward 3-5 cost

### TC-004: Deck Analysis - Consistency Scoring
**Precondition**: Well-balanced deck
**Steps**:
1. Create deck with 10 Pokemon, 14 Energy, 25 Trainers (single type)
2. Call analyzeDeck mutation
**Expected**:
- ConsistencyScore: 80-95
- No warnings about ratios

### TC-005: Deck Analysis - Multi-Type Penalty
**Precondition**: Deck with 4+ energy types
**Steps**:
1. Create deck with Pokemon of 4 different types
2. Call analyzeDeck mutation  
**Expected**:
- ConsistencyScore: < 50
- Warning: "Consider reducing energy types for consistency"

### TC-006: Recommendations - Missing Draw Power
**Precondition**: Deck with < 8 draw support cards
**Steps**:
1. Create deck without Professor's Research
2. Call deckRecommendations query
**Expected**:
- Recommendation for Professor's Research with priority: high
- Reasoning mentions "draw support"

### TC-007: Recommendations - Low Energy
**Precondition**: Deck with < 12 energy
**Steps**:
1. Create deck with only 8 energy cards
2. Call deckRecommendations query
**Expected**:
- Recommendations for basic energy matching deck types
- Priority: medium

### TC-008: Deck Validation - 4-Card Rule
**Precondition**: Deck with 5 copies of a card
**Steps**:
1. Add 5 copies of non-energy card
2. Call analyzeDeck mutation
**Expected**:
- Warning: "Too many copies of [card name] (max 4 allowed)"

### TC-009: Deck Validation - Format Legality
**Precondition**: Standard deck with non-standard cards
**Steps**:
1. Add expanded-only cards to standard deck
2. Analyze deck
**Expected**:
- Warnings about illegal cards

### TC-010: UI Integration - Analysis Display
**Precondition**: Analyzed deck exists
**Steps**:
1. Navigate to deck detail page
2. View analysis section
**Expected**:
- Strategy badge displays with correct color
- Energy curve chart renders
- Consistency score shows as progress bar

## Test Data Setup
```javascript
// Test deck configurations
const testDecks = {
  aggro: {
    pokemon: 12, // all low HP
    energy: 14,
    trainers: 34
  },
  control: {
    pokemon: 8, // all high HP
    energy: 16,
    trainers: 36
  },
  combo: {
    pokemon: 10, // evolution lines
    energy: 12,
    trainers: 38 // many search cards
  }
}
```

## Automation Potential
- GraphQL query automation via Jest
- Snapshot testing for UI components
- Property-based testing for deck analyzer logic