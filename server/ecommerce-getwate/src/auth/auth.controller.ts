import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { info, Login, Register, Update } from './dto';
import { catchError, lastValueFrom, of, retry, timeout } from 'rxjs';
import { AuthGuard } from 'src/AuthGuard/auth.guard';
import { error } from 'console';
import { Throttle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject("AUTH_NAME") private Auth: ClientProxy,
    @Inject("NOTIFY_NAME") private Notify: ClientProxy,
    private prisma: PrismaService
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
    const update = await lastValueFrom(this.Auth.send("update", { body, user_id }))
      .then(result => result)
      .catch(error => error)
    return update
  }
  @UseInterceptors(FilesInterceptor("user_image", 1, {
    storage: diskStorage({
      destination: path.join(process.cwd(), '/public/auth'),
      filename: (req, file, callback) => {
        const timestamp = Date.now();
        callback(null, `${timestamp}-${file.originalname}`);
      }
    })
  }))
  @UseGuards(AuthGuard)
  @Patch('info')
  async info(@Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>, @Request() req) {
    const user_id = req.user.user_id;
    const uploadedFiles = files || [];

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const checkUser = await this.prisma.user_info.findFirst({
      where: { user_id },
    });
    let imagesSave = checkUser?.user_image || [];
    // Nếu chưa có ảnh nào, chỉ cần thêm ảnh mới
    if (imagesSave.length === 0) {
      const filePath: string[] | [] = await Promise.all(
        uploadedFiles.map((file) => {
          return file.filename
        })
      )
      // Cập nhật thông tin người dùng và ảnh mới vào microservice
      const userInfo = await lastValueFrom(this.Auth.send("user-info", { body, filePath, user_id }))
        .then(result => result)
        .catch(error => error.error);
      return userInfo;
    }
    // Lấy danh sách ảnh trong thư mục /public/auth
    const imageFolder = await fs.promises.readdir(path.join(process.cwd(), 'public', 'auth'));
    // Kiểm tra ảnh cũ lưu trong thư mục /public/auth
    const imagesMatch = imagesSave.filter(image => {
      return imageFolder.includes(image);
    });
    const imagesToDeletePaths = imagesMatch.map(image => path.join(process.cwd(), 'public', 'auth', image));
    // Xóa ảnh cũ khỏi thư mục
    await Promise.all(imagesToDeletePaths.map(async (imagePath) => {
      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        return error
      }
    }));
    // Cập nhật danh sách ảnh
    const filePath: string[] | [] = await Promise.all(
      uploadedFiles.map((file) => {
        return file.filename
      })
    )
    const userInfo = await lastValueFrom(this.Auth.send("user-info", { body, filePath, user_id }))
      .then(result => result)
      .catch(error => error.error);
    return userInfo;
  }
}
