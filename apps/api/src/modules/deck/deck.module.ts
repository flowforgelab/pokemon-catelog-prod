import { Module } from '@nestjs/common'
import { DeckService } from './deck.service'
import { DeckResolver } from './deck.resolver'
import { DeckAnalyzerService } from './deck-analyzer.service'
import { RecommendationService } from './recommendation.service'
import { PrismaService } from '../../common/prisma.service'

@Module({
  providers: [DeckService, DeckResolver, DeckAnalyzerService, RecommendationService, PrismaService],
  exports: [DeckService],
})
export class DeckModule {}