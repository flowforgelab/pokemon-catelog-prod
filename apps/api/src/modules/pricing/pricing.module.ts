import { Module } from '@nestjs/common'
import { PricingService } from './pricing.service'
import { PricingResolver } from './pricing.resolver'
import { PrismaService } from '../../common/prisma.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [PricingService, PricingResolver, PrismaService],
  exports: [PricingService],
})
export class PricingModule {}