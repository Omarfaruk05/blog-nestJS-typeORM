import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    /**
     * Inject the users repository
     */

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Functions starts here
   */

  public async findOneByEmail(email: string) {
    let user: User | undefined = undefined;

    try {
      // this return null is user does not exist
      user = await this.usersRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
