import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';

interface DeckAnalysisResult {
  strategy: 'aggro' | 'control' | 'combo' | 'midrange';
  consistencyScore: number;
  energyCurve: number[];
  recommendations: string[];
  warnings: string[];
}

interface DeckCard {
  card: Card;
  quantity: number;
}

@Injectable()
export class DeckAnalyzerService {
  analyzeDeck(deckCards: DeckCard[]): DeckAnalysisResult {
    const cards = this.flattenDeck(deckCards);
    
    return {
      strategy: this.analyzeStrategy(cards),
      consistencyScore: this.calculateConsistency(cards),
      energyCurve: this.calculateEnergyCurve(cards),
      recommendations: this.generateRecommendations(cards),
      warnings: this.generateWarnings(cards, deckCards)
    };
  }

  private flattenDeck(deckCards: DeckCard[]): Card[] {
    return deckCards.flatMap(dc => Array(dc.quantity).fill(dc.card));
  }

  private analyzeStrategy(cards: Card[]): 'aggro' | 'control' | 'combo' | 'midrange' {
    const pokemon = cards.filter(c => c.supertype === 'Pokémon');
    const trainers = cards.filter(c => c.supertype === 'Trainer');
    
    // Aggro indicators
    const lowHpCount = pokemon.filter(p => p.hp && p.hp <= 90).length;
    const quickAttackers = pokemon.filter(p => 
      p.attacks && p.attacks.length > 0 && 
      (p.attacks as any[]).some(a => a.cost && a.cost.length <= 2)
    ).length;
    
    // Control indicators  
    const highHpCount = pokemon.filter(p => p.hp && p.hp >= 180).length;
    const disruptionCards = trainers.filter(t => 
      ['removal', 'disruption', 'reset'].some(keyword => 
        t.name.toLowerCase().includes(keyword)
      )
    ).length;
    
    // Combo indicators
    const evolutionLines = this.countEvolutionLines(pokemon);
    const searchCards = trainers.filter(t => 
      t.name.toLowerCase().includes('search') || 
      t.name.toLowerCase().includes('ball')
    ).length;

    if (quickAttackers > pokemon.length * 0.6) return 'aggro';
    if (highHpCount > pokemon.length * 0.4 || disruptionCards > 8) return 'control';
    if (evolutionLines > 2 || searchCards > 12) return 'combo';
    return 'midrange';
  }

  private calculateConsistency(cards: Card[]): number {
    const totalCards = cards.length;
    if (totalCards !== 60) return 0;

    let score = 50; // Base score
    
    // Energy consistency
    const energyTypes = new Set(cards.filter(c => c.types?.length).flatMap(c => c.types));
    if (energyTypes.size <= 2) score += 20;
    else if (energyTypes.size <= 3) score += 10;
    else score -= 10;

    // Pokemon ratio (8-12 optimal)
    const pokemonCount = cards.filter(c => c.supertype === 'Pokémon').length;
    if (pokemonCount >= 8 && pokemonCount <= 12) score += 15;
    else score -= Math.abs(pokemonCount - 10) * 2;

    // Energy count (12-16 optimal)
    const energyCount = cards.filter(c => c.supertype === 'Energy').length;
    if (energyCount >= 12 && energyCount <= 16) score += 15;
    else score -= Math.abs(energyCount - 14) * 3;

    return Math.max(0, Math.min(100, score));
  }

  private calculateEnergyCurve(cards: Card[]): number[] {
    const curve = Array(8).fill(0); // 0-7+ cost buckets
    
    cards.filter(c => c.supertype === 'Pokémon').forEach(pokemon => {
      if (pokemon.attacks && pokemon.attacks.length > 0) {
        const attacks = pokemon.attacks as any[];
        const avgCost = attacks.reduce((sum, attack) => {
          const cost = attack.cost ? attack.cost.length : 0;
          return sum + cost;
        }, 0) / attacks.length;
        
        const bucket = Math.min(7, Math.floor(avgCost));
        curve[bucket]++;
      }
    });

    return curve;
  }

  private generateRecommendations(cards: Card[]): string[] {
    const recommendations: string[] = [];
    const pokemon = cards.filter(c => c.supertype === 'Pokémon');
    const trainers = cards.filter(c => c.supertype === 'Trainer');
    const energy = cards.filter(c => c.supertype === 'Energy');

    // Basic ratios
    if (pokemon.length < 8) {
      recommendations.push('Consider adding more Pokémon (8-12 recommended)');
    }
    if (energy.length < 12) {
      recommendations.push('Consider adding more Energy cards (12-16 recommended)');
    }
    if (trainers.length < 20) {
      recommendations.push('Consider adding more Trainer cards (20-30 recommended)');
    }

    // Draw power
    const drawCards = trainers.filter(t => 
      ['draw', 'professor', 'research'].some(keyword => 
        t.name.toLowerCase().includes(keyword)
      )
    );
    if (drawCards.length < 8) {
      recommendations.push('Add more draw support cards (Professor\'s Research, etc.)');
    }

    return recommendations;
  }

  private generateWarnings(cards: Card[], deckCards: DeckCard[]): string[] {
    const warnings: string[] = [];
    
    // Deck size
    if (cards.length !== 60) {
      warnings.push(`Deck must be exactly 60 cards (currently ${cards.length})`);
    }

    // 4-card rule
    const cardCounts = new Map<string, number>();
    deckCards.forEach(dc => {
      cardCounts.set(dc.card.name, dc.quantity);
    });

    cardCounts.forEach((count, name) => {
      if (count > 4 && !name.toLowerCase().includes('energy')) {
        warnings.push(`Too many copies of ${name} (max 4 allowed)`);
      }
    });

    // Energy type consistency
    const energyTypes = new Set(cards.filter(c => c.types?.length).flatMap(c => c.types));
    if (energyTypes.size > 3) {
      warnings.push('Consider reducing energy types for consistency');
    }

    return warnings;
  }

  private countEvolutionLines(pokemon: Card[]): number {
    const stages = new Set(pokemon.map(p => p.subtypes).flat());
    return stages.has('Stage 2') ? 
      pokemon.filter(p => p.subtypes?.includes('Stage 2')).length :
      stages.has('Stage 1') ? 
      pokemon.filter(p => p.subtypes?.includes('Stage 1')).length : 0;
  }
}