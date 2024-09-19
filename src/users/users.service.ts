import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting userRepository
     */

    @InjectRepository(User)
    private userRepository: Repository<User>,
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
   * find single user by ID
   */
  public async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}
