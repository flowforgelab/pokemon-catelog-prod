# Pokemon Catalog - Information Architecture

## Site Structure

### Primary Navigation
```
Home | Cards | Collections | Decks | Prices | Profile
```

### Secondary Navigation
```
Search | Notifications | Settings | Help
```

## Page Hierarchy

### 1. Home (/)
- Hero: Search bar + featured cards
- Trending prices
- Recent activity
- Quick stats

### 2. Cards (/cards)
- **/cards** - Browse all cards
  - Filters: Set, Type, Rarity, Price range
  - Views: Grid, List, Compact
- **/cards/[id]** - Card detail
  - Image gallery
  - Price history chart
  - Market listings
  - Similar cards
- **/cards/search** - Advanced search
  - Multi-parameter search
  - Saved searches

### 3. Collections (/collections)
- **/collections** - My collections list
- **/collections/[id]** - Collection detail
  - Grid/List view toggle
  - Stats dashboard
  - Export options
- **/collections/new** - Create collection
- **/collections/import** - Bulk import

### 4. Decks (/decks)
- **/decks** - My decks list
- **/decks/[id]** - Deck detail
  - Visual deck list
  - Validation status
  - Price breakdown
- **/decks/builder** - Deck builder
  - Drag-drop interface
  - Real-time validation
- **/decks/import** - Import from PTCGO

### 5. Prices (/prices)
- **/prices** - Market overview
- **/prices/trending** - Hot cards
- **/prices/watchlist** - Price alerts

### 6. Profile (/profile)
- **/profile** - User dashboard
- **/profile/settings** - Account settings
- **/profile/[username]** - Public profile

## Data Organization

### Card Data Structure
```
Card
├── Basic Info (name, number, set)
├── Game Data (HP, types, attacks)
├── Market Data (prices, trends)
├── Images (front, back, hi-res)
└── Metadata (rarity, artist, release)
```

### Collection Structure
```
Collection
├── Metadata (name, description, privacy)
├── Cards[]
│   ├── Card reference
│   ├── Quantity
│   ├── Condition
│   └── Notes
├── Stats (count, value, completion)
└── History (added, modified)
```

## Navigation Patterns

### Global Search
- Omnipresent search bar
- Contextual search (cards, collections, users)
- Instant results dropdown
- Search history

### Breadcrumbs
```
Home > Cards > Base Set > Charizard #4
```

### Filters & Sorting
- Persistent URL parameters
- Visual filter tags
- Quick reset option
- Save filter sets

## Mobile Navigation

### Bottom Tab Bar
```
[Home] [Search] [+Add] [Collection] [Profile]
```

### Gesture Navigation
- Swipe between cards
- Pull to refresh
- Long press for quick actions
- Pinch to zoom on images

## SEO Structure

### URL Patterns
- `/cards/base-set-1/charizard` (readable URLs)
- `/users/username/collection`
- `/decks/standard/fire-deck-2024`

### Meta Structure
- Dynamic titles: "Charizard Base Set 1st Edition | Pokemon Catalog"
- Structured data for cards
- Open Graph for sharing