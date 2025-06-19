import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Card } from '@prisma/client';

interface CardRecommendation {
  card: Card;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  replacementFor?: Card;
  synergies: string[];
}

interface DeckCard {
  card: Card;
  quantity: number;
}

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async generateRecommendations(
    deckCards: DeckCard[],
    strategy: string,
    format: string
  ): Promise<CardRecommendation[]> {
    const cards = this.flattenDeck(deckCards);
    const recommendations: CardRecommendation[] = [];

    // Basic deck health recommendations
    recommendations.push(...await this.getDrawPowerRecommendations(cards));
    recommendations.push(...await this.getEnergyRecommendations(cards, strategy));
    recommendations.push(...await this.getStrategySpecificRecommendations(cards, strategy));
    recommendations.push(...await this.getFormatRecommendations(cards, format));

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  private flattenDeck(deckCards: DeckCard[]): Card[] {
    return deckCards.flatMap(dc => Array(dc.quantity).fill(dc.card));
  }

  private async getDrawPowerRecommendations(cards: Card[]): Promise<CardRecommendation[]> {
    const drawCards = cards.filter(c => 
      c.supertype === 'Trainer' && (
        c.name.toLowerCase().includes('professor') ||
        c.name.toLowerCase().includes('research') ||
        c.name.toLowerCase().includes('draw')
      )
    );

    if (drawCards.length < 8) {
      const professorsResearch = await this.prisma.card.findFirst({
        where: { 
          name: { contains: "Professor's Research" },
          supertype: 'Trainer'
        }
      });

      if (professorsResearch) {
        return [{
          card: professorsResearch,
          reasoning: 'Essential draw support for consistent deck performance',
          priority: 'high' as const,
          synergies: ['Hand refresh', 'Deck cycling', 'Resource access']
        }];
      }
    }

    return [];
  }

  private async getEnergyRecommendations(cards: Card[], strategy: string): Promise<CardRecommendation[]> {
    const energyCards = cards.filter(c => c.supertype === 'Energy');
    const energyTypes = new Set(cards.filter(c => c.types?.length).flatMap(c => c.types));
    
    if (energyCards.length < 12) {
      // Find basic energy matching deck types
      const basicEnergy = await this.prisma.card.findMany({
        where: {
          supertype: 'Energy',
          subtypes: { has: 'Basic' },
          types: { hasSome: Array.from(energyTypes) }
        },
        take: 3
      });

      return basicEnergy.map(energy => ({
        card: energy,
        reasoning: `Add more ${energy.types[0]} Energy for consistency`,
        priority: 'medium' as const,
        synergies: [`${energy.types[0]} Pokemon support`]
      }));
    }

    return [];
  }

  private async getStrategySpecificRecommendations(cards: Card[], strategy: string): Promise<CardRecommendation[]> {
    switch (strategy) {
      case 'aggro':
        return this.getAggroRecommendations(cards);
      case 'control':
        return this.getControlRecommendations(cards);
      case 'combo':
        return this.getComboRecommendations(cards);
      default:
        return [];
    }
  }

  private async getAggroRecommendations(cards: Card[]): Promise<CardRecommendation[]> {
    // Look for quick, low-cost attackers
    const quickAttackers = await this.prisma.card.findMany({
      where: {
        supertype: 'Pokémon',
        hp: { lte: 120 },
        standardLegal: true
      },
      take: 3
    });

    return quickAttackers.map(pokemon => ({
      card: pokemon,
      reasoning: 'Fast, efficient attacker for aggressive strategy',
      priority: 'medium' as const,
      synergies: ['Quick setup', 'Prize pressure', 'Early game dominance']
    }));
  }

  private async getControlRecommendations(cards: Card[]): Promise<CardRecommendation[]> {
    // Look for disruption and high HP Pokemon
    const controlCards = await this.prisma.card.findMany({
      where: {
        OR: [
          { 
            supertype: 'Pokémon',
            hp: { gte: 180 }
          },
          {
            supertype: 'Trainer',
            name: { contains: 'Switch' }
          }
        ],
        standardLegal: true
      },
      take: 3
    });

    return controlCards.map(card => ({
      card,
      reasoning: card.supertype === 'Pokémon' ? 
        'High HP tank for control strategy' : 
        'Utility card for board control',
      priority: 'medium' as const,
      synergies: ['Stall tactics', 'Board control', 'Late game power']
    }));
  }

  private async getComboRecommendations(cards: Card[]): Promise<CardRecommendation[]> {
    // Look for search and evolution support
    const comboSupport = await this.prisma.card.findMany({
      where: {
        supertype: 'Trainer',
        OR: [
          { name: { contains: 'Ball' } },
          { name: { contains: 'Search' } },
          { name: { contains: 'Communication' } }
        ],
        standardLegal: true
      },
      take: 3
    });

    return comboSupport.map(trainer => ({
      card: trainer,
      reasoning: 'Search effect to find combo pieces consistently',
      priority: 'high' as const,
      synergies: ['Combo consistency', 'Deck thinning', 'Setup acceleration']
    }));
  }

  private async getFormatRecommendations(cards: Card[], format: string): Promise<CardRecommendation[]> {
    // Format-specific staple cards
    const staples = await this.prisma.card.findMany({
      where: {
        supertype: 'Trainer',
        standardLegal: format === 'standard' ? true : undefined,
        expandedLegal: format === 'expanded' ? true : undefined,
        name: { in: ['Switch', 'Potion', 'Energy Search'] }
      },
      take: 2
    });

    return staples.map(staple => ({
      card: staple,
      reasoning: `${format} format staple card`,
      priority: 'low' as const,
      synergies: ['Format optimization', 'Utility support']
    }));
  }
}