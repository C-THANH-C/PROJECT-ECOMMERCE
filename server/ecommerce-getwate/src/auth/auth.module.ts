import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
  }])],
  controllers: [AuthController]
})
export class AuthModule { }
