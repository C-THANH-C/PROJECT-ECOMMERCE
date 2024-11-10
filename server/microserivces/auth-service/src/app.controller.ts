import { Controller, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResponseInterceptor } from './config/ResponseInterceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseInterceptors(new ResponseInterceptor('Register success'))
  @MessagePattern('register')
  register(@Payload() data: any) {

    return this.appService.register(data)

  }

  @UseInterceptors(new ResponseInterceptor('Login success'))
  @MessagePattern('login')
  login(@Payload() data) {
    return this.appService.login(data)

  }
}
