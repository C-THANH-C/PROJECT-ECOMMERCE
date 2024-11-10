import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Login, Register } from './dto';
import { lastValueFrom } from 'rxjs';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject("AUTH_NAME") private Auth: ClientProxy,

  ) { }
  @Post("/register")
  async register(@Body() body: Register) {
    const register = await lastValueFrom(this.Auth.send('register', body))
      .then((result) => {
        return result
      })
      .catch(error => {
        return error.error
      })
    return register
  }

  @Post("login")
  async login(@Body() body: Login) {

    const login = await lastValueFrom(this.Auth.send('login', body))
      .then((result) => {
        return result
      })
      .catch(error => error.error)
    return login
  }
}
