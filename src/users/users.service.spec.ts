import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from '../redis/redis.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

  // Mock RedisService
  const mockRedisService = {
    get: jest.fn(),
  };

  // Mock UsersRepository
  const mockUsersRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const expectedResult = { id: 1, ...createUserDto };
      mockUsersRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createUserDto);
      expect(result).toEqual(expectedResult);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should log Redis KlineData and return users', async () => {
      // 模擬 Redis 實際資料
      const mockKlineData = `[[1730553300000,"69529.80","69614.00","69529.70","69602.00","531.820",1730553599999,"37008939.40770",7181,"325.430","22645807.80770","0"],[1730553600000,"69602.00","69649.00","69600.80","69629.20","410.470",1730553899999,"28581609.91780",5852,"214.086","14906992.82970","0"]]`;

      mockRedisService.get.mockResolvedValue(mockKlineData);

      const expectedUsers = [
        { id: 1, email: 'test@example.com', name: 'Test User' },
      ];
      mockUsersRepository.findAll.mockResolvedValue(expectedUsers);

      // 監控 console.log
      const consoleSpy = jest.spyOn(console, 'log');

      const result = await service.findAll();

      // 驗證 Redis get 是否被呼叫且使用正確的 key
      expect(mockRedisService.get).toHaveBeenCalledWith('KlineData');

      // 驗證 console.log 是否被呼叫且印出 Redis 資料
      expect(mockRedisService.get).toHaveBeenCalledWith('KlineData');
      expect(consoleSpy).toHaveBeenCalledWith(mockKlineData);

      // 驗證回傳值
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedResult = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      };
      mockUsersRepository.findOne.mockResolvedValue(expectedResult);

      const result = await service.findOne(userId);
      expect(result).toEqual(expectedResult);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const expectedResult = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
      };
      mockUsersRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(userId, updateUserDto);
      expect(result).toEqual(expectedResult);
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const expectedResult = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
      };
      mockUsersRepository.remove.mockResolvedValue(expectedResult);

      const result = await service.remove(userId);
      expect(result).toEqual(expectedResult);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(userId);
    });
  });
});
