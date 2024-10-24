import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateUserResponseDto,
  GetAllUsersResponseDto,
  GetUserResponseDto,
  UpdateUserResponseDto,
  DeleteUserResponseDto,
} from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '建立新的使用者' })
  @ApiResponse({
    status: 201,
    description: '成功建立使用者',
    type: CreateUserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return { message: '成功建立使用者', data };
  }

  @Get()
  @ApiOperation({ summary: '取得所有使用者' })
  @ApiResponse({
    status: 200,
    description: '成功取得所有使用者',
    type: GetAllUsersResponseDto,
  })
  async findAll() {
    const data = await this.usersService.findAll();
    return { message: '成功取得所有使用者', data };
  }

  @Get(':id')
  @ApiOperation({ summary: '取得特定使用者' })
  @ApiResponse({
    status: 200,
    description: '成功取得特定使用者',
    type: GetUserResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id);
    return { message: '成功取得特定使用者', data };
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新使用者資訊' })
  @ApiResponse({
    status: 200,
    description: '成功更新使用者資訊',
    type: UpdateUserResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(+id, updateUserDto);
    return { message: '成功更新使用者資訊', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: '刪除使用者' })
  @ApiResponse({
    status: 200,
    description: '成功刪除使用者',
    type: DeleteUserResponseDto,
  })
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(+id);
    return { message: '成功刪除使用者', data };
  }
}
