import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmModule } from './llm/llm.module';
import { TranslateHandlerModule } from './translate-handler/translate-handler.module';
import { WetherHandlerModule } from './wether-handler/wether-handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注册，其他模块无需再导入
      envFilePath: '.env'
    }),
    LlmModule,
    TranslateHandlerModule,
    WetherHandlerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
