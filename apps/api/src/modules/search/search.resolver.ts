import { Resolver, Query, Args } from '@nestjs/graphql'
import { SearchService } from './search.service'
import { SearchInput } from './dto/search.input'
import { SearchResult } from './entities/search-result.entity'
import { CardSuggestion } from './entities/card-suggestion.entity'

@Resolver()
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResult)
  async searchCards(@Args('input') input: SearchInput) {
    return this.searchService.searchCards(input)
  }

  @Query(() => [CardSuggestion])
  async cardSuggestions(@Args('query') query: string) {
    return this.searchService.getSuggestions(query)
  }
}