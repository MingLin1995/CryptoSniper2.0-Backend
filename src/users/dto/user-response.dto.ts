import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class BaseResponseDto {
  @ApiProperty()
  message: string;
}

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({ type: User })
  data: User;
}

export class UsersResponseDto extends BaseResponseDto {
  @ApiProperty({ type: [User] })
  data: User[];
}

export class CreateUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: '成功建立使用者' })
  message: string;
}

export class GetAllUsersResponseDto extends UsersResponseDto {
  @ApiProperty({ example: '成功取得所有使用者' })
  message: string;
}

export class GetUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: '成功取得特定使用者' })
  message: string;
}

export class UpdateUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: '成功更新使用者資訊' })
  message: string;
}

export class DeleteUserResponseDto extends UserResponseDto {
  @ApiProperty({ example: '成功刪除使用者' })
  message: string;
}
