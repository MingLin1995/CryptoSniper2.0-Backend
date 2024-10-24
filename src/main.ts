import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 使用全局異常過濾器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 使用全局管道來處理輸入驗證
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 只允許定義在 DTO 中的屬性通過
      transform: true, // 自動轉換輸入數據類型
      forbidNonWhitelisted: true, // 如果請求中包含未定義的屬性，則拋出錯誤
      transformOptions: {
        enableImplicitConversion: false, // 禁止隱式類型轉換
      },
      skipMissingProperties: false, // 確保必須的屬性都存在
      exceptionFactory: (errors) => {
        const messages = errors.map((error) =>
          Object.values(error.constraints).join(', '),
        );
        return new HttpException(
          { message: messages, error: 'Bad Request' },
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );

  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const config = new DocumentBuilder()
    .setTitle('Crypto Sniper 2.0 API')
    .setVersion(`v${packageJson.version}`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'accessToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.servers = [
    {
      url: '/api',
      description: 'API 前綴，搭配 Nginx 設定',
    },
  ];
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
