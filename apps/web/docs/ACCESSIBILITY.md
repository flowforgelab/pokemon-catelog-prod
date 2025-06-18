# Pokemon Catalog - Accessibility Guidelines (WCAG 2.1 AA)

## Core Principles

### 1. Perceivable
- All images have alt text
- Color is not the only indicator
- Contrast ratio 4.5:1 (normal), 3:1 (large text)
- Captions for videos

### 2. Operable  
- Keyboard accessible
- No keyboard traps
- Skip links
- Focus indicators
- Touch targets 44x44px

### 3. Understandable
- Clear labels
- Error messages
- Consistent navigation
- Predictable functionality

### 4. Robust
- Valid HTML
- ARIA when needed
- Works with screen readers

## Implementation Checklist

### Global
- [x] Skip to main content link
- [x] Focus management utilities
- [x] Screen reader announcements
- [x] Keyboard navigation helpers
- [x] High contrast mode support via CSS variables

### Components

#### Navigation
- Focus trap in mobile menu
- Escape key closes menu
- Arrow keys for dropdown navigation
```tsx
<nav role="navigation" aria-label="Main">
  <button aria-expanded={isOpen} aria-controls="mobile-menu">
    Menu
  </button>
</nav>
```

#### Cards
- Semantic HTML structure
- Keyboard interactive
- Screen reader friendly
```tsx
<article role="article" aria-label={`Pokemon card ${name}`}>
  <img alt={`${name} Pokemon card`} />
  <h3>{name}</h3>
  <p>Price: <span aria-label={`${price} dollars`}>${price}</span></p>
</article>
```

#### Forms
- Label association
- Error messages linked
- Required field indicators
```tsx
<div role="group" aria-labelledby="deck-format">
  <label id="deck-format">Deck Format</label>
  <input aria-describedby="format-error" aria-invalid={hasError} />
  <span id="format-error" role="alert">{error}</span>
</div>
```

#### Modals
- Focus trap
- Escape key closes
- Return focus on close
```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">{title}</h2>
  <button aria-label="Close dialog">×</button>
</div>
```

## Testing Tools

### Automated
- axe DevTools
- WAVE
- Lighthouse

### Manual
- Keyboard only navigation
- Screen reader testing (NVDA/JAWS)
- Color contrast analyzer
- Mobile device testing

## Common Patterns

### Loading States
```tsx
<div role="status" aria-live="polite">
  <span className="sr-only">Loading Pokemon cards...</span>
  <Skeleton />
</div>
```

### Dynamic Content
```tsx
<div aria-live="polite" aria-atomic="true">
  <p>{updatedPrice} - Updated {timeAgo}</p>
</div>
```

### Icon Buttons
```tsx
<button aria-label="Add to favorites">
  <Heart className="h-4 w-4" />
</button>
```

## Keyboard Shortcuts

### Global
- `/` - Focus search
- `Escape` - Close modal/menu
- `Tab` - Navigate forward
- `Shift+Tab` - Navigate backward

### Grid Navigation
- `Arrow keys` - Navigate cards
- `Enter` - Select card
- `Space` - Quick view
- `Home/End` - First/last card

## Screen Reader Announcements

### Price Changes
"Charizard price increased by 12 percent to 399 dollars"

### Collection Updates  
"Pikachu added to collection. You now have 2 copies"

### Form Validation
"Error: Deck must contain exactly 60 cards. Currently 58 cards"

## Mobile Accessibility

### Touch Targets
- Minimum 44x44px
- 8px spacing between targets
- Grouped actions in cards

### Gestures
- All gestures have tap alternatives
- No complex gestures required
- Swipe actions clearly indicated

## Testing Checklist

- [ ] Tab through entire page
- [ ] Use screen reader on all pages
- [ ] Test with keyboard only
- [ ] Verify focus indicators
- [ ] Check color contrast
- [ ] Test error messages
- [ ] Verify form labels
- [ ] Test with 200% zoom
- [ ] Check touch targets
- [ ] Test on mobile devices