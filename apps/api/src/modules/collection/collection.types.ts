import { ObjectType, Field, InputType, Int, Float } from '@nestjs/graphql'
import { Card } from '../search/entities/card.entity'

@ObjectType()
export class Collection {
  @Field()
  id: string

  @Field()
  userId: string

  @Field()
  name: string

  @Field({ nullable: true })
  description?: string

  @Field()
  isPublic: boolean

  @Field(() => [CollectionCard], { nullable: true })
  cards?: CollectionCard[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class CollectionCard {
  @Field()
  id: string

  @Field()
  collectionId: string

  @Field()
  cardId: string

  @Field(() => Card, { nullable: true })
  card?: Card

  @Field(() => Int)
  quantity: number

  @Field()
  condition: string

  @Field()
  language: string

  @Field()
  isFirstEdition: boolean

  @Field()
  isFoil: boolean

  @Field({ nullable: true })
  notes?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ObjectType()
export class CollectionValue {
  @Field()
  collectionId: string

  @Field(() => Float)
  totalValue: number

  @Field(() => Int)
  cardCount: number

  @Field(() => Int)
  uniqueCards: number

  @Field(() => [CardValue])
  cardValues: CardValue[]
}

@ObjectType()
export class CardValue {
  @Field()
  cardId: string

  @Field()
  cardName: string

  @Field(() => Int)
  quantity: number

  @Field(() => Float, { nullable: true })
  unitPrice?: number

  @Field(() => Float)
  totalValue: number

  @Field()
  lastUpdated: Date
}

@InputType()
export class CreateCollectionInput {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string
}

@InputType()
export class UpdateCollectionInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  isPublic?: boolean
}

@InputType()
export class AddCardInput {
  @Field()
  collectionId: string

  @Field()
  cardId: string

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  quantity?: number

  @Field({ nullable: true, defaultValue: 'NM' })
  condition?: string

  @Field({ nullable: true, defaultValue: 'EN' })
  language?: string

  @Field({ nullable: true, defaultValue: false })
  isFirstEdition?: boolean

  @Field({ nullable: true, defaultValue: false })
  isFoil?: boolean

  @Field({ nullable: true })
  notes?: string
}