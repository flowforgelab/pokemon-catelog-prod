import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('test')
  async testSearch(@Query('q') query: string = '') {
    console.log('Test search endpoint called with query:', query);
    const result = await this.searchService.searchCards({
      query,
      page: 1,
      limit: 5
    });
    return result;
  }
}