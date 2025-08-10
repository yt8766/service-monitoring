import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from '../../application/entities/application.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Application, application => application.admin, { cascade: true })
  applications: Application[];
}
