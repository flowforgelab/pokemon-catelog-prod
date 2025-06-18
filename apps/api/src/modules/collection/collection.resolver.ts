import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CollectionService } from './collection.service'
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard'
import { Collection, CollectionCard, CollectionValue, CreateCollectionInput, UpdateCollectionInput, AddCardInput } from './collection.types'

@Resolver(() => Collection)
@UseGuards(GqlAuthGuard)
export class CollectionResolver {
  constructor(private collectionService: CollectionService) {}

  @Query(() => [Collection])
  async myCollections(@Context() ctx) {
    return this.collectionService.getCollections(ctx.req.user.id)
  }

  @Query(() => Collection)
  async collection(@Args('id') id: string, @Context() ctx) {
    return this.collectionService.getCollection(id, ctx.req.user.id)
  }

  @Query(() => CollectionValue)
  async collectionValue(@Args('id') id: string, @Context() ctx) {
    return this.collectionService.getCollectionValue(id, ctx.req.user.id)
  }

  @Mutation(() => Collection)
  async createCollection(@Args('input') input: CreateCollectionInput, @Context() ctx) {
    return this.collectionService.createCollection(ctx.req.user.id, input.name, input.description)
  }

  @Mutation(() => Collection)
  async updateCollection(
    @Args('id') id: string,
    @Args('input') input: UpdateCollectionInput,
    @Context() ctx
  ) {
    return this.collectionService.updateCollection(id, ctx.req.user.id, input)
  }

  @Mutation(() => Collection)
  async deleteCollection(@Args('id') id: string, @Context() ctx) {
    return this.collectionService.deleteCollection(id, ctx.req.user.id)
  }

  @Mutation(() => CollectionCard)
  async addCardToCollection(@Args('input') input: AddCardInput, @Context() ctx) {
    return this.collectionService.addCard(
      input.collectionId,
      input.cardId,
      ctx.req.user.id,
      {
        quantity: input.quantity,
        condition: input.condition,
        language: input.language,
        isFirstEdition: input.isFirstEdition,
        isFoil: input.isFoil,
        notes: input.notes
      }
    )
  }

  @Mutation(() => CollectionCard)
  async removeCardFromCollection(
    @Args('collectionId') collectionId: string,
    @Args('cardId') cardId: string,
    @Args('quantity', { nullable: true, defaultValue: 1 }) quantity: number,
    @Context() ctx
  ) {
    return this.collectionService.removeCard(collectionId, cardId, ctx.req.user.id, quantity)
  }
}