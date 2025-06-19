import { Test, TestingModule } from '@nestjs/testing';
import { DeckAnalyzerService } from './deck-analyzer.service';

describe('DeckAnalyzerService', () => {
  let service: DeckAnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeckAnalyzerService],
    }).compile();

    service = module.get<DeckAnalyzerService>(DeckAnalyzerService);
  });

  const mockAggroDeck = [
    { card: { supertype: 'Pokémon', hp: 70, types: ['Fire'], attacks: [{ cost: ['Fire'] }] }, quantity: 4 },
    { card: { supertype: 'Pokémon', hp: 90, types: ['Fire'], attacks: [{ cost: ['Fire', 'Colorless'] }] }, quantity: 4 },
    { card: { supertype: 'Energy', types: ['Fire'], subtypes: ['Basic'] }, quantity: 12 },
    { card: { supertype: 'Trainer', name: "Professor's Research" }, quantity: 4 }
  ];

  describe('analyzeStrategy', () => {
    it('should identify aggro strategy', () => {
      const result = service.analyzeDeck(mockAggroDeck);
      expect(result.strategy).toBe('aggro');
    });
  });

  describe('calculateConsistency', () => {
    it('should calculate high consistency for focused deck', () => {
      const result = service.analyzeDeck(mockAggroDeck);
      expect(result.consistencyScore).toBeGreaterThan(60);
    });
  });

  describe('warnings', () => {
    it('should warn about deck size', () => {
      const incompleteDeck = mockAggroDeck.slice(0, 2);
      const result = service.analyzeDeck(incompleteDeck);
      expect(result.warnings).toContain('Deck must be exactly 60 cards (currently 24)');
    });
  });
});