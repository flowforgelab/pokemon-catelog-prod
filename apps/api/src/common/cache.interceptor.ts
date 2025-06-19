import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { RedisService } from '../modules/redis/redis.service'

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const cacheKey = this.generateCacheKey(request)
    
    // Try to get from cache
    const cachedResult = await this.redisService.get(cacheKey)
    if (cachedResult) {
      return of(JSON.parse(cachedResult))
    }

    return next.handle().pipe(
      tap(async (data) => {
        // Cache the result for 5 minutes
        await this.redisService.set(cacheKey, JSON.stringify(data), 300)
      })
    )
  }

  private generateCacheKey(request: any): string {
    const { body, query, url } = request
    const identifier = JSON.stringify({ url, body, query })
    return `cache:${Buffer.from(identifier).toString('base64')}`
  }
}