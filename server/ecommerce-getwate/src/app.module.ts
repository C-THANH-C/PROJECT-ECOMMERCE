import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [AuthModule,
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 5,
    },
    ],
    )
  ],
})
export class AppModule { }
