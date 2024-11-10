import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Roles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AppService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService
  ) {

  }
  async register(data) {
    let hashPassword = await bcrypt.hashSync(data.password, 10)
    let checkUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    })
    if (checkUser) {
      const checkResult = checkUser.email === data.email ? "Email" : "Phone"
      throw new HttpException(`${checkResult} is exists`, HttpStatus.NO_CONTENT)
    }
    let newUser = {
      ...data,
      password: hashPassword,
      user_role: Roles.user,
      user_create: new Date()
    }
    await this.prisma.users.create({
      data: newUser
    })
    return newUser
  }

  async login(data) {

    let checkUser = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phone: data.phone }
        ]
      }
    })
    let checkResult = data.email ? "Email" : "Phone"

    if (checkUser) {
      if (bcrypt.compareSync(data.password, checkUser.password)) {
        let access_token = await this.jwtService.sign({ sub: checkUser.user_id, user_role: checkUser.user_role },
          {
            algorithm: 'HS256',
            expiresIn: "5d",
            secret: "THANH"
          }
        )
        let user = {
          ...checkUser,
          password: '',
          access_token
        }
        return user
      }
      else throw new HttpException("Password error", HttpStatus.BAD_REQUEST)
    }
    else throw new HttpException(`${checkResult} error`, HttpStatus.NOT_FOUND)

  }
}
