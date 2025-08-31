import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from './logger/logger';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  @Inject(Logger)
  private readonly logger: Logger;
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const logFormat = `
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${exceptionResponse.statusCode}
    Response: ${exception.toString() + `(${exceptionResponse?.message || exceptionResponse})`}
    `;

    this.logger.error(logFormat, 'HttpExceptionFilter');

    response.status(status).json({
      code: status,
      timestamp: new Date().toLocaleString(),
      error: exceptionResponse?.message || exceptionResponse,
      message: `${status >= 500 ? 'Service Error' : 'Client Error'}`
    });
  }
}
