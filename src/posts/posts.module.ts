import { Module } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from 'src/meta-options/entities/metaOption.entity';
import { UsersModule } from 'src/users/users.module';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { CreatePostProvider } from './providers/create-post.provider';

@Module({
  controllers: [PostsController],
  providers: [PostsService, CreatePostProvider],
  imports: [
    UsersModule,
    TagsModule,
    PaginationModule,
    TypeOrmModule.forFeature([Post, MetaOption]),
  ],
})
export class PostsModule {}
