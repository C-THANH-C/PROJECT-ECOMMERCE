import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 5,
    },
    ],
    )
  ],
})
export class AppModule { }
