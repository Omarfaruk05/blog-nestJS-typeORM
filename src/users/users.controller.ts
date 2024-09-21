import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    const result = this.usersService.createUser(createUserDto);
    return result;
  }

  @Get()
  public getUsers() {
    return this.usersService.findAll();
  }
}
