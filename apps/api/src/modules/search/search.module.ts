import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchResolver } from './search.resolver'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
  ],
  providers: [SearchService, SearchResolver],
  exports: [SearchService],
})
export class SearchModule {}