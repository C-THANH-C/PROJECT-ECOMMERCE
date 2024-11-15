import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './validation/validation.pipe';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'public'), // Thư mục chứa các file tĩnh
    serveRoot: '/public/', // Đường dẫn để truy cập
  }),

    await app.listen(8080);
}
bootstrap();
