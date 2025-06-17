import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RedisService } from '../../modules/redis/redis.service'

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    
    // Get user ID or IP address for rate limiting
    const userId = req.user?.id
    const ipAddress = req.ip || req.connection.remoteAddress
    const key = userId || ipAddress
    
    if (!key) {
      return true
    }

    // Define rate limit based on authentication status
    const limit = userId ? 1000 : 100 // Higher limit for authenticated users
    const windowSeconds = 60

    // Check rate limit
    const count = await this.redisService.incrementRateLimit(key, windowSeconds)
    
    if (count > limit) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    return true
  }
}