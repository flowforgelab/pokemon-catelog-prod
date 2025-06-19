import { ObjectType, Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { Card } from '../search/entities/card.entity'

export enum DeckFormat {
  STANDARD = 'standard',
  EXPANDED = 'expanded',
  UNLIMITED = 'unlimited'
}

export enum DeckStrategy {
  AGGRO = 'aggro',
  CONTROL = 'control',
  COMBO = 'combo',
  MIDRANGE = 'midrange'
}

registerEnumType(DeckFormat, { name: 'DeckFormat' })
registerEnumType(DeckStrategy, { name: 'DeckStrategy' })

@ObjectType()
export class Deck {
  @Field()
  id: string

  @Field()
  userId: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field(() => DeckFormat)
  format: DeckFormat

  @Field()
  isPublic: boolean

  @Field(() => [DeckCard], { nullable: true })
  cards?: DeckCard[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class DeckCard {
  @Field()
  id: string

  @Field()
  deckId: string

  @Field()
  cardId: string

  @Field(() => Card, { nullable: true })
  card?: Card

  @Field(() => Int)
  quantity: number
}

@ObjectType()
export class DeckStats {
  @Field(() => Int)
  totalCards: number

  @Field(() => Int)
  pokemonCount: number

  @Field(() => Int)
  trainerCount: number

  @Field(() => Int)
  energyCount: number
}

@ObjectType()
export class DeckValidation {
  @Field()
  valid: boolean

  @Field(() => [String])
  issues: string[]

  @Field(() => DeckStats)
  stats: DeckStats
}

@InputType()
export class CreateDeckInput {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field(() => DeckFormat)
  format: DeckFormat
}

@InputType()
export class UpdateDeckInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  isPublic?: boolean
}

@ObjectType()
export class DeckAnalysis {
  @Field()
  id: string

  @Field(() => DeckStrategy)
  strategy: DeckStrategy

  @Field(() => Int)
  consistencyScore: number

  @Field(() => [Int])
  energyCurve: number[]

  @Field(() => [String])
  recommendations: string[]

  @Field(() => [String])
  warnings: string[]

  @Field()
  createdAt: Date
}

@ObjectType()
export class CardRecommendation {
  @Field(() => Card)
  card: Card

  @Field()
  reasoning: string

  @Field()
  priority: string

  @Field(() => Card, { nullable: true })
  replacementFor?: Card

  @Field(() => [String])
  synergies: string[]
}