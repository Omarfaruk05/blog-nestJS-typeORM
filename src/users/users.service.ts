import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting userRepository
     */

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  /**
   * Create User
   */
  public async createUser(createUserDto: CreateUserDto) {
    // check is user exists with the same email
    const isExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    // handle exception

    // Create a new user

    const newUser = this.userRepository.create(createUserDto);
    const result = await this.userRepository.save(newUser);
    return result;
  }
  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll() {
    // test the new config

    console.log(this.profileConfiguration);

    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * find single user by ID
   */
  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}
