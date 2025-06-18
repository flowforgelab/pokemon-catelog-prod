import { Module } from '@nestjs/common'
import { CollectionService } from './collection.service'
import { CollectionResolver } from './collection.resolver'
import { PrismaService } from '../../common/prisma.service'
import { PricingModule } from '../pricing/pricing.module'

@Module({
  imports: [PricingModule],
  providers: [CollectionService, CollectionResolver, PrismaService],
  exports: [CollectionService],
})
export class CollectionModule {}