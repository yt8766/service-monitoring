import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  @Inject(Logger)
  private readonly logger: Logger;
  getHello(): string {
    return 'Hello World!';
  }
}
