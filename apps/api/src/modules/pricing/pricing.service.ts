import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { PrismaService } from '../../common/prisma.service'
import { firstValueFrom } from 'rxjs'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name)

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async fetchPriceForCard(cardId: string) {
    try {
      // Use the Pokemon TCG SDK which includes cached TCGPlayer prices
      const PokemonTCG = require('pokemon-tcg-sdk-typescript').PokemonTCG
      const card = await PokemonTCG.findCardByID(cardId)
      
      if (!card?.tcgplayer?.prices) {
        this.logger.warn(`No price data available for card ${cardId}`)
        return null
      }

      // Get prices for different conditions (focusing on Near Mint)
      const prices = card.tcgplayer.prices
      const nmPrices = prices.normal || prices.holofoil || prices['1stEditionHolofoil'] || {}
      
      return {
        marketPrice: nmPrices.market || nmPrices.mid || 0,
        lowPrice: nmPrices.low || 0,
        midPrice: nmPrices.mid || 0,
        highPrice: nmPrices.high || 0,
        directLow: nmPrices.directLow || 0,
        updatedAt: card.tcgplayer.updatedAt || new Date().toISOString(),
      }
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${cardId}:`, error)
      return null
    }
  }

  async updateCardPrice(cardId: string) {
    const priceData = await this.fetchPriceForCard(cardId)
    
    if (!priceData) return null

    const priceHistory = await this.prisma.priceHistory.create({
      data: {
        cardId,
        source: 'tcgplayer',
        condition: 'NM',
        ...priceData,
      },
    })

    // Check for price alerts
    await this.checkPriceAlerts(cardId, priceData.marketPrice)

    return priceHistory
  }

  async checkPriceAlerts(cardId: string, currentPrice: number) {
    const alerts = await this.prisma.priceAlert.findMany({
      where: {
        cardId,
        isActive: true,
        OR: [
          {
            alertType: 'below',
            targetPrice: { gte: currentPrice },
          },
          {
            alertType: 'above',
            targetPrice: { lte: currentPrice },
          },
        ],
      },
      include: { user: true },
    })

    // In production, send notifications to users
    for (const alert of alerts) {
      this.logger.log(`Price alert triggered for user ${alert.user.email}`)
      // Send notification...
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateAllPrices() {
    this.logger.log('Starting daily price update...')
    
    const cards = await this.prisma.card.findMany({
      where: {
        tcgplayerUrl: { not: null },
      },
      select: {
        id: true,
        tcgId: true,
      },
      take: 100, // Limit to avoid rate limiting
    })

    for (const card of cards) {
      await this.updateCardPrice(card.tcgId)
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    this.logger.log('Price update completed')
  }

  async getCardPriceHistory(cardId: string, days = 30) {
    const since = new Date()
    since.setDate(since.getDate() - days)

    return this.prisma.priceHistory.findMany({
      where: {
        cardId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: 'asc' },
    })
  }
}