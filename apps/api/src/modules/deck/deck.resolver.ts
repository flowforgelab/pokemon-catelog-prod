import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { DeckService } from './deck.service'
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard'
import { Deck, DeckCard, DeckValidation, CreateDeckInput, UpdateDeckInput } from './deck.types'

@Resolver(() => Deck)
@UseGuards(GqlAuthGuard)
export class DeckResolver {
  constructor(private deckService: DeckService) {}

  @Query(() => [Deck])
  async myDecks(@Context() ctx) {
    return this.deckService.getDecks(ctx.req.user.id)
  }

  @Query(() => Deck)
  async deck(@Args('id') id: string, @Context() ctx) {
    return this.deckService.getDeck(id, ctx.req.user.id)
  }

  @Query(() => DeckValidation)
  async validateDeck(@Args('id') id: string) {
    return this.deckService.validateDeck(id)
  }

  @Query(() => String)
  async exportDeck(@Args('id') id: string, @Context() ctx) {
    return this.deckService.exportDeck(id, ctx.req.user.id)
  }

  @Mutation(() => Deck)
  async createDeck(@Args('input') input: CreateDeckInput, @Context() ctx) {
    return this.deckService.createDeck(
      ctx.req.user.id,
      input.name,
      input.format,
      input.description
    )
  }

  @Mutation(() => Deck)
  async updateDeck(
    @Args('id') id: string,
    @Args('input') input: UpdateDeckInput,
    @Context() ctx
  ) {
    return this.deckService.updateDeck(id, ctx.req.user.id, input)
  }

  @Mutation(() => Deck)
  async deleteDeck(@Args('id') id: string, @Context() ctx) {
    return this.deckService.deleteDeck(id, ctx.req.user.id)
  }

  @Mutation(() => DeckCard)
  async addCardToDeck(
    @Args('deckId') deckId: string,
    @Args('cardId') cardId: string,
    @Args('quantity', { nullable: true, defaultValue: 1 }) quantity: number,
    @Context() ctx
  ) {
    return this.deckService.addCard(deckId, cardId, ctx.req.user.id, quantity)
  }

  @Mutation(() => DeckCard)
  async removeCardFromDeck(
    @Args('deckId') deckId: string,
    @Args('cardId') cardId: string,
    @Args('quantity', { nullable: true, defaultValue: 1 }) quantity: number,
    @Context() ctx
  ) {
    return this.deckService.removeCard(deckId, cardId, ctx.req.user.id, quantity)
  }
}