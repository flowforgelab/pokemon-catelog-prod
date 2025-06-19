import { Resolver, Query, Args } from '@nestjs/graphql'
import { UseInterceptors } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchInput } from './dto/search.input'
import { SearchResult } from './entities/search-result.entity'
import { CardSuggestion } from './entities/card-suggestion.entity'
import { Card } from './entities/card.entity'
import { CacheInterceptor } from '../../common/cache.interceptor'

@Resolver()
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResult)
  @UseInterceptors(CacheInterceptor)
  async searchCards(@Args('input') input: SearchInput) {
    console.log('=== GRAPHQL RESOLVER DEBUG ===');
    console.log('SearchResolver.searchCards called');
    console.log('Raw input:', input);
    console.log('Input as JSON:', JSON.stringify(input));
    console.log('Input type:', typeof input);
    console.log('Input constructor:', input?.constructor?.name);
    console.log('Input keys:', Object.keys(input || {}));
    console.log('Input.query value:', input?.query);
    console.log('Input.query type:', typeof input?.query);
    console.log('=== END DEBUG ===');
    
    const result = await this.searchService.searchCards(input);
    console.log('SearchResolver.searchCards returning:', JSON.stringify({
      total: result.total,
      cardsCount: result.cards?.length || 0,
      firstCard: result.cards?.[0]?.name || 'none',
      searchQuery: input.query || 'none'
    }));
    return result;
  }

  @Query(() => [CardSuggestion])
  async cardSuggestions(@Args('query') query: string) {
    return this.searchService.getSuggestions(query)
  }

  @Query(() => Card, { nullable: true })
  @UseInterceptors(CacheInterceptor)
  async card(@Args('id') id: string) {
    return this.searchService.getCardById(id)
  }
}