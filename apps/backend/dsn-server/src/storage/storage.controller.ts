import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/bugs')
  async bugs() {
    const result = await this.storageService.getBugs();

    return {
      data: result,
      message: 'get bugs success',
      code: 0,
      success: true
    };
  }

  @Get('/performance')
  async performance() {
    const result = await this.storageService.getPerformance();
    return {
      data: result,
      message: 'get performance success',
      code: 0,
      success: true
    };
  }

  @Get('/data')
  async getData() {
    const result = await this.storageService.getData();
    return {
      data: result,
      message: 'get data success',
      code: 0,
      success: true
    };
  }

  @Post('/tracing')
  async tracing(@Body() data: any, @Req() req: Request) {
    if (!data) {
      const buffer = (req as any)._readableState?.buffer;
      const content = buffer.toString('utf-8');
      const dataList =
        JSON.parse(content)?.data?.map((item: any) => ({
          ...item,
          value: typeof item.value === 'string' ? JSON.parse(item.value) : item.value
        })) || [];
      await this.storageService.tracing(dataList);

      return { message: 'Tracing data stored successfully' };
    }
  }
  @Post('/tracing/:app_id')
  async tracingAppID(@Param() { app_id }: { app_id: string }, @Body() data: any, @Req() req: Request) {
    if (!data) {
      const buffer = (req as any)?._readableState?.buffer;
      const content = JSON.parse(buffer?.toString('utf-8')).data;
      await this.storageService.tracingAppID(app_id, content);
      return { message: 'Tracing data stored successfully' };
    } else {
      await this.storageService.tracingReport(app_id, data);
      return { message: 'Tracing data stored successfully' };
    }
  }
}
