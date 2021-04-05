import { UserRole } from '../user-roles.interface';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
