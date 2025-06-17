import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { PokemonImportService } from '../data-import/pokemon-import.service'
import { PricingService } from '../pricing/pricing.service'

@Processor('sync')
export class SyncProcessor {
  private readonly logger = new Logger(SyncProcessor.name)

  constructor(
    private pokemonImportService: PokemonImportService,
    private pricingService: PricingService,
  ) {}

  @Process('sync-cards')
  async handleCardSync(job: Job) {
    this.logger.log('Starting card sync job...')
    await this.pokemonImportService.importAllCards()
    this.logger.log('Card sync completed')
  }

  @Process('sync-prices')
  async handlePriceSync(job: Job) {
    this.logger.log('Starting price sync job...')
    await this.pricingService.updateAllPrices()
    this.logger.log('Price sync completed')
  }

  @Process('full-sync')
  async handleFullSync(job: Job) {
    this.logger.log('Starting full sync job...')
    await this.pokemonImportService.importAllCards()
    await this.pricingService.updateAllPrices()
    this.logger.log('Full sync completed')
  }
}