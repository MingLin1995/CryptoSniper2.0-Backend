import { HttpException } from '@nestjs/common';
import { ErrorMessages } from '../constants/error-messages';

export class CustomHttpException extends HttpException {
  constructor(errorKey: keyof typeof ErrorMessages, details?: any) {
    const errorDetails = ErrorMessages[errorKey];
    super(
      {
        message: errorDetails.message,
        statusCode: errorDetails.status,
        details,
      },
      errorDetails.status,
    );
  }
}
