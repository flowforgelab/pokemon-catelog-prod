import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../common/prisma.service'
import { RedisService } from '../redis/redis.service'
import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password: _, ...result } = user
    return result
  }

  async login(user: any) {
    const sessionId = randomUUID()
    const payload = { email: user.email, sub: user.id, sessionId }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' })

    // Store session in Redis
    await this.redisService.setSession(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
    }, 86400 * 7) // 7 days

    return {
      accessToken,
      refreshToken,
      user,
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const newPayload = { email: user.email, sub: user.id }
      const accessToken = this.jwtService.sign(newPayload)

      return {
        accessToken,
        user,
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async signup(email: string, password: string, name?: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new UnauthorizedException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    const { password: _, ...result } = user
    return this.login(result)
  }

  async createOrLoginOAuthUser(email: string, name?: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Create OAuth user without password
      user = await this.prisma.user.create({
        data: {
          email,
          name,
          // OAuth users don't have passwords
        },
      })
    }

    const { password: _, ...result } = user
    return this.login(result)
  }

  async logout(token: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token)
      
      // Delete session from Redis
      if (payload.sessionId) {
        await this.redisService.deleteSession(payload.sessionId)
      }
      
      // Blacklist the token
      const tokenExp = payload.exp - Math.floor(Date.now() / 1000)
      if (tokenExp > 0) {
        await this.redisService.blacklistToken(token, tokenExp)
      }
      
      return true
    } catch (error) {
      return false
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(token)
      if (isBlacklisted) {
        return false
      }

      const payload = this.jwtService.verify(token)
      
      // Check if session exists
      if (payload.sessionId) {
        const session = await this.redisService.getSession(payload.sessionId)
        if (!session) {
          return false
        }
      }
      
      return true
    } catch (error) {
      return false
    }
  }
}