import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as md5 from 'md5';
import { Repository } from 'typeorm';
import { LoginAdminDto } from './dto/login-admin.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private readonly adminRepository: Repository<Admin>) {}

  async findOneByUsername(username: string) {
    const admin = await this.adminRepository.findOneBy({ username });
    return admin;
  }

  async login(user: LoginAdminDto) {
    const { username, password } = user;
    const admin = await this.findOneByUsername(username);
    if (!admin) {
      throw new HttpException('The username does not exist. ', 400);
    }
    if (admin.password !== md5(password)) {
      throw new HttpException('The password is incorrect. ', 400);
    }

    return admin;
  }

  async validateUser(username: string, password: string) {
    const admin = await this.adminRepository.findOne({
      where: { username, password }
    });
    return admin;
  }
  async register(admin: RegisterAdminDto) {
    const adminEntity = await this.adminRepository.findOneBy({
      username: admin.username
    });
    if (adminEntity) {
      throw new HttpException('The username already exists. ', 200);
    }
    const newAdmin = new Admin();
    newAdmin.username = admin.username;
    newAdmin.password = md5(admin.password);
    newAdmin.email = admin.email;
    newAdmin.phone = admin.phone;
    newAdmin.role = admin.role || 'admin';

    try {
      await this.adminRepository.save(newAdmin);
      delete newAdmin.password;
      return {
        code: 200,
        success: true,
        message: 'Register successfully',
        data: newAdmin
      };
    } catch (error) {
      return {
        code: 400,
        success: false,
        message: `Register failed ${error.message}`,
        data: null
      };
    }
  }

  async list() {
    const admins = await this.adminRepository.find({
      order: {
        username: 'ASC'
      }
    });
    return admins;
  }
}
