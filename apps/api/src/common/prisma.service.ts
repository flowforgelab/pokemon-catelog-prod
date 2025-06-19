import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      // Optimize for production with connection pooling
      ...(process.env.NODE_ENV === 'production' && {
        engineType: 'binary',
      }),
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      console.log('Prisma connected successfully')
    } catch (error) {
      console.error('Prisma connection error:', error)
      throw error // Don't silently fail in production
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}