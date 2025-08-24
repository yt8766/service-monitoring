import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ClickhouseModule.forRoot({
      url: 'http://localhost:8123',
      username: 'default',
      password: '123456'
    }),
    StorageModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
