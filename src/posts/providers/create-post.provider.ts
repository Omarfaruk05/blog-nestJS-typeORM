import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { TagsService } from 'src/tags/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * Injecting Users Service
     */
    private readonly userService: UsersService,

    /**
     * Injecting postRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject Tag Repository
     */
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags = undefined;
    try {
      // Find the author  from database based an authorId
      author = await this.userService.findOneById(user?.sub);

      //Find tags
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException("Please check your tag id's.");
    }

    // Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      // return the post
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate.',
      });
    }
  }
}
