import { Module } from '@nestjs/common';
import { WetherHandlerService } from './wether-handler.service';

@Module({
  providers: [WetherHandlerService],
  exports: [WetherHandlerService]
})
export class WetherHandlerModule {}
