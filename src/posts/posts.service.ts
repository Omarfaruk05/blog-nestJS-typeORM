import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/tags.service';

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
  public async findAll() {
    const posts = await this.postsRepository.find();
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  public async remove(id: number) {
    // delete the post
    await this.postsRepository.delete(id);

    // confirmation
    return { deleted: true, id };
  }
}
