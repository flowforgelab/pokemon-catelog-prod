import { ObjectType, Field, Float, registerEnumType } from '@nestjs/graphql'

export enum PriceFreshnessStatus {
  FRESH = 'fresh',
  RECENT = 'recent',
  STALE = 'stale'
}

registerEnumType(PriceFreshnessStatus, {
  name: 'PriceFreshnessStatus',
})

@ObjectType()
export class PriceFreshness {
  @Field()
  lastUpdate: Date

  @Field()
  daysSinceUpdate: number

  @Field(() => PriceFreshnessStatus)
  freshness: PriceFreshnessStatus
}

@ObjectType()
export class PriceHistory {
  @Field()
  id: string

  @Field()
  cardId: string

  @Field()
  source: string

  @Field()
  condition: string

  @Field(() => Float, { nullable: true })
  marketPrice?: number

  @Field(() => Float, { nullable: true })
  lowPrice?: number

  @Field(() => Float, { nullable: true })
  midPrice?: number

  @Field(() => Float, { nullable: true })
  highPrice?: number

  @Field(() => Float, { nullable: true })
  directLow?: number

  @Field()
  recordedAt: Date
}