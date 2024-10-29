import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('建立新的使用者', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        name: '林小明',
      };
      const expectedResult = { id: 1, ...createUserDto };
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        data: expectedResult,
        message: '成功建立使用者',
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('取得所有使用者', async () => {
      const expectedResult = [
        { id: 1, email: 'user@example.com', name: '林小明' },
      ];
      mockUsersService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(result).toEqual({
        data: expectedResult,
        message: '成功取得所有使用者',
      });
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedResult = {
        id: 1,
        email: 'user@example.com',
        name: '林小明',
      };
      mockUsersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(userId);
      expect(result).toEqual({
        data: expectedResult,
        message: '成功取得特定使用者',
      });
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('更新使用者資訊', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const expectedResult = {
        id: 1,
        email: 'user@example.com',
        name: 'Updated Name',
      };
      mockUsersService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(userId, updateUserDto);
      expect(result).toEqual({
        data: expectedResult,
        message: '成功更新使用者資訊',
      });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('刪除使用者', async () => {
      const userId = '1';
      const expectedResult = {
        id: 1,
        email: 'user@example.com',
        name: '林小明',
      };
      mockUsersService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(userId);
      expect(result).toEqual({
        data: expectedResult,
        message: '成功刪除使用者',
      });
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
