import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dot';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject UserService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject hashing provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject jwt service
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwt configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Function starts here
   */

  public async signIn(signInDto: SignInDto) {
    // Find user using email ID
    let user = await this.usersService.findOneByEmail(signInDto.email);

    // Throw an exception if user is not found
    // Compare password to he hash

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    //Send confirmation
    return {
      accessToken,
    };
  }
}
