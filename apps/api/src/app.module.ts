import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { RedisModule } from './modules/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DataImportModule } from './modules/data-import/data-import.module';
import { SearchModule } from './modules/search/search.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { SyncModule } from './modules/sync/sync.module';
import { CollectionModule } from './modules/collection/collection.module';
import { DeckModule } from './modules/deck/deck.module';
import { AppController } from './app.controller';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    RedisModule,
    AuthModule,
    UserModule,
    DataImportModule,
    SearchModule,
    PricingModule,
    SyncModule,
    CollectionModule,
    DeckModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}