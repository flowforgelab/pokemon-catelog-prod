import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { PokemonImportService } from '../modules/data-import/pokemon-import.service'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const importService = app.get(PokemonImportService)
  
  console.log('Creating Elasticsearch index...')
  await importService.createElasticsearchIndex()
  
  console.log('Starting card import...')
  const result = await importService.importAllCards()
  
  console.log('Import completed:', result)
  await app.close()
}

bootstrap().catch(console.error)