import { Module } from '@nestjs/common'
import { DeckService } from './deck.service'
import { DeckResolver } from './deck.resolver'
import { PrismaService } from '../../common/prisma.service'

@Module({
  providers: [DeckService, DeckResolver, PrismaService],
  exports: [DeckService],
})
export class DeckModule {}