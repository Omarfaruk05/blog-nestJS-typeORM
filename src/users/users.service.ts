import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
    let existingUser = undefined;

    try {
      // check is user exists with the same email
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // handle exception

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }
    // Create a new user

    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return newUser;
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
    let user = undefined;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // handle user does not exist

    if (!user) {
      throw new BadRequestException('The user id does not exist!');
    }

    return user;
  }
}
