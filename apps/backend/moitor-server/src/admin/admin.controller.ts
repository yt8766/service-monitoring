import { Body, Controller, Get, Inject, Post, Req, Request, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Controller('admin')
export class AdminController {
  @Inject()
  private readonly jwtStrategy: JwtService;

  @Inject(AuthService)
  private authService: AuthService;
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AuthGuard('local'))
  @Post('loginPassport')
  async loginPassport(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('login')
  async login(@Body(ValidationPipe) body: LoginAdminDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.adminService.login(body);
    if (result) {
      const token = await this.jwtStrategy.signAsync({
        admin: {
          id: result.id,
          username: result.username,
          email: result.email,
          phone: result.phone,
          role: result.role
        }
      });
      delete result.password;

      res.header('Authorization', token);
      return {
        message: 'Login successfully',
        data: {
          ...result,
          access_token: token
        },
        success: true,
        code: 200
      };
    } else {
      return {
        message: 'Login failed',
        data: null,
        success: false,
        code: 400
      };
    }
  }

  @Get('whoami')
  @UseGuards(AuthGuard('jwt'))
  async whoami(@Request() req) {
    return req.user;
  }

  @Get('list')
  async list() {
    const result = await this.adminService.list();
    return {
      message: 'List successfully',
      data: result,
      success: true,
      code: 200
    };
  }

  @Post('register')
  async register(@Body(ValidationPipe) body: RegisterAdminDto) {
    const result = await this.adminService.register(body);
    return result;
  }

  @Post('validate')
  async validate(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const result = await this.adminService.validateUser(username, password);
    return result;
  }
}
