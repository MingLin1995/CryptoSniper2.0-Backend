import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
    });

    this.redis.on('error', (err) => {
      console.error('Redis 連接失敗', err);
    });
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}
