import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([{
    name: "STORE_NAME",
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1234@localhost:5672'],
      queue: "store_queue",
      queueOptions: {
        durable: true
      },
    }
  }])],
  controllers: [StoreController],
})
export class StoreModule { }
