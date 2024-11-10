import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const isRpc = host.getType() === 'rpc';
        if (isRpc) {
            const ctx = host.switchToRpc();
            const errorResponse = {
                statusCode: exception instanceof HttpException ? exception.getStatus() : 500,
                message: exception.message || 'Internal server error',
                timestamp: new Date().toISOString(),
                path: ctx.getContext().getPattern(), // Lấy pattern (route) của RPC
            };

            return throwError(() => new RpcException(errorResponse));
        } else {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse();
            const request = ctx.getRequest();
            const status = exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

            const message = exception instanceof HttpException
                ? exception.getResponse()
                : 'Có lỗi xảy ra, vui lòng thử lại sau!';

            const errorResponse = {
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message: message,
            };


            response.status(status).json(errorResponse);
        }
    }
}
