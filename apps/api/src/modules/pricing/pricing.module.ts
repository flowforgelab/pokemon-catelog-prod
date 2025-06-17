import { Module } from '@nestjs/common'
import { PricingService } from './pricing.service'
import { PrismaService } from '../../common/prisma.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [PricingService, PrismaService],
  exports: [PricingService],
})
export class PricingModule {}