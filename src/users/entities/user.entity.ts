import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: '使用者 ID' })
  id: number;

  @ApiProperty({ example: 'john@example.com', description: '使用者電子郵件' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: '使用者名稱' })
  name: string;
}
