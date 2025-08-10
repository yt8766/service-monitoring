import { Body, Controller, Get, Post } from '@nestjs/common';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/data')
  getData() {
    return this.storageService.getData();
  }

  @Post('/tracing')
  async tracing(@Body() data: any) {
    await this.storageService.tracing(data);
    return { message: 'Tracing data stored successfully' };
  }
}
