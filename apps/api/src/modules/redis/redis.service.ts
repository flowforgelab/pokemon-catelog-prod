import { Injectable, Inject } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key)
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl)
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }

  async reset(): Promise<void> {
    // Note: cache-manager v5+ doesn't have reset method
    // Would need to implement custom logic or use store-specific methods
  }

  // Session-specific methods
  async getSession(sessionId: string): Promise<any> {
    return await this.get(`session:${sessionId}`)
  }

  async setSession(sessionId: string, data: any, ttl = 86400): Promise<void> {
    await this.set(`session:${sessionId}`, data, ttl)
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.del(`session:${sessionId}`)
  }

  // Refresh token blacklist
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    await this.set(`blacklist:${token}`, true, expiresIn)
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.get(`blacklist:${token}`)
    return !!result
  }

  // Rate limiting
  async incrementRateLimit(key: string, windowSeconds = 60): Promise<number> {
    const current = await this.get(`ratelimit:${key}`) || 0
    const newCount = current + 1
    await this.set(`ratelimit:${key}`, newCount, windowSeconds)
    return newCount
  }

  async getRateLimit(key: string): Promise<number> {
    return (await this.get(`ratelimit:${key}`)) || 0
  }
}