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
      const PokemonTCG = require('pokemon-tcg-sdk-typescript').PokemonTCG
      const card = await PokemonTCG.findCardByID(cardId)
      
      if (!card?.tcgplayer?.prices) {
        this.logger.warn(`No price data available for card ${cardId}`)
        return null
      }

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

  async updateCardPrice(cardId: string, lastPriceUpdate?: Date) {
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

    // Update card's last price update timestamp
    await this.prisma.card.update({
      where: { id: cardId },
      data: { updatedAt: new Date() }
    })

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

    for (const alert of alerts) {
      this.logger.log(`Price alert triggered for user ${alert.user.email}`)
      // TODO: Send notification
    }
  }

  // Smart priority-based price updates
  async getCardsForUpdate(tier: 'hot' | 'active' | 'standard' | 'all') {
    const now = new Date()
    const queries = {
      hot: {
        where: {
          OR: [
            { marketPrice: { gte: 50 } },
            { releaseDate: { gte: new Date(now.setDate(now.getDate() - 30)) } },
            { collections: { some: {} } }, // Cards in collections
          ],
          updatedAt: { lt: new Date(now.setHours(now.getHours() - 24)) }
        },
        take: 1000
      },
      active: {
        where: {
          standardLegal: true,
          marketPrice: { gte: 10, lt: 50 },
          updatedAt: { lt: new Date(now.setDate(now.getDate() - 3)) }
        },
        take: 2000
      },
      standard: {
        where: {
          standardLegal: true,
          updatedAt: { lt: new Date(now.setDate(now.getDate() - 7)) }
        },
        take: 5000
      },
      all: {
        where: {
          updatedAt: { lt: new Date(now.setDate(now.getDate() - 30)) }
        },
        take: 10000
      }
    }

    return this.prisma.card.findMany({
      ...queries[tier],
      select: {
        id: true,
        tcgId: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'asc' }
    })
  }

  // Optimized batch update without unnecessary delays
  async updatePriceBatch(cards: { tcgId: string; updatedAt: Date }[], delayMs = 50) {
    let updated = 0
    const results = []

    for (const card of cards) {
      try {
        const result = await this.updateCardPrice(card.tcgId, card.updatedAt)
        if (result) {
          results.push(result)
          updated++
        }
        
        // Minimal delay only if needed
        if (delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs))
        }
      } catch (error) {
        this.logger.error(`Failed to update price for ${card.tcgId}:`, error)
      }
    }

    return { updated, total: cards.length }
  }

  // Daily hot cards update
  @Cron('0 2 * * *') // 2 AM
  async updateHotCards() {
    this.logger.log('Updating hot card prices...')
    const cards = await this.getCardsForUpdate('hot')
    const result = await this.updatePriceBatch(cards)
    this.logger.log(`Updated ${result.updated}/${result.total} hot card prices`)
  }

  // Active cards every 3 days
  @Cron('0 3 */3 * *') // 3 AM every 3 days
  async updateActiveCards() {
    this.logger.log('Updating active card prices...')
    const cards = await this.getCardsForUpdate('active')
    const result = await this.updatePriceBatch(cards)
    this.logger.log(`Updated ${result.updated}/${result.total} active card prices`)
  }

  // Weekly standard update
  @Cron('0 4 * * 0') // 4 AM on Sundays
  async updateStandardCards() {
    this.logger.log('Updating standard card prices...')
    const cards = await this.getCardsForUpdate('standard')
    const result = await this.updatePriceBatch(cards)
    this.logger.log(`Updated ${result.updated}/${result.total} standard card prices`)
  }

  // Monthly full catalog
  @Cron('0 5 1 * *') // 5 AM on the 1st of each month
  async updateAllCards() {
    this.logger.log('Updating all card prices...')
    const cards = await this.getCardsForUpdate('all')
    const result = await this.updatePriceBatch(cards)
    this.logger.log(`Updated ${result.updated}/${result.total} card prices`)
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

  // Get price freshness for a card
  async getCardPriceFreshness(cardId: string) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { updatedAt: true }
    })

    if (!card) return null

    const now = new Date()
    const daysSinceUpdate = Math.floor((now.getTime() - card.updatedAt.getTime()) / (1000 * 60 * 60 * 24))

    return {
      lastUpdate: card.updatedAt,
      daysSinceUpdate,
      freshness: daysSinceUpdate <= 1 ? 'fresh' : daysSinceUpdate <= 7 ? 'recent' : 'stale'
    }
  }
}