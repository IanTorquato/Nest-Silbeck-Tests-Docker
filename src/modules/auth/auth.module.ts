import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [UserModule],
  providers: [RolesGuard],
})
export class AuthModule {
  // Empty
}
