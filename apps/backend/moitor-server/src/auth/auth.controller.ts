import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() body) {
    const data = await this.authService.login(body);

    return {
      data,
      success: true
    };
  }

  @Get('/whoami')
  @UseGuards(AuthGuard('jwt'))
  async whoami(@Request() req) {
    return req.user;
  }

  @Get('/validate')
  async validate(@Body() body) {
    return this.authService.validateUser(body.username, body.password);
  }
}
