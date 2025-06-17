import { Card, CardCondition } from './pokemon'

export interface Collection {
  id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  cards?: CollectionCard[]
  cardCount?: number
  totalValue?: number
  createdAt: Date
  updatedAt: Date
}

export interface CollectionCard {
  id: string
  collectionId: string
  cardId: string
  card?: Card
  quantity: number
  condition: CardCondition
  language: string
  isFirstEdition: boolean
  isFoil: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCollectionInput {
  name: string
  description?: string
  isPublic?: boolean
}

export interface AddCardToCollectionInput {
  collectionId: string
  cardId: string
  quantity?: number
  condition?: CardCondition
  language?: string
  isFirstEdition?: boolean
  isFoil?: boolean
  notes?: string
}

export interface UpdateCollectionCardInput {
  quantity?: number
  condition?: CardCondition
  language?: string
  isFirstEdition?: boolean
  isFoil?: boolean
  notes?: string
}

export interface CollectionStats {
  totalCards: number
  uniqueCards: number
  totalValue: number
  valueBySet: { setName: string; value: number }[]
  valueByRarity: { rarity: string; value: number }[]
  completionBySet: { setName: string; owned: number; total: number; percentage: number }[]
}