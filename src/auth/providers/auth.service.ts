import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dot';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Injecting singIn provider
     */
    private readonly signProvider: SignInProvider,
    /**
     * Injecting refresh tokens provider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  // Functions Starts here

  public async signIn(signInDto: SignInDto) {
    return await this.signProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokensDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokensDto);
  }
}
