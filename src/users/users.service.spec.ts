import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;

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
    it('should return an array of users', async () => {
      const expectedResult = [
        { id: 1, email: 'test@example.com', name: 'Test User' },
      ];
      mockUsersRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(result).toEqual(expectedResult);
      expect(mockUsersRepository.findAll).toHaveBeenCalled();
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
