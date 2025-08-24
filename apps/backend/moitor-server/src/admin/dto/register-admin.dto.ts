import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '用户名只能包含字母和数字、下划线和破折号' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 16)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/, {
    message: '密码只能包含字母、数字和特殊符号_、%、$，并且至少包含字母和数字'
  })
  password: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsString()
  @Length(11, 11)
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;
}
