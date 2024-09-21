import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
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
    /**
     * Inject pagination provider
     */

    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * Create Post
   */
  public async create(createPostDto: CreatePostDto) {
    // Find the author  from database based an authorId
    let author = await this.userService.findOneById(createPostDto?.authorId);

    //Find tags

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // Create post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    // return the post
    return await this.postsRepository.save(post);
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
