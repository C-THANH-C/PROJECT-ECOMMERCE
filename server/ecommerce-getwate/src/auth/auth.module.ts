import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';

@Module({
  imports: [ClientsModule.register([{
    name: "AUTH_NAME",
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1234@localhost:5672'],
      queue: "auth_queue",
      queueOptions: {
        durable: true
      }
    }
  }]),
  JwtModule.register({}),
  ClientsModule.register([{
    name: "NOTIFY_NAME",
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1234@localhost:5672'],
      queue: "email_queue",
      queueOptions: {
        durable: true
      },
    }
  }]),
  ThrottlerModule.forRoot([{
    ttl: 60,
    limit: 5,
  }
  ],
  )
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Kích hoạt ThrottlerGuard toàn cục
    },
  ],
})
export class AuthModule { }
