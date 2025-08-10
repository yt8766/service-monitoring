import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/register')
  async create(@Body() body) {
    const result = await this.adminService.create(body);
    return result;
  }

  @Post('/validate')
  async validate(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const result = await this.adminService.validateUser(username, password);
    return result;
  }
}
