import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Injecting UserService
     */

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  // Functions Starts here
}
