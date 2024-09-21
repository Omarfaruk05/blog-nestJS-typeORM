import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { CreateManyUsersDto } from '../dto/create-many-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

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

    /**
     * Inject dataSource
     */

    private readonly dataSource: DataSource,

    /**
     * Inject create userProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Inject FinOneUserByEmailProvider
     */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  /**
   * Create User
   */
  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Create multiple user
   */

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    //Create query runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect query runner to data source
      await queryRunner.connect();

      // start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database.');
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // If successful commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If unsuccessful rollback
      await queryRunner.rollbackTransaction();

      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // Release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException('Could not release the connection', {
          description: String(error),
        });
      }
    }

    return newUsers;
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

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
