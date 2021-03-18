import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { UserDataCreate, UserDataFind } from './user.dto';
import { UserService } from './user.service';
import { UserRole } from './user-roles.interface';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
// Controller Scoped
// @UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {
    // Empty
  }

  @Post()
  async create(@Body() data: UserDataCreate): Promise<UserDataFind> {
    return await this.userService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findAll(): Promise<UserDataFind[]> {
    return this.userService.findAll();
  }

  @Get(':email')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async finOne(@Param() params: { email: string }): Promise<UserDataFind> {
    return this.userService.findOne(params.email);
  }
}
