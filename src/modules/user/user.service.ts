import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError, getConnection, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import UserCache from 'src/lib/user-cache';
import { UserDataCreate, UserDataFind } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {
    // Empty
  }

  async create(data: UserDataCreate): Promise<UserDataFind> {
    const { name, email, role, password } = data;

    const userExist = await this.userRepository.findOne({ email });

    if (userExist) {
      throw new HttpException(
        'Este e-mail já está sendo usado!',
        HttpStatus.CONFLICT,
      );
    }

    const passwordEncrypted = await bcrypt.hash(password, 8);

    const user = new User();

    user.name = name;
    user.email = email;
    user.role = role;
    user.password = passwordEncrypted;

    return await this.userRepository.save(user).then(async (newUser) => {
      const { password, ...responseUser } = newUser;

      await getConnection().queryResultCache?.remove(['all']);

      return responseUser;
    });
  }

  // Cache usando "ioredis" + Arquivo src/lib/user-cache.ts
  async findAll(): Promise<UserDataFind[]> {
    console.log(' ');
    console.log('--> Buscando cache');

    const usersInCache = await UserCache.findUsers();

    if (usersInCache) {
      return usersInCache;
    }

    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'created_at'],
    });

    if (!users[0]) {
      throw new EntityNotFoundError(
        User,
        "select: ['id', 'name', 'email', 'role', 'created_at']",
      );
    }

    console.log('--> Criando cache');
    UserCache.createUser('all', users, 60 * 1);

    return users;
  }

  async findOne(email: string): Promise<UserDataFind> {
    const user = await this.userRepository.findOneOrFail({
      select: ['id', 'name', 'email', 'role', 'created_at'],
      where: { email },
    });

    return user;
  }
}
