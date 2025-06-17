import { Card } from './pokemon'

export type DeckFormat = 'standard' | 'expanded' | 'unlimited'

export interface Deck {
  id: string
  userId: string
  name: string
  description?: string
  format: DeckFormat
  isPublic: boolean
  cards?: DeckCard[]
  cardCount?: number
  pokemonCount?: number
  trainerCount?: number
  energyCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface DeckCard {
  id: string
  deckId: string
  cardId: string
  card?: Card
  quantity: number
}

export interface CreateDeckInput {
  name: string
  description?: string
  format: DeckFormat
  isPublic?: boolean
}

export interface AddCardToDeckInput {
  deckId: string
  cardId: string
  quantity: number
}

export interface DeckValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  cardCount: number
  pokemonCount: number
  trainerCount: number
  energyCount: number
}

export interface DeckStats {
  types: { type: string; count: number }[]
  energyCost: { type: string; count: number }[]
  averageRetreatCost: number
  prizeCardCount: number
}