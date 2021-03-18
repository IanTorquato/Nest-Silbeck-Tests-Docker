import Redis, { Redis as RedisType } from 'ioredis';

import { redisConfig } from 'src/configs/redis';

class UserCache {
  private redis: RedisType;

  constructor() {
    this.redis = new Redis(redisConfig);
  }

  async findUsers() {
    const value = await this.redis.get('allUsers');

    if (!value) {
      return undefined;
    }

    return await JSON.parse(value);
  }

  createUser(key: string, value: any, timeExp: number) {
    return this.redis.set(key, JSON.stringify(value), 'EX', timeExp);
  }

  deleteOneCacheUser(key: string) {
    return this.redis.del(key);
  }

  async deleteAllCacheUser(prefix: string) {
    const keys = await this.redis.keys(`user:${prefix}:*`);

    console.log(keys);
    console.log(keys.map((key) => key.replace('user:', '')));

    return { ok: false };
    // return this.redis.del(keys)
  }
}

export default new UserCache();
