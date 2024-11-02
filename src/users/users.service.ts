import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CustomHttpException } from '../common/exceptions/custom-http.exception';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    // private readonly redisService: RedisService,
    private usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findAll() {
    // const data = await this.redisService.get('KlineDat');
    // console.log(data);
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new CustomHttpException('USER_NOT_FOUND');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.usersRepository.remove(id);
  }
}
