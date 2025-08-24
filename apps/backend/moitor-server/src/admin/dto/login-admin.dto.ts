import { IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  email: string;
  phone: string;
  role: string;
}
