import { Inject, Injectable } from '@nestjs/common';
import { Logger } from './logger/logger';

@Injectable()
export class AppService {
  @Inject(Logger)
  private readonly logger: Logger;
  getHello(): string {
    // this.logger.info('getHello info!', AppService.name);
    // this.logger.warn('getHello warn!', AppService.name);
    // this.logger.error('getHello error!', AppService.name);
    return 'Hello World!';
  }
}
