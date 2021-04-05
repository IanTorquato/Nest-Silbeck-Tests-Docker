import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
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
  async create(@Body() data: CreateUserDto): Promise<FindUserDto> {
    return await this.userService.create(data);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async findAll(): Promise<FindUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':email')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  async finOne(@Param() params: { email: string }): Promise<FindUserDto> {
    return this.userService.findOne(params.email);
  }
}
