import { ObjectType, Field, Int, Float } from '@nestjs/graphql'
import { GraphQLJSON } from 'graphql-type-json'

@ObjectType()
export class Card {
  @Field()
  id: string

  @Field()
  tcgId: string

  @Field()
  name: string

  @Field()
  supertype: string

  @Field(() => [String], { nullable: true })
  subtypes?: string[]

  @Field(() => [String], { nullable: true })
  types?: string[]

  @Field(() => Int, { nullable: true })
  hp?: number

  @Field(() => [String], { nullable: true })
  retreatCost?: string[]

  @Field({ nullable: true })
  setId?: string

  @Field({ nullable: true })
  setName?: string

  @Field({ nullable: true })
  number?: string

  @Field({ nullable: true })
  artist?: string

  @Field({ nullable: true })
  rarity?: string

  @Field({ nullable: true })
  flavorText?: string

  @Field({ nullable: true })
  imageUrl?: string

  @Field({ nullable: true })
  imageUrlHiRes?: string

  @Field({ nullable: true })
  tcgplayerUrl?: string

  @Field({ nullable: true })
  cardmarketUrl?: string

  @Field(() => GraphQLJSON, { nullable: true })
  abilities?: any[]

  @Field(() => GraphQLJSON, { nullable: true })
  attacks?: any[]

  @Field(() => GraphQLJSON, { nullable: true })
  weaknesses?: any[]

  @Field(() => GraphQLJSON, { nullable: true })
  resistances?: any[]

  @Field()
  standardLegal: boolean

  @Field()
  expandedLegal: boolean

  @Field(() => Float, { nullable: true })
  marketPrice?: number

  @Field(() => GraphQLJSON, { nullable: true })
  priceHistory?: any[]

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}