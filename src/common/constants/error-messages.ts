import { HttpStatus } from '@nestjs/common';

export const ErrorMessages = {
  USER_NOT_FOUND: {
    message: '找不到該使用者',
    status: HttpStatus.NOT_FOUND,
  },
};
