import { databaseConfig } from 'src/configs/database';

// const portRedis = Number(process.env.REDIS_PORT);

export default {
  ...databaseConfig,
  migrations: ['dist/src/database/migrations/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  // Não funcionou typeorm + redis
  // cache: {
  //   type: 'redis',
  //   options: {
  //     host: process.env.REDIS_HOST,
  //     port: portRedis,
  //     prefix: 'user:',
  //   },
  // },
};
