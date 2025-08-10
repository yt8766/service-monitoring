import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtStrategy: JwtService,
    private readonly adminService: AdminService
  ) {}

  async validateUser(username: string, password: string) {
    const admin = await this.adminService.validateUser(username, password);
    if (admin) {
      const { password, ...payload } = admin;
      return payload;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtStrategy.sign(payload)
    };
  }
}
