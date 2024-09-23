import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateUserProvider } from './providers/create-user.provider';
import profileConfig from './config/profile.config';
import { AuthModule } from 'src/auth/auth.module';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider, FindOneUserByEmailProvider],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
