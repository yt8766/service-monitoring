import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '用户名只能包含字母和数字、下划线和破折号' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 16)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: '用户名只能包含字母、数字、下划线和破折号'
  })
  password: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    {
      message: '邮箱格式不正确'
    }
  )
  email: string;

  @IsString()
  @IsOptional()
  @Length(11, 11)
  @Matches(
    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
    { message: '手机号格式不正确' }
  )
  phone: string;

  @IsString()
  @IsOptional()
  role: string;
}
