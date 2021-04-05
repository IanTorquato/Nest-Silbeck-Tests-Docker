import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityNotFoundError } from 'typeorm';

import UserTest from '../../shared/tests/UserTest';
import { User } from './user.entity';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    mockUserRepository.findOne.mockReset();
    mockUserRepository.save.mockReset();
    mockUserRepository.find.mockReset();
    mockUserRepository.findOneOrFail.mockReset();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = UserTest.giveAValidUser();

      mockUserRepository.findOne.mockReturnValue(undefined);
      mockUserRepository.save.mockReturnValue(user);

      const userFound = await userService.create(user);

      expect(userFound).toMatchObject({ name: user.name });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should not create a user (email already used)', async () => {
      const user = UserTest.giveAValidUser();

      mockUserRepository.findOne.mockReturnValue(user);

      // Primeira forma de se tratar excessões - Mais controle sobre o erro
      await userService.create(user).catch((error) => {
        expect(error).toBeInstanceOf(HttpException);
        expect(error).toMatchObject({
          message: 'Este e-mail já está sendo usado!',
          status: 409,
        });
      });

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(0);
    });

    it('should not create a user (failed to create user)', async () => {
      const user = UserTest.giveAValidUser();

      mockUserRepository.findOne.mockReturnValue(undefined);
      mockUserRepository.save.mockReturnValue(undefined);

      await userService.create(user).catch((error) => {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error).toMatchObject({
          status: 500,
        });
      });

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllUsers', () => {
    it('should list all users', async () => {
      const user = UserTest.giveAValidUser();

      mockUserRepository.find.mockReturnValue([user, { ...user, id: 2 }]);

      const users = await userService.findAll();

      expect(users).toHaveLength(2);
      expect(users).toMatchObject([{ id: 1 }, { id: 2 }]);
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should not list all users', async () => {
      mockUserRepository.find.mockReturnValue([]);

      await userService.findAll().catch((error) => {
        expect(error).toBeInstanceOf(EntityNotFoundError);
        expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('findOneUser', () => {
    it('should return a user', async () => {
      const user = UserTest.giveAValidUser();

      mockUserRepository.findOneOrFail.mockReturnValue(user);

      const userFound = await userService.findOne('user@valid.com');

      expect(userFound).toMatchObject({ name: user.name });
      expect(mockUserRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('should not return a user', async () => {
      mockUserRepository.findOneOrFail.mockReturnValue(
        new EntityNotFoundError(
          User,
          "select: ['id', 'name', 'email', 'role', 'created_at']",
        ),
      );

      // Segunda forma de se tratar excessões - Menos controle sobre o erro - Aparece no console
      userService.findOne('user@notexist.com').catch((error) => {
        expect(error).toBeInstanceOf(EntityNotFoundError);
        expect(mockUserRepository.findOneOrFail).toHaveBeenCalledTimes(1);
      });
    });
  });
});
