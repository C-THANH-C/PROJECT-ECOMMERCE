import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResponseInterceptor } from './config/ResponseInterceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseInterceptors(new ResponseInterceptor("Request is being processed"))
  @MessagePattern("create-store")
  createStore(@Payload() data) {
    return this.appService.createStore(data)
  }
}
