import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private readonly adminRepository: Repository<Admin>) {}

  async validateUser(username: string, password: string) {
    const admin = await this.adminRepository.findOne({
      where: { username, password }
    });
    return admin;
  }
  async create(admin) {
    await this.adminRepository.save(admin);
    return admin;
  }
}
