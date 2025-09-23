import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('ask')
  ask(@Req() req: Request, @Res() res: Response) {
    return this.appService.ask(req, res);
  }

  @Get('history')
  async history() {
    const conversations = await this.appService.history();

    return {
      conversations: conversations
    };
  }

  @Post('clear')
  clear(@Req() req: Request, @Res() res: Response) {
    return this.appService.clear(req, res);
  }
}
