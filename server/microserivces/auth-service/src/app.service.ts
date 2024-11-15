import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { Roles } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ClientProxy } from '@nestjs/microservices';
import * as randomstring from 'randomstring'
import * as fs from 'fs';
import * as path from 'path'
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('NOTIFY_NAME') private notify: ClientProxy
  ) { }
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
    this.dataCache(newUser, email)
    return {
      email,
      expiresIn: 50
    }
  }
  async dataCache(newUser: JSON, email: string) {
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
      let otp = await this.cacheManager.get(`otp${email}`)
      await this.notify.emit('data', { email, otp })
      return { email, otp: otp }
    }
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
  async update(data: any) {
    const { user_id, body } = data
    let checkUser = await this.prisma.users.findFirst({
      where: {
        user_id
      }
    })
    if (!checkUser) throw new HttpException("User can not find", HttpStatus.NOT_FOUND)
    let checkBody = await this.prisma.users.findMany({
      where: {
        OR: [
          { email: body.email },
          { phone: body.phone }
        ],
        AND: [
          { user_id: { not: user_id } }
        ]
      },

    })

    if (checkBody.length > 0) {
      const existingUser = checkBody[0];
      let checkResult = existingUser.email === body.email ? "Email" : "Phone"
      throw new HttpException(`${checkResult} exists`, HttpStatus.NOT_FOUND)
    }
    if (checkUser) {
      let hashPassword = await bcrypt.hashSync(body.password, 10)
      if (body.email != checkUser.email) {

        let userUpdate = {
          ...body,
          password: hashPassword,
          user_status: false
        }
        await this.prisma.users.update({
          where: { user_id },
          data: userUpdate
        })
        return {
          ...userUpdate,
          password: ""
        }
      }
      let userUpdate = {
        ...body,
        password: hashPassword,
        user_status: true
      }
      await this.prisma.users.update({
        where: { user_id },
        data: userUpdate
      })
      return {
        ...userUpdate,
        password: ""
      }
    }
  }
  async info(data) {
    let { body, filePath, user_id } = await data
    let checkUser = await this.prisma.users.findFirst({
      where: {
        user_id
      },
      include: {
        user_info: true
      }
    })
    if (!checkUser) throw new HttpException("User can not found", HttpStatus.NOT_FOUND)

    let newInfo = {
      ...body,
      user_id,
      user_image: filePath || []
    }
    if (checkUser.user_info === null) {
      await this.prisma.user_info.create({
        data: newInfo
      })
    }
    let user = await this.prisma.user_info.update({
      where: { user_id },
      data: newInfo,
      include: {
        users: true
      }
    })
    return {
      ...user
    }
  }
}
