import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { StoreModule } from './store/store.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }
  ), PrismaModule, AuthModule,
  ThrottlerModule.forRoot([{
    ttl: 60,
    limit: 5,
  },
  ],
  ),
    StoreModule,
  JwtModule.register({
    global: true
  })
  ],
})
export class AppModule { }
