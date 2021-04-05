import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import {
  InternalServerExceptionFilter,
  NotFoundExceptionFilter,
} from './exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Scoped
  app.useGlobalFilters(
    new InternalServerExceptionFilter(),
    new NotFoundExceptionFilter(),
  );

  await app.listen(3333, () => console.log('Server running on post 3333'));
}

bootstrap();
