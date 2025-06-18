# Pokemon Catalog Design System

## Component Architecture

### Core Principles

1. **Composability**: Components should be small, focused, and composable
2. **Accessibility**: All components must be keyboard navigable and screen reader friendly
3. **Consistency**: Use design tokens for all styling decisions
4. **Performance**: Components should be optimized for rendering performance
5. **Type Safety**: Full TypeScript support with proper prop types

### Component Categories

#### 1. Primitives
Basic building blocks with minimal styling and maximum flexibility.

- **Button**: Interactive element for actions
- **Input**: Text input fields
- **Label**: Form labels
- **Checkbox**: Boolean selection
- **Radio**: Single selection from multiple options
- **Switch**: Toggle between two states
- **Textarea**: Multi-line text input

#### 2. Layout Components
Components for structuring pages and content.

- **Container**: Max-width content wrapper
- **Grid**: Responsive grid system
- **Stack**: Vertical/horizontal spacing utility
- **Separator**: Visual divider
- **AspectRatio**: Maintain aspect ratios
- **ScrollArea**: Custom scrollable areas

#### 3. Navigation
Components for navigating the application.

- **Navbar**: Main navigation bar
- **Sidebar**: Side navigation
- **Breadcrumb**: Path navigation
- **Tabs**: Tab-based navigation
- **NavigationMenu**: Dropdown navigation
- **Link**: Styled links

#### 4. Data Display
Components for displaying information.

- **Card**: Content container with styles
- **Table**: Data tables with sorting/filtering
- **Badge**: Status indicators
- **Avatar**: User/Pokemon avatars
- **Progress**: Progress indicators
- **Skeleton**: Loading placeholders

#### 5. Feedback
Components for user feedback and notifications.

- **Toast**: Temporary notifications
- **Alert**: Inline notifications
- **Dialog**: Modal dialogs
- **Sheet**: Slide-out panels
- **Tooltip**: Hover information
- **Popover**: Click-triggered overlays

#### 6. Pokemon-Specific
Custom components for Pokemon data.

- **PokemonCard**: Display Pokemon cards
- **TypeBadge**: Pokemon type indicators
- **StatBar**: Pokemon stat displays
- **MoveList**: Pokemon moves display
- **EvolutionChain**: Evolution visualization
- **SetSymbol**: Card set symbols

### Component Structure

```
src/components/
├── ui/                    # Generic UI components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── pokemon/              # Pokemon-specific components
│   ├── pokemon-card.tsx
│   ├── type-badge.tsx
│   └── ...
├── layout/               # Layout components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── ...
└── providers/            # Context providers
    ├── theme-provider.tsx
    └── ...
```

### Styling Approach

1. **Design Tokens First**: Always use CSS variables from design-tokens.css
2. **Utility Classes**: Use Tailwind utilities for spacing, layout
3. **Component Variants**: Use CVA (class-variance-authority) for variants
4. **Responsive**: Mobile-first responsive design
5. **Dark Mode**: All components support dark mode

### Component Template

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        secondary: 'secondary-classes',
      },
      size: {
        default: 'size-default',
        sm: 'size-sm',
        lg: 'size-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Component.displayName = 'Component'

export { Component, componentVariants }
```

### Animation Guidelines

1. **Subtle**: Animations should enhance, not distract
2. **Consistent**: Use predefined transitions from design tokens
3. **Performance**: Use transform and opacity for animations
4. **Accessibility**: Respect prefers-reduced-motion

### Accessibility Checklist

- [ ] Keyboard navigation works
- [ ] ARIA labels are present
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announces correctly
- [ ] No keyboard traps
- [ ] Interactive elements are 44x44px minimum

### Testing Strategy

1. **Unit Tests**: Test component logic
2. **Visual Tests**: Storybook for component states
3. **Accessibility Tests**: Automated a11y testing
4. **Integration Tests**: Test component interactions
5. **Performance Tests**: Measure render performance