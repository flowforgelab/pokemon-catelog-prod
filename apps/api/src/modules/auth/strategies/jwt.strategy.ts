import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../../common/prisma.service'
import { RedisService } from '../../redis/redis.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: any) {
    // Get the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    
    // Check if token is blacklisted
    if (token) {
      const isBlacklisted = await this.redisService.isTokenBlacklisted(token)
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked')
      }
    }

    // Check if session exists
    if (payload.sessionId) {
      const session = await this.redisService.getSession(payload.sessionId)
      if (!session) {
        throw new UnauthorizedException('Session expired')
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}