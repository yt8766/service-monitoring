import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { nanoid } from 'nanoid';
import { Admin } from '../admin/entities/admin.entity';
import { ApplicationService } from './application.service';
import { Application } from './entities/application.entity';

@Controller('application')
@UseGuards(AuthGuard('jwt'))
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('/create')
  async create(@Body() body, @Request() req) {
    const admin = new Admin();
    admin.id = req.user.id;
    const application = new Application(body);
    application.appId = application.type + nanoid(6); // 生成appId
    application.admin = admin;
    const result = await this.applicationService.create(application);
    return {
      data: result,
      success: true,
      message: 'Application created successfully',
      code: 200
    };
  }

  @Get()
  async findAll(@Request() req) {
    const list = await this.applicationService.findAll({ userId: req.user.id });
    return {
      data: list,
      success: true,
      message: 'Application list fetched successfully',
      code: 200
    };
  }
}
