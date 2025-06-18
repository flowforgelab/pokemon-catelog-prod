import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { PricingService } from '../pricing/pricing.service'

@Injectable()
export class CollectionService {
  constructor(
    private prisma: PrismaService,
    private pricingService: PricingService,
  ) {}

  async getCollections(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: {
        _count: {
          select: { cards: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async getCollection(id: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        cards: {
          include: {
            card: {
              include: {
                priceHistory: {
                  take: 1,
                  orderBy: { recordedAt: 'desc' }
                }
              }
            }
          }
        }
      }
    })

    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId && !collection.isPublic) {
      throw new ForbiddenException('Access denied')
    }

    return collection
  }

  async createCollection(userId: string, name: string, description?: string) {
    return this.prisma.collection.create({
      data: { userId, name, description }
    })
  }

  async updateCollection(id: string, userId: string, data: { name?: string; description?: string; isPublic?: boolean }) {
    const collection = await this.prisma.collection.findUnique({ where: { id } })
    
    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException('Access denied')

    return this.prisma.collection.update({
      where: { id },
      data
    })
  }

  async deleteCollection(id: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({ where: { id } })
    
    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException('Access denied')

    return this.prisma.collection.delete({ where: { id } })
  }

  async addCard(collectionId: string, cardId: string, userId: string, options?: {
    quantity?: number
    condition?: string
    language?: string
    isFirstEdition?: boolean
    isFoil?: boolean
    notes?: string
  }) {
    const collection = await this.prisma.collection.findUnique({ where: { id: collectionId } })
    
    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException('Access denied')

    return this.prisma.collectionCard.upsert({
      where: {
        collectionId_cardId_condition_language_isFirstEdition_isFoil: {
          collectionId,
          cardId,
          condition: options?.condition || 'NM',
          language: options?.language || 'EN',
          isFirstEdition: options?.isFirstEdition || false,
          isFoil: options?.isFoil || false,
        }
      },
      update: {
        quantity: { increment: options?.quantity || 1 },
        notes: options?.notes
      },
      create: {
        collectionId,
        cardId,
        quantity: options?.quantity || 1,
        condition: options?.condition || 'NM',
        language: options?.language || 'EN',
        isFirstEdition: options?.isFirstEdition || false,
        isFoil: options?.isFoil || false,
        notes: options?.notes
      }
    })
  }

  async removeCard(collectionId: string, cardId: string, userId: string, quantity = 1) {
    const collection = await this.prisma.collection.findUnique({ where: { id: collectionId } })
    
    if (!collection) throw new NotFoundException('Collection not found')
    if (collection.userId !== userId) throw new ForbiddenException('Access denied')

    const collectionCard = await this.prisma.collectionCard.findFirst({
      where: { collectionId, cardId }
    })

    if (!collectionCard) throw new NotFoundException('Card not in collection')

    if (collectionCard.quantity <= quantity) {
      return this.prisma.collectionCard.delete({
        where: { id: collectionCard.id }
      })
    }

    return this.prisma.collectionCard.update({
      where: { id: collectionCard.id },
      data: { quantity: { decrement: quantity } }
    })
  }

  async getCollectionValue(collectionId: string, userId: string) {
    const collection = await this.getCollection(collectionId, userId)
    
    let totalValue = 0
    const cardValues = []

    for (const item of collection.cards) {
      const latestPrice = item.card.priceHistory[0]
      if (latestPrice) {
        const value = (latestPrice.marketPrice || 0) * item.quantity
        totalValue += value
        cardValues.push({
          cardId: item.cardId,
          cardName: item.card.name,
          quantity: item.quantity,
          unitPrice: latestPrice.marketPrice,
          totalValue: value,
          lastUpdated: latestPrice.recordedAt
        })
      }
    }

    return {
      collectionId,
      totalValue,
      cardCount: collection.cards.reduce((sum, item) => sum + item.quantity, 0),
      uniqueCards: collection.cards.length,
      cardValues: cardValues.sort((a, b) => b.totalValue - a.totalValue)
    }
  }
}