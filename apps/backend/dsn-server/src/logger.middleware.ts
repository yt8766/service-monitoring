import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from './logger/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject(Logger)
  private logger: Logger;
  use(req: Request, res: Response, next: NextFunction) {
    const statusCode = res.statusCode;
    const logFormat = `
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${statusCode}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    `;
    next();

    if (statusCode >= 500) {
      this.logger.error(logFormat, `Response LoggerMiddleWare`);
    } else if (statusCode >= 400) {
      this.logger.warn(logFormat, `Response LoggerMiddleWare`);
    } else {
      this.logger.log(logFormat, `Response LoggerMiddleWare`);
    }
  }
}
