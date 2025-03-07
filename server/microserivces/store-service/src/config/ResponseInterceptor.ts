import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly message: string = 'Request successful') { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const ctx = context.switchToHttp();
                const response = ctx.getResponse();

                // Kiểm tra nếu không có `statusCode` trong phản hồi
                const statusCode = response.statusCode || HttpStatus.OK;

                return {
                    statusCode: statusCode,
                    message: this.message,
                    data: data,
                };
            }),
        );
    }
}
