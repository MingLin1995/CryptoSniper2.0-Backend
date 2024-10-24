import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { status, message, errorData } =
      this.determineErrorResponse(exception);

    const taipeiTime = new Date().toLocaleString('zh-TW', {
      timeZone: 'Asia/Taipei',
    });

    const responseBody = {
      status,
      message,
      // 未來可以將相關錯誤資訊存入DB
      // error: {
      //   timestamp: taipeiTime,
      //   statusCode: status,
      //   errorMessage: message,
      //   errorType: exception.constructor.name,
      //   requestUrl: request.url,
      //   requestMethod: request.method,
      //   requestBody: JSON.stringify(request.body),
      //   requestParams: JSON.stringify(request.params),
      //   requestQuery: JSON.stringify(request.query),
      //   userId: (request as any).user?.userId,
      //   clientIp: request.ip,
      //   stackTrace: exception instanceof Error ? exception.stack : undefined,
      // },
    };

    this.logger.error('Error:', responseBody);

    response.status(status).json(responseBody);
  }

  private determineErrorResponse(exception: unknown): {
    status: number;
    message: string;
    errorData?: any;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as any;
      return {
        status,
        message: response.message,
      };
    } else if (exception instanceof PrismaClientKnownRequestError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: this.handlePrismaError(exception),
        errorData: { code: exception.code, meta: exception.meta },
      };
    } else if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Internal server error',
        errorData: {},
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unknown error occurred',
      errorData: {},
    };
  }

  private handlePrismaError(exception: PrismaClientKnownRequestError): string {
    switch (exception.code) {
      case 'P2002':
        return '新增或更新資料失敗，該資料中的唯一欄位已存在，請檢查並修改重複的資料';
      case 'P2003':
        return '操作失敗，外鍵約束錯誤，請確保關聯的資料存在並且有效';
      case 'P2025':
        return '操作失敗，找不到要更新或刪除的記錄，請確認資料是否存在';
      case 'P2014':
        return '操作失敗，違反資料庫的唯一性約束，請檢查並修改重複的資料';
      case 'P2016':
        return '查詢參數無效，請檢查輸入的資料格式是否正確';
      case 'P2001':
        return '操作失敗，找不到符合條件的記錄，請確認查詢條件是否正確';
      case 'P2017':
        return '關聯錯誤，請確保所有相關聯的資料都存在並且關係正確';
      default:
        return `資料庫操作錯誤（錯誤代碼：${exception.code}）：${exception.message}`;
    }
  }
}
