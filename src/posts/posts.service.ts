import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from 'src/meta-options/entities/metaOption.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting postRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // Create post
    let post = this.postsRepository.create(createPostDto);

    // return the post
    return await this.postsRepository.save(post);
  }

  public async findAll() {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
