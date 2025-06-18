import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchResolver } from './search.resolver'
import { SearchController } from './search.controller'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { PrismaService } from '../../common/prisma.service'

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService, SearchResolver, PrismaService],
  exports: [SearchService],
})
export class SearchModule {}