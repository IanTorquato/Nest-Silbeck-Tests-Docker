import { createConnection } from 'typeorm';

import { databaseConfig } from 'src/configs/database';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection(databaseConfig),
  },
];
