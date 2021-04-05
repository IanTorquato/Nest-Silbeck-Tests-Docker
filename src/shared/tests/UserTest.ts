import { UserRole } from '../../modules/user/user-roles.interface';
import { User } from '../../modules/user/user.entity';

export default class UserTest {
  static giveAValidUser(): User {
    const user = new User();

    user.id = 1;
    user.name = 'Valid User';
    user.email = 'user@valid.com';
    user.password = 'validuser';
    user.role = UserRole.ADMIN;
    user.created_at = new Date();

    return user;
  }
}
