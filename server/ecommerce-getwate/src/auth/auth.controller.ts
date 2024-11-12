import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Login, Register, Update } from './dto';
import { catchError, lastValueFrom, of, retry, timeout } from 'rxjs';
import { AuthGuard } from 'src/AuthGuard/auth.guard';
import { error } from 'console';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject("AUTH_NAME") private Auth: ClientProxy,
    @Inject("NOTIFY_NAME") private Notify: ClientProxy,
  ) { }

  // User register
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

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/verify-email')
  async verifyEmail(@Body() data: any) {
    let verifyEmail = await lastValueFrom(this.Auth.send("verify-email", data).pipe(
      retry(3),
      catchError(error => {
        return of({ error: "Service B is currently unavailable.Please try again later" })
      })
    ))
      .then((result) => result)
      .catch(error => error.error)
    return verifyEmail
  }
  // User login
  @Post("login")
  async login(@Body() body: Login) {
    const login = await lastValueFrom(this.Auth.send('login', body))
      .then((result) => {
        return result
      })
      .catch(error => error.error)
    return login
  }

  // User update
  @UseGuards(AuthGuard)
  @Patch('/update')
  async update(@Body() body: Update, @Request() res) {
    const user_id = await res.user.user_id // user_id token 
    const update = await this.Auth.send("update", { body, user_id })
    update.subscribe({
      next: (result) => result,
      error: (error) => error
    })
    return update
  }



}
