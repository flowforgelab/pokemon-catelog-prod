import { Card, CardCondition } from './pokemon'
import { User } from './user'

export type TradeStatus = 'open' | 'pending' | 'completed' | 'cancelled'

export interface Trade {
  id: string
  userId: string
  user?: User
  title: string
  description?: string
  status: TradeStatus
  wantCards?: TradeCard[]
  haveCards?: TradeCard[]
  createdAt: Date
  updatedAt: Date
}

export interface TradeCard {
  id: string
  cardId: string
  card?: Card
  quantity: number
  condition: CardCondition
}

export interface CreateTradeInput {
  title: string
  description?: string
  wantCards: {
    cardId: string
    quantity: number
    condition?: CardCondition
  }[]
  haveCards: {
    cardId: string
    quantity: number
    condition: CardCondition
  }[]
}

export interface TradeOffer {
  id: string
  tradeId: string
  offeredByUserId: string
  offeredCards: TradeCard[]
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  createdAt: Date
}