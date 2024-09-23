import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting postRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**
     * Inject Tag Repository
     */

    private readonly tagsService: TagsService,

    /**
     * Inject pagination provider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Inject createPostProvider
     */

    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Create Post
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery?.limit,
        page: postQuery?.page,
      },
      this.postsRepository,
    );
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  public async update(updatePostDto: UpdatePostDto) {
    let tags = undefined;
    let post = undefined;

    // Find the Tags

    try {
      tags = await this.tagsService.findMultipleTags(updatePostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Number of tags need to be equal

    if (!tags || tags.length !== updatePostDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct.',
      );
    }

    // Find the post
    try {
      post = await this.postsRepository.findOneBy({ id: updatePostDto?.id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('The post ID does not exist!');
    }
    // Update the properties
    post.title = updatePostDto.title ?? post?.title;
    post.content = updatePostDto.content ?? post?.content;
    post.status = updatePostDto.status ?? post?.status;
    post.postType = updatePostDto.postType ?? post?.postType;
    post.slug = updatePostDto.slug ?? post?.slug;
    post.featuredImageUrl =
      updatePostDto.featuredImageUrl ?? post?.featuredImageUrl;
    post.publishedOn = updatePostDto.publishedOn ?? post?.publishedOn;

    // Assign the new tags
    post.tags = tags;

    //Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return post;
  }

  public async remove(id: number) {
    // delete the post
    await this.postsRepository.delete(id);

    // confirmation
    return { deleted: true, id };
  }
}
