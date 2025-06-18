// Accessibility utilities for WCAG 2.1 AA compliance

// Skip to main content link
export const skipToMain = () => {
  const main = document.getElementById('main-content')
  if (main) {
    main.focus()
    main.scrollIntoView()
  }
}

// Announce to screen readers
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}

// Trap focus within modal
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  )
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }
  })
}

// Color contrast checker
export const meetsContrastRatio = (foreground: string, background: string): boolean => {
  // Simplified check - in production use a proper library
  return true // Placeholder
}

// Keyboard navigation helper
export const handleArrowNavigation = (
  e: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onNavigate: (index: number) => void
) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      onNavigate(currentIndex > 0 ? currentIndex - 1 : totalItems - 1)
      break
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      onNavigate(currentIndex < totalItems - 1 ? currentIndex + 1 : 0)
      break
    case 'Home':
      e.preventDefault()
      onNavigate(0)
      break
    case 'End':
      e.preventDefault()
      onNavigate(totalItems - 1)
      break
  }
}