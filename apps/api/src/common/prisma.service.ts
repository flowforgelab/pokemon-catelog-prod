import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private connectionId = 0

  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://postgres.zgzvwrhoprhdvdnwofiq:tesfa5-peHbuv-sojnuz@db.zgzvwrhoprhdvdnwofiq.supabase.co:5432/postgres?sslmode=require',
        },
      },
      log: ['query', 'info', 'warn', 'error'],
    })
  }

  // Helper method to create fresh connection
  async createFreshConnection() {
    const connectionId = ++this.connectionId
    console.log(`Creating fresh connection #${connectionId}`)
    
    // Disconnect current connection
    await this.$disconnect()
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Connect with fresh session
    await this.$connect()
    
    return connectionId
  }

  async onModuleInit() {
    try {
      // Reset connection to clear prepared statements
      await this.$disconnect()
      await this.$connect()
      console.log('Prisma connected successfully')
    } catch (error) {
      console.error('Prisma connection error:', error)
      console.log('Attempting connection reset...')
      try {
        await this.$disconnect()
        await new Promise(resolve => setTimeout(resolve, 1000))
        await this.$connect()
        console.log('Prisma reconnected successfully')
      } catch (retryError) {
        console.error('Prisma retry failed:', retryError)
        console.log('API will start without database connection')
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}