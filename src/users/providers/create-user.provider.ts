import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject user repository
     */

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Inject hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject mailService
     */
    private readonly mailService: MailService,
  ) {}

  /**
   * Function starts here
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

    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(
        createUserDto?.password,
      ),
    });
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
    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    return newUser;
  }
}
