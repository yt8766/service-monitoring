import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ClickhouseModule.forRoot({
      url: 'http://localhost:8123',
      username: 'default',
      password: '123456'
    }),
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
