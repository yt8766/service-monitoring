import { Module } from '@nestjs/common';
import { TranslateHandlerService } from './translate-handler.service';

@Module({
  providers: [TranslateHandlerService],
  exports: [TranslateHandlerService]
})
export class TranslateHandlerModule {}
