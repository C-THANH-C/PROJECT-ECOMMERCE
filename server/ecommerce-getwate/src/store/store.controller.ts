import { Body, Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { AuthGuard } from 'src/AuthGuard/auth.guard';
import { Role } from 'src/AuthGuard/role.enum';
import { Roles } from 'src/AuthGuard/roles.decorator';

@Controller('store')
export class StoreController {
  constructor(@Inject("STORE_NAME") private Store: ClientProxy) { }



  @UseGuards(AuthGuard)
  @Post("/create")
  async createStore(@Body() body, @Request() res) {
    let user_id = await res.user.user_id
    let createStore = await lastValueFrom(this.Store.send("create-store", { body, user_id }))
      .then(result => result)
      .catch(error => error.error)
    return createStore
  }
}
