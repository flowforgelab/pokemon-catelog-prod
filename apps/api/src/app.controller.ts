import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './common/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  async getHealth() {
    try {
      const cardCount = await this.prisma.card.count();
      const dbUrl = process.env.DATABASE_URL?.substring(0, 50) + '...';
      
      return {
        status: 'ok',
        database: 'connected',
        cardCount,
        dbUrl,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
        dbUrl: process.env.DATABASE_URL?.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      };
    }
  }
}