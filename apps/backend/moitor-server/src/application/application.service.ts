import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(@InjectRepository(Application) private readonly applicationRepository: Repository<Application>) {}
  async create(application: Application) {
    await this.applicationRepository.save(application);
    return application;
  }

  async findAll(params: { userId: number }) {
    const { userId } = params;
    const [data, total] = await this.applicationRepository.findAndCount({
      where: { admin: { id: userId } }
    });
    return {
      applications: data,
      total
    };
  }
}
