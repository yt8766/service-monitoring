import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { Logger } from './logger/logger';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  @Inject(Logger)
  private readonly logger: Logger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(data => {
        const logFormat = `
      Request original url: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      Response data: ${JSON.stringify(data)}
      `;
        this.logger.log(logFormat, 'Response LoggerInterceptor');
        return data;
      })
    );
  }
}
