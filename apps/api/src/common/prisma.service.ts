import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres:postgres123@localhost:5432/pokemon_catalog?schema=public',
        },
      },
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      console.log('Prisma connected successfully')
    } catch (error) {
      console.error('Prisma connection error:', error)
      console.log('API will start without database connection')
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}