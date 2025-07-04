import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { PrismaService } from '../../common/prisma.service'

@Module({
  providers: [UserService, UserResolver, PrismaService],
  exports: [UserService],
})
export class UserModule {}