import { Card, PokemonType } from './types/pokemon'
import { TYPE_COLORS } from './constants'

export function getTypeColor(type: PokemonType): string {
  return TYPE_COLORS[type] || TYPE_COLORS.Colorless
}

export function calculateDamage(
  baseDamage: number,
  attackerType: PokemonType,
  defenderType: PokemonType,
  defenderWeakness?: { type: PokemonType; value: string },
  defenderResistance?: { type: PokemonType; value: string }
): number {
  let damage = baseDamage

  // Apply weakness
  if (defenderWeakness && defenderWeakness.type === attackerType) {
    const weaknessMultiplier = defenderWeakness.value === '×2' ? 2 : 1.5
    damage = damage * weaknessMultiplier
  }

  // Apply resistance
  if (defenderResistance && defenderResistance.type === attackerType) {
    const resistanceValue = parseInt(defenderResistance.value.replace('-', ''))
    damage = Math.max(0, damage - resistanceValue)
  }

  return damage
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function validateDeckSize(cards: { quantity: number }[]): boolean {
  const totalCards = cards.reduce((sum, card) => sum + card.quantity, 0)
  return totalCards === 60
}

export function getCardImageUrl(card: Card, size: 'small' | 'large' = 'large'): string {
  return size === 'large' ? card.imageLarge : card.imageSmall
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}