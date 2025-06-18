import { Resolver, Query, Args } from '@nestjs/graphql'
import { PricingService } from './pricing.service'
import { PriceFreshness, PriceHistory } from './pricing.types'

@Resolver()
export class PricingResolver {
  constructor(private pricingService: PricingService) {}

  @Query(() => PriceFreshness)
  async cardPriceFreshness(@Args('cardId') cardId: string) {
    return this.pricingService.getCardPriceFreshness(cardId)
  }

  @Query(() => [PriceHistory])
  async cardPriceHistory(
    @Args('cardId') cardId: string,
    @Args('days', { type: () => Number, nullable: true, defaultValue: 30 }) days: number
  ) {
    return this.pricingService.getCardPriceHistory(cardId, days)
  }
}