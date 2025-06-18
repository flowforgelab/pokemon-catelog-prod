import { Module } from '@nestjs/common'
import { SyncService } from './sync.service'
import { PrismaService } from '../../common/prisma.service'
import { BullModule } from '@nestjs/bull'
// import { SyncProcessor } from './sync.processor'
import { PokemonImportService } from '../data-import/pokemon-import.service'
import { PricingService } from '../pricing/pricing.service'
import { HttpModule } from '@nestjs/axios'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sync',
    }),
    HttpModule,
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
  ],
  providers: [SyncService, /* SyncProcessor, */ PrismaService, PokemonImportService, PricingService],
  exports: [SyncService],
})
export class SyncModule {}