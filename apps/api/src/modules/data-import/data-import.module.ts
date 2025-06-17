import { Module } from '@nestjs/common'
import { PokemonImportService } from './pokemon-import.service'
import { PrismaService } from '../../common/prisma.service'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
    }),
  ],
  providers: [PokemonImportService, PrismaService],
  exports: [PokemonImportService],
})
export class DataImportModule {}