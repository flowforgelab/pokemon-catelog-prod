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

  @Get('cards-test')
  async getCardsTest() {
    try {
      // Force fresh connection to clear prepared statements
      await (this.prisma as any).createFreshConnection?.() || this.prisma.$disconnect().then(() => this.prisma.$connect())
      
      // Use raw SQL to bypass Prisma prepared statements
      const result = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM "Card"
      `;
      
      const cards = await this.prisma.$queryRaw`
        SELECT "tcgId", name, "marketPrice", types 
        FROM "Card" 
        WHERE name ILIKE '%pikachu%' 
        LIMIT 3
      `;

      return {
        status: 'success',
        totalCards: result[0]?.count || 0,
        sampleCards: cards,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // If still failing, try a completely different approach
      console.error('Cards test failed:', error.message)
      
      // Try with manual connection string
      try {
        const { Pool } = require('pg')
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        })
        
        const countResult = await pool.query('SELECT COUNT(*) as count FROM "Card"')
        const cardsResult = await pool.query('SELECT "tcgId", name, "marketPrice", types FROM "Card" WHERE name ILIKE $1 LIMIT 3', ['%pikachu%'])
        
        await pool.end()
        
        return {
          status: 'success_fallback',
          totalCards: parseInt(countResult.rows[0]?.count || 0),
          sampleCards: cardsResult.rows,
          timestamp: new Date().toISOString()
        };
      } catch (fallbackError) {
        return {
          status: 'error',
          error: error.message,
          fallbackError: fallbackError.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  }
}