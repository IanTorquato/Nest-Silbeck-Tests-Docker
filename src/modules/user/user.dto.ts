import { UserRole } from './user-roles.interface';

interface UserDataCreate {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserDataFind {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
}

export { UserDataCreate, UserDataFind };
