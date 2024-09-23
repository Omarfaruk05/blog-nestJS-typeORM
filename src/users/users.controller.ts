import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateManyUsersDto } from './dto/create-many-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(AuthType.None, AuthType.Bearer)
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
