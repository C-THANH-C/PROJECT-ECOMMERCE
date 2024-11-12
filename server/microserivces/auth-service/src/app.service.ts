import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Roles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import * as randomstring from 'randomstring'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('NOTIFY_NAME') private notify: ClientProxy
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
    let email = data.email
    let newUser = {
      ...data,
      password: hashPassword,
      user_role: Roles.user,
      user_create: new Date()
    }

    let newUserRedis = await this.cacheManager.get(`${email}`)
    if (newUser) {
      if (!newUserRedis) {
        let otp = randomstring.generate({
          length: 4,
          charset: 'numeric'
        })
        this.cacheManager.set(`otp${email}`, otp)
        this.cacheManager.set(`${email}`, newUser)
      }

      let otpCache = await this.cacheManager.get(`otp${email}`)
      await this.notify.emit('data', { email, otpCache })
    }
    return {
      email,
      expiresIn: 50
    }

    // await this.prisma.users.create({
    //   data: newUser
    // })

  }
  async verifyEmail(data) {
    let { email, otp } = await data
    let checkUser = await this.prisma.users.findFirst({
      where: {
        email
      }
    })
    if (checkUser) {
      if (checkUser.user_status === true) {
        return 'User exists'
      }
    } else {
      let userCache: any = await this.cacheManager.get(`${email}`)
      let otpCache: number = await this.cacheManager.get(`otp${email}`)
      if (!otpCache) throw new HttpException("OTP Expired ", HttpStatus.BAD_REQUEST)
      if (Number(otp) != Number(otpCache)) throw new HttpException("OTP error", HttpStatus.BAD_REQUEST)
      let newUser = {
        ...userCache,
        user_status: true
      }
      await this.prisma.users.create({
        data: newUser
      })
      await this.cacheManager.del(`${email}`)
      await this.cacheManager.del(`otp${email}`)
      return {
        ...newUser,
        password: '',
      }
    }

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
        let access_token = await this.jwtService.sign({ user_id: checkUser.user_id, user_role: checkUser.user_role },
          {
            algorithm: 'HS256',
            expiresIn: "55d",
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
  async update(data) {
    const { user_id, body } = data


  }
}
