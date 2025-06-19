import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { JwtStrategy } from './strategies/jwt.strategy'
import { PrismaService } from '../../common/prisma.service'
import { RedisModule } from '../redis/redis.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    RedisModule,
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}