import { Injectable, LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class Logger implements LoggerService {
  private logger: WinstonLogger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, timestamp }) => {
              const appStr = chalk.green(`[Nest] ${process.pid}  -`);
              const contextStr = chalk.yellow(`[${context}]`);
              const messageStr = chalk.green(message);

              return `${appStr} ${timestamp} ${level} ${contextStr}: ${messageStr}`;
            })
          )
        }),
        new transports.DailyRotateFile({
          dirname: process.cwd() + '/src/logs',
          filename: 'app-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          // 保存14天
          maxFiles: '14d',
          // 压缩
          zippedArchive: true,
          maxSize: '20M',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
          // 如果不设置level，则默认使用winston的level
          level: 'error'
        })
      ]
    });
  }
  log(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, timestamp });
  }
  info(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(message, { context, timestamp });
  }
  error(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.error(message, { context, timestamp });
  }
  warn(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(message, { context, timestamp });
  }
  debug(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.debug(message, { context, timestamp });
  }
  verbose(message: any, context?: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.verbose(message, { context, timestamp });
  }
}
