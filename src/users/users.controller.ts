import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateManyUsersDto } from './dto/create-many-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('/create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Get()
  public getUsers() {
    return this.usersService.findAll();
  }
  @Get('/:id')
  public getSingleUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}
