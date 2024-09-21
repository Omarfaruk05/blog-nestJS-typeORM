import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dot';
import { SignInProvider } from './providers/sign-in.provider';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Injecting Auth Service
     */

    private readonly authService: AuthService,

    /**
     * Injecting SignIn provider
     */
    private readonly signInProviders: SignInProvider,
  ) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() signInDto: SignInDto) {
    return await this.signInProviders.signIn(signInDto);
  }
}
