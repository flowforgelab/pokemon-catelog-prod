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

  async fetchPriceForCard(tcgplayerProductId: string) {
    try {
      // Note: TCGPlayer API requires authentication
      // This is a simplified example - in production you'd need proper API keys
      const apiKey = process.env.TCGPLAYER_API_KEY
      
      if (!apiKey) {
        this.logger.warn('TCGPlayer API key not configured')
        return null
      }

      const response = await firstValueFrom(
        this.httpService.get(
          `https://api.tcgplayer.com/pricing/product/${tcgplayerProductId}`,
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          }
        )
      )

      const priceData = response.data.results[0]
      
      return {
        marketPrice: priceData.marketPrice,
        lowPrice: priceData.lowPrice,
        midPrice: priceData.midPrice,
        highPrice: priceData.highPrice,
        directLow: priceData.directLowPrice,
      }
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${tcgplayerProductId}:`, error)
      return null
    }
  }

  async updateCardPrice(cardId: string, tcgplayerProductId: string) {
    const priceData = await this.fetchPriceForCard(tcgplayerProductId)
    
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
        tcgplayerUrl: true,
      },
    })

    for (const card of cards) {
      // Extract product ID from URL
      const match = card.tcgplayerUrl?.match(/product\/(\d+)/)
      if (match) {
        await this.updateCardPrice(card.id, match[1])
      }
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