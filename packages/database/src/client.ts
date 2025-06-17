import { PrismaClient as BasePrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: BasePrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new BasePrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { BasePrismaClient as PrismaClient }