import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as md5 from 'md5';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  @Inject(AdminService)
  private adminService: AdminService;
  @Inject(JwtService)
  private jwtStrategy: JwtService;
  // constructor(
  //   private readonly jwtStrategy: JwtService,
  //   private readonly adminService: AdminService
  // ) {}

  async validateUser(username: string, password: string) {
    // const admin = await this.adminService.validateUser(username, password);
    // if (admin) {
    //   const { password, ...payload } = admin;
    //   return payload;
    // }
    // return null;
    const admin = await this.adminService.findOneByUsername(username);
    if (admin && admin.password === md5(password)) return admin;
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtStrategy.sign(payload)
    };
  }
}
