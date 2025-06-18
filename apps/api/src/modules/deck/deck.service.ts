import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'

@Injectable()
export class DeckService {
  constructor(private prisma: PrismaService) {}

  async getDecks(userId: string) {
    return this.prisma.deck.findMany({
      where: { userId },
      include: {
        _count: { select: { cards: true } }
      },
      orderBy: { updatedAt: 'desc' }
    })
  }

  async getDeck(id: string, userId: string) {
    const deck = await this.prisma.deck.findUnique({
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

    if (!deck) throw new NotFoundException('Deck not found')
    if (deck.userId !== userId && !deck.isPublic) {
      throw new ForbiddenException('Access denied')
    }

    return deck
  }

  async createDeck(userId: string, name: string, format: string, description?: string) {
    return this.prisma.deck.create({
      data: { userId, name, format, description }
    })
  }

  async updateDeck(id: string, userId: string, data: any) {
    const deck = await this.prisma.deck.findUnique({ where: { id } })
    
    if (!deck) throw new NotFoundException('Deck not found')
    if (deck.userId !== userId) throw new ForbiddenException('Access denied')

    return this.prisma.deck.update({ where: { id }, data })
  }

  async deleteDeck(id: string, userId: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id } })
    
    if (!deck) throw new NotFoundException('Deck not found')
    if (deck.userId !== userId) throw new ForbiddenException('Access denied')

    return this.prisma.deck.delete({ where: { id } })
  }

  async addCard(deckId: string, cardId: string, userId: string, quantity = 1) {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } })
    
    if (!deck) throw new NotFoundException('Deck not found')
    if (deck.userId !== userId) throw new ForbiddenException('Access denied')

    // Get current deck composition
    const deckCards = await this.prisma.deckCard.findMany({
      where: { deckId },
      include: { card: true }
    })

    // Validate deck rules
    const card = await this.prisma.card.findUnique({ where: { id: cardId } })
    if (!card) throw new NotFoundException('Card not found')

    // Check format legality
    if (deck.format === 'standard' && !card.standardLegal) {
      throw new BadRequestException('Card is not legal in Standard format')
    }
    if (deck.format === 'expanded' && !card.expandedLegal) {
      throw new BadRequestException('Card is not legal in Expanded format')
    }

    // Check 4-card rule (except basic energy)
    const existingCard = deckCards.find(dc => dc.cardId === cardId)
    const currentQuantity = existingCard?.quantity || 0
    const isBasicEnergy = card.supertype === 'Energy' && card.subtypes?.includes('Basic')
    
    if (!isBasicEnergy && currentQuantity + quantity > 4) {
      throw new BadRequestException('Cannot have more than 4 copies of a card')
    }

    // Check 60-card limit
    const totalCards = deckCards.reduce((sum, dc) => sum + dc.quantity, 0)
    if (totalCards + quantity > 60) {
      throw new BadRequestException('Deck cannot exceed 60 cards')
    }

    return this.prisma.deckCard.upsert({
      where: {
        deckId_cardId: { deckId, cardId }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        deckId,
        cardId,
        quantity
      }
    })
  }

  async removeCard(deckId: string, cardId: string, userId: string, quantity = 1) {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } })
    
    if (!deck) throw new NotFoundException('Deck not found')
    if (deck.userId !== userId) throw new ForbiddenException('Access denied')

    const deckCard = await this.prisma.deckCard.findUnique({
      where: { deckId_cardId: { deckId, cardId } }
    })

    if (!deckCard) throw new NotFoundException('Card not in deck')

    if (deckCard.quantity <= quantity) {
      return this.prisma.deckCard.delete({
        where: { id: deckCard.id }
      })
    }

    return this.prisma.deckCard.update({
      where: { id: deckCard.id },
      data: { quantity: { decrement: quantity } }
    })
  }

  async validateDeck(deckId: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        cards: {
          include: { card: true }
        }
      }
    })

    if (!deck) throw new NotFoundException('Deck not found')

    const issues = []
    const cardCounts = new Map<string, number>()
    let totalCards = 0
    let pokemonCount = 0
    let trainerCount = 0
    let energyCount = 0

    for (const deckCard of deck.cards) {
      const card = deckCard.card
      totalCards += deckCard.quantity

      // Count by type
      if (card.supertype === 'Pokémon') pokemonCount += deckCard.quantity
      else if (card.supertype === 'Trainer') trainerCount += deckCard.quantity
      else if (card.supertype === 'Energy') energyCount += deckCard.quantity

      // Check 4-card rule
      const isBasicEnergy = card.supertype === 'Energy' && card.subtypes?.includes('Basic')
      if (!isBasicEnergy && deckCard.quantity > 4) {
        issues.push(`${card.name}: More than 4 copies (${deckCard.quantity})`)
      }

      // Check format legality
      if (deck.format === 'standard' && !card.standardLegal) {
        issues.push(`${card.name}: Not legal in Standard format`)
      }
    }

    // Check deck size
    if (totalCards !== 60) {
      issues.push(`Deck has ${totalCards} cards (must be exactly 60)`)
    }

    // Check minimum Pokemon
    if (pokemonCount === 0) {
      issues.push('Deck must contain at least 1 Pokémon')
    }

    return {
      valid: issues.length === 0,
      issues,
      stats: {
        totalCards,
        pokemonCount,
        trainerCount,
        energyCount
      }
    }
  }

  async exportDeck(deckId: string, userId: string) {
    const deck = await this.getDeck(deckId, userId)
    
    // Pokemon TCG Online format
    const lines = [`****** ${deck.name} ******`, '']
    
    const grouped = new Map<string, { card: any, quantity: number }>()
    for (const deckCard of deck.cards) {
      const key = `${deckCard.card.name} ${deckCard.card.setId} ${deckCard.card.number}`
      if (grouped.has(key)) {
        grouped.get(key)!.quantity += deckCard.quantity
      } else {
        grouped.set(key, { card: deckCard.card, quantity: deckCard.quantity })
      }
    }

    // Group by type
    const pokemon = []
    const trainers = []
    const energy = []
    
    for (const [key, { card, quantity }] of grouped) {
      const line = `${quantity} ${card.name} ${card.setId} ${card.number}`
      if (card.supertype === 'Pokémon') pokemon.push(line)
      else if (card.supertype === 'Trainer') trainers.push(line)
      else if (card.supertype === 'Energy') energy.push(line)
    }

    if (pokemon.length) {
      lines.push(`##Pokémon - ${pokemon.length}`, '', ...pokemon, '')
    }
    if (trainers.length) {
      lines.push(`##Trainer Cards - ${trainers.length}`, '', ...trainers, '')
    }
    if (energy.length) {
      lines.push(`##Energy - ${energy.length}`, '', ...energy, '')
    }

    lines.push('Total Cards - 60', '')

    return lines.join('\n')
  }
}