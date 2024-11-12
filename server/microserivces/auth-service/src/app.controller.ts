import { Controller, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ResponseInterceptor } from './config/ResponseInterceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseInterceptors(new ResponseInterceptor('Send OTP email'))
  @MessagePattern('register')
  register(@Payload() data: any) {
    return this.appService.register(data)
  }
  @UseInterceptors(new ResponseInterceptor('User register success'))
  @MessagePattern('verify-email')
  verifyEmail(@Payload() data) {

    return this.appService.verifyEmail(data)

  }

  @UseInterceptors(new ResponseInterceptor('Login success'))
  @MessagePattern('login')
  login(@Payload() data) {
    return this.appService.login(data)
  }
  @UseInterceptors(new ResponseInterceptor('Update success'))
  @MessagePattern('update')
  update(@Payload() data) {
    console.log(data)
    return this.appService.update(data)
  }
}
