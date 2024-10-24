import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: '使用者電子郵件' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '林小明',
    description: '使用者名稱',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
